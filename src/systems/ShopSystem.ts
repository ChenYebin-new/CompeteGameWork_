// ============================================================
// 余晖谷 Embervale - 商店系统
// ============================================================

import { ITEMS } from '../data/items';
import { ItemCategory } from '../types';
import type { Player } from '../entities/Player';

export interface ShopEntry {
  itemId: string;
  stock: number;       // -1 = 无限
  buyPrice?: number;   // 默认用 ITEMS.buyPrice
  sellPrice?: number;  // 默认用 ITEMS.sellPrice
}

export interface Transaction {
  success: boolean;
  message: string;
  itemId: string;
  quantity: number;
  totalPrice: number;
}

export class ShopSystem {
  public shopName: string;
  public inventory: ShopEntry[] = [];
  private player: Player;

  constructor(player: Player, shopName: string = '商店') {
    this.player = player;
    this.shopName = shopName;
  }

  // ========== 设置库存 ==========

  setInventory(entries: ShopEntry[]): void {
    this.inventory = entries;
  }

  // ========== 购买 ==========

  buyItem(itemId: string, quantity: number = 1): Transaction {
    const entry = this.inventory.find(e => e.itemId === itemId);
    const itemData = ITEMS[itemId];

    if (!entry || !itemData) {
      return { success: false, message: '该物品不存在于商店中', itemId, quantity, totalPrice: 0 };
    }

    if (entry.stock !== -1 && quantity > entry.stock) {
      return { success: false, message: '库存不足', itemId, quantity, totalPrice: 0 };
    }

    const unitPrice = entry.buyPrice ?? itemData.buyPrice;
    const totalPrice = unitPrice * quantity;

    if (!this.player.spendGold(totalPrice)) {
      return { success: false, message: '金币不足！', itemId, quantity, totalPrice };
    }

    if (!this.player.addItem(itemId, quantity)) {
      this.player.addGold(totalPrice); // 退款
      return { success: false, message: '背包已满！', itemId, quantity, totalPrice };
    }

    if (entry.stock !== -1) {
      entry.stock -= quantity;
    }

    return {
      success: true,
      message: `购买了 ${itemData.name} x${quantity}`,
      itemId, quantity, totalPrice,
    };
  }

  // ========== 出售 ==========

  sellItem(itemId: string, quantity: number = 1): Transaction {
    const itemData = ITEMS[itemId];
    if (!itemData || itemData.sellPrice <= 0) {
      return { success: false, message: '该物品不可出售', itemId, quantity, totalPrice: 0 };
    }

    if (!this.player.removeItem(itemId, quantity)) {
      return { success: false, message: '背包中没有足够数量', itemId, quantity, totalPrice: 0 };
    }

    const totalPrice = itemData.sellPrice * quantity;
    this.player.addGold(totalPrice);

    return {
      success: true,
      message: `出售了 ${itemData.name} x${quantity}`,
      itemId, quantity, totalPrice,
    };
  }

  // ========== 获取商品列表 ==========

  getShopItems(): { itemId: string; stock: number; price: number; name: string }[] {
    return this.inventory
      .filter(e => e.stock === -1 || e.stock > 0)
      .map(e => {
        const itemData = ITEMS[e.itemId];
        return {
          itemId: e.itemId,
          stock: e.stock,
          price: e.buyPrice ?? itemData?.buyPrice ?? 0,
          name: itemData?.name ?? e.itemId,
        };
      });
  }

  // ========== 预设商店 ==========

  static createHanaShop(player: Player): ShopSystem {
    const shop = new ShopSystem(player, '哈娜的百宝箱');
    shop.setInventory([
      { itemId: 'seed_parsnip', stock: -1 },      // 春季种子
      { itemId: 'seed_potato', stock: -1 },
      { itemId: 'seed_tomato', stock: -1 },       // 夏季种子
      { itemId: 'seed_starberry', stock: 3 },      // 限购
      { itemId: 'hoe', stock: 1 },
      { itemId: 'watering_can', stock: 1 },
      { itemId: 'scythe', stock: 1 },
      { itemId: 'stone', stock: -1, buyPrice: 15 },
      { itemId: 'wood', stock: -1, buyPrice: 15 },
      { itemId: 'fiber', stock: -1, buyPrice: 10 },
    ]);
    return shop;
  }

  static createHankShop(player: Player): ShopSystem {
    const shop = new ShopSystem(player, '汉克铁匠铺');
    shop.setInventory([
      { itemId: 'hoe', stock: 1, buyPrice: 200 },
      { itemId: 'watering_can', stock: 1, buyPrice: 200 },
      { itemId: 'axe', stock: 1, buyPrice: 300 },
      { itemId: 'pickaxe', stock: 1, buyPrice: 300 },
      { itemId: 'scythe', stock: 1, buyPrice: 150 },
      { itemId: 'stone', stock: -1, buyPrice: 18 },
      { itemId: 'wood', stock: -1, buyPrice: 18 },
    ]);
    return shop;
  }
}
