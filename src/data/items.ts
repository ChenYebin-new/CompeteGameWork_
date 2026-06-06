// ============================================================
// 余晖谷 Embervale - 物品数据（阶段6实现）
// ============================================================

import type { ItemData } from '../types';
import { ItemCategory } from '../types';

export const ITEMS: Record<string, ItemData> = {
  // 工具
  hoe: {
    id: 'hoe', name: '锄头', category: ItemCategory.TOOL,
    description: '用来翻松土地', sellPrice: 0, buyPrice: 200,
    stackable: false, maxStack: 1, textureKey: 'icon_hoe',
  },
  watering_can: {
    id: 'watering_can', name: '水壶', category: ItemCategory.TOOL,
    description: '用来浇灌作物', sellPrice: 0, buyPrice: 200,
    stackable: false, maxStack: 1, textureKey: 'icon_watering',
  },
  axe: {
    id: 'axe', name: '斧头', category: ItemCategory.TOOL,
    description: '用来砍伐木桩', sellPrice: 0, buyPrice: 300,
    stackable: false, maxStack: 1, textureKey: 'icon_axe',
  },
  pickaxe: {
    id: 'pickaxe', name: '十字镐', category: ItemCategory.TOOL,
    description: '用来敲碎石头', sellPrice: 0, buyPrice: 300,
    stackable: false, maxStack: 1, textureKey: 'icon_pickaxe',
  },
  scythe: {
    id: 'scythe', name: '镰刀', category: ItemCategory.TOOL,
    description: '用来割除杂草', sellPrice: 0, buyPrice: 150,
    stackable: false, maxStack: 1, textureKey: 'icon_scythe',
  },

  // 种子
  seed_parsnip: {
    id: 'seed_parsnip', name: '防风草种子', category: ItemCategory.SEED,
    description: '春天播种，4天成熟', sellPrice: 5, buyPrice: 20,
    stackable: true, maxStack: 99, textureKey: 'icon_seed_bag',
  },
  seed_potato: {
    id: 'seed_potato', name: '马铃薯种子', category: ItemCategory.SEED,
    description: '春天播种，6天成熟', sellPrice: 7, buyPrice: 30,
    stackable: true, maxStack: 99, textureKey: 'icon_seed_bag',
  },
  seed_tomato: {
    id: 'seed_tomato', name: '番茄种子', category: ItemCategory.SEED,
    description: '夏天播种，持续收获', sellPrice: 8, buyPrice: 35,
    stackable: true, maxStack: 99, textureKey: 'icon_seed_bag',
  },
  seed_starberry: {
    id: 'seed_starberry', name: '星辉莓种子', category: ItemCategory.SEED,
    description: '秋天播种，传说级作物', sellPrice: 25, buyPrice: 100,
    stackable: true, maxStack: 99, textureKey: 'icon_seed_bag',
  },

  // 产物
  parsnip: {
    id: 'parsnip', name: '防风草', category: ItemCategory.CROP,
    description: '营养丰富的根茎类蔬菜', sellPrice: 15, buyPrice: 0,
    stackable: true, maxStack: 99, textureKey: 'icon_parsnip',
  },
  potato: {
    id: 'potato', name: '马铃薯', category: ItemCategory.CROP,
    description: '大地朴实无华的馈赠', sellPrice: 20, buyPrice: 0,
    stackable: true, maxStack: 99, textureKey: 'icon_potato',
  },
  tomato: {
    id: 'tomato', name: '番茄', category: ItemCategory.CROP,
    description: '饱满多汁的夏日果实', sellPrice: 18, buyPrice: 0,
    stackable: true, maxStack: 99, textureKey: 'icon_tomato',
  },
  starberry: {
    id: 'starberry', name: '星辉莓', category: ItemCategory.CROP,
    description: '传说在星辉雨中诞生的果实，发出微弱光芒', sellPrice: 80, buyPrice: 0,
    stackable: true, maxStack: 99, textureKey: 'icon_starberry',
  },

  // 材料
  stone: {
    id: 'stone', name: '石头', category: ItemCategory.MATERIAL,
    description: '基础建筑材料', sellPrice: 5, buyPrice: 15,
    stackable: true, maxStack: 999, textureKey: 'icon_stone',
  },
  wood: {
    id: 'wood', name: '木材', category: ItemCategory.MATERIAL,
    description: '基础建筑材料', sellPrice: 5, buyPrice: 15,
    stackable: true, maxStack: 999, textureKey: 'icon_wood',
  },
  fiber: {
    id: 'fiber', name: '纤维', category: ItemCategory.MATERIAL,
    description: '用于编织和制作', sellPrice: 2, buyPrice: 10,
    stackable: true, maxStack: 999, textureKey: 'icon_fiber',
  },
};
