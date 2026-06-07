// ============================================================
// 余晖谷 Embervale - 全局游戏常量
// ============================================================

import { Season, Weather } from '../types';

/** 画布分辨率 - 1080p */
export const GAME_WIDTH = 1920;
export const GAME_HEIGHT = 1080;

/** 瓦片尺寸 */
export const TILE_SIZE = 48;

/** 地图可视化区域 */
export const MAP_VIEW_TILES_X = Math.ceil(GAME_WIDTH / TILE_SIZE) + 2;
export const MAP_VIEW_TILES_Y = Math.ceil(GAME_HEIGHT / TILE_SIZE) + 2;

/** 实际地图大小（瓦片数） */
export const FARM_MAP_WIDTH = 80;
export const FARM_MAP_HEIGHT = 60;

/** 玩家移动速度 (px/s) */
export const PLAYER_SPEED = 160;

/** 时间流速（现实秒:游戏分钟） */
export const TIME_SPEED = 0.5;

/** 每日时间范围 */
export const DAY_START_HOUR = 6;
export const DAY_END_HOUR = 26;
export const HOURS_PER_DAY = DAY_END_HOUR - DAY_START_HOUR;

/** 季节长度（天） */
export const DAYS_PER_SEASON = 28;

/** 玩家初始属性 */
export const INITIAL_PLAYER = {
  name: '莱拉',
  gold: 500,
  stamina: 100,
  maxStamina: 100,
  inventorySize: 24,
};

/** 每小时体力恢复量 */
export const STAMINA_REGEN_PER_HOUR = 2;

/** 体力消耗 */
export const STAMINA_COST = {
  HOE: 5,
  WATER: 3,
  PLANT: 2,
  HARVEST: 3,
};

/** 季节配置 */
export const SEASON_CONFIG: Record<Season, {
  name: string; color: number; dayLengthMultiplier: number;
  weatherWeights: { sunny: number; rainy: number; cloudy: number; stormy: number };
}> = {
  [Season.SPRING]: {
    name: '春', color: 0x6BBF59, dayLengthMultiplier: 1.0,
    weatherWeights: { sunny: 0.55, rainy: 0.25, cloudy: 0.15, stormy: 0.05 },
  },
  [Season.SUMMER]: {
    name: '夏', color: 0xE8A317, dayLengthMultiplier: 1.2,
    weatherWeights: { sunny: 0.65, rainy: 0.10, cloudy: 0.15, stormy: 0.10 },
  },
  [Season.AUTUMN]: {
    name: '秋', color: 0xC49A3C, dayLengthMultiplier: 0.9,
    weatherWeights: { sunny: 0.50, rainy: 0.20, cloudy: 0.20, stormy: 0.10 },
  },
  [Season.WINTER]: {
    name: '冬', color: 0x87CEEB, dayLengthMultiplier: 0.7,
    weatherWeights: { sunny: 0.40, rainy: 0.05, cloudy: 0.25, stormy: 0.30 },
  },
};

/** 颜色常量 */
export const COLORS = {
  SKY_DAY: 0x5B7DB1,
  SKY_NIGHT: 0x1A1A2E,
  FARM_GREEN: 0x4A8C3F,
  HARVEST_GOLD: 0xC49A3C,
  PARCHMENT: 0xF5E6C8,
  DIALOG_BG: 0x3C2E1F,
  UI_BG: 0x1A1210,
  UI_PANEL: 0x2A1A0A,
  WHITE: 0xFFFFFF,
  BLACK: 0x000000,
  GOLD_COIN: 0xFFD700,
  STAMINA_GREEN: 0x4CAF50,
  STAMINA_RED: 0xF44336,
  HEART_RED: 0xFF4081,
  BUTTON_WOOD: 0x8B6914,
  BUTTON_HOVER: 0xC49A3C,
  UI_GOLD: 0xDAA520,
  UI_DARK_BROWN: 0x3C1E0A,
  UI_MID_BROWN: 0x5C3A1E,
  TEXT_LIGHT: 0xF5E6C8,
  TEXT_GOLD: 0xC49A3C,
};
