// ============================================================
// 余晖谷 Embervale - 背包管理系统
// ============================================================

import { ITEMS } from '../data/items';
import type { InventorySlot, ItemData } from '../types';

export class InventorySystem {
  public slots: InventorySlot[] = [];
  public maxSlots: number;

  constructor(maxSlots: number = 24) {
    this.maxSlots = maxSlots;
    this.slots = this.createEmptySlots();
  }

  private createEmptySlots(): InventorySlot[] {
    return Array.from({ length: this.maxSlots }, () => ({ itemId: '', quantity: 0 }));
  }

  // ========== 添加物品 ==========

  addItem(itemId: string, quantity: number = 1): boolean {
    const itemData = ITEMS[itemId];
    if (!itemData) return false;

    let remaining = quantity;

    // 先尝试堆叠
    if (itemData.stackable) {
      for (const slot of this.slots) {
        if (slot.itemId === itemId && slot.quantity < itemData.maxStack) {
          const space = itemData.maxStack - slot.quantity;
          const add = Math.min(space, remaining);
          slot.quantity += add;
          remaining -= add;
          if (remaining <= 0) return true;
        }
      }
    }

    // 找空位
    while (remaining > 0) {
      const emptySlot = this.slots.find(s => s.itemId === '' || s.quantity <= 0);
      if (!emptySlot) return false; // 背包满

      if (itemData.stackable) {
        const add = Math.min(itemData.maxStack, remaining);
        emptySlot.itemId = itemId;
        emptySlot.quantity = add;
        remaining -= add;
      } else {
        emptySlot.itemId = itemId;
        emptySlot.quantity = 1;
        remaining -= 1;
      }
    }

    return true;
  }

  // ========== 移除物品 ==========

  removeItem(itemId: string, quantity: number = 1): boolean {
    let remaining = quantity;

    for (const slot of this.slots) {
      if (slot.itemId === itemId) {
        const remove = Math.min(slot.quantity, remaining);
        slot.quantity -= remove;
        remaining -= remove;

        if (slot.quantity <= 0) {
          slot.itemId = '';
          slot.quantity = 0;
        }

        if (remaining <= 0) return true;
      }
    }

    return false; // 不够
  }

  // ========== 查询 ==========

  hasItem(itemId: string, quantity: number = 1): boolean {
    return this.getItemCount(itemId) >= quantity;
  }

  getItemCount(itemId: string): number {
    let count = 0;
    for (const slot of this.slots) {
      if (slot.itemId === itemId) count += slot.quantity;
    }
    return count;
  }

  getSlot(index: number): InventorySlot | null {
    if (index < 0 || index >= this.slots.length) return null;
    return this.slots[index];
  }

  getItemData(itemId: string): ItemData | null {
    return ITEMS[itemId] ?? null;
  }

  // ========== 排序 ==========

  sort(): void {
    // 按类别→名称排序
    this.slots.sort((a, b) => {
      if (a.itemId === '' && b.itemId === '') return 0;
      if (a.itemId === '') return 1;
      if (b.itemId === '') return -1;

      const itemA = ITEMS[a.itemId];
      const itemB = ITEMS[b.itemId];
      if (!itemA || !itemB) return 0;

      if (itemA.category !== itemB.category) {
        return itemA.category.localeCompare(itemB.category);
      }
      return itemA.name.localeCompare(itemB.name);
    });
  }

  // ========== 扩容 ==========

  expandSlots(additionalSlots: number): void {
    const newSlots = Array.from({ length: additionalSlots }, () => ({ itemId: '', quantity: 0 }));
    this.slots.push(...newSlots);
    this.maxSlots += additionalSlots;
  }

  // ========== 序列化 ==========

  toJSON(): InventorySlot[] {
    return this.slots.map(s => ({ ...s }));
  }

  fromJSON(data: InventorySlot[]): void {
    this.slots = data.map(s => ({ ...s }));
    this.maxSlots = this.slots.length;
  }
}
