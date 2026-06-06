// ============================================================
// 余晖谷 Embervale - 作物数据（阶段5实现）
// ============================================================

import type { CropData } from '../types';
import { Season } from '../types';

export const CROPS: Record<string, CropData> = {
  parsnip: {
    id: 'parsnip',
    name: '防风草',
    seedItemId: 'seed_parsnip',
    harvestItemId: 'parsnip',
    growthDays: 4,
    totalStages: 5,
    regrowDays: 0,
    seasons: [Season.SPRING],
    waterNeeded: 1,
    texturePrefix: 'crop_parsnip',
  },
  potato: {
    id: 'potato',
    name: '马铃薯',
    seedItemId: 'seed_potato',
    harvestItemId: 'potato',
    growthDays: 6,
    totalStages: 5,
    regrowDays: 0,
    seasons: [Season.SPRING],
    waterNeeded: 1,
    texturePrefix: 'crop_potato',
  },
  tomato: {
    id: 'tomato',
    name: '番茄',
    seedItemId: 'seed_tomato',
    harvestItemId: 'tomato',
    growthDays: 5,
    totalStages: 5,
    regrowDays: 4,
    seasons: [Season.SUMMER],
    waterNeeded: 1,
    texturePrefix: 'crop_tomato',
  },
  starberry: {
    id: 'starberry',
    name: '星辉莓',
    seedItemId: 'seed_starberry',
    harvestItemId: 'starberry',
    growthDays: 12,
    totalStages: 5,
    regrowDays: 0,
    seasons: [Season.AUTUMN],
    waterNeeded: 2,
    texturePrefix: 'crop_starberry',
  },
};
