// ============================================================
// 余晖谷 Embervale - 农场地图数据
// ============================================================

import type { GameMap } from '../types';

const W = 80;
const H = 60;

export function createFarmMap(): GameMap {
  const collision: boolean[][] = [];

  for (let row = 0; row < H; row++) {
    collision[row] = [];
    for (let col = 0; col < W; col++) {
      // 边界碰撞
      const isBorder = col <= 0 || col >= W - 1 || row <= 0 || row >= H - 1;

      // 水塘碰撞
      const isWater = (
        (col >= 5 && col <= 9 && row >= 5 && row <= 13) ||
        (col >= W - 11 && col <= W - 3 && row >= H - 16 && row <= H - 3)
      );

      // 房屋碰撞 (9,9)-(13,12)
      const isHouse = (col >= 9 && col <= 13 && row >= 9 && row <= 12);

      collision[row][col] = isBorder || isWater || isHouse;
    }
  }

  const map: GameMap = {
    id: 'farm',
    name: '晨曦农场',
    width: W,
    height: H,
    layers: [],
    collision,
    transitions: [
      { fromTileX: W - 2, fromTileY: Math.floor(H / 2), toMapId: 'town', toTileX: 2, toTileY: Math.floor(40 / 2) },
      { fromTileX: 1, fromTileY: Math.floor(H / 2) - 2, toMapId: 'forest', toTileX: 78, toTileY: Math.floor(60 / 2) },
    ],
    npcPositions: [
      { npcId: 'old_tom', tileX: 2, tileY: 2 },
    ],
  };

  return map;
}
