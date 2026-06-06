// ============================================================
// 余晖谷 Embervale - 余晖镇地图数据
// ============================================================

import type { GameMap } from '../types';

const W = 40;
const H = 40;

export function createTownMap(): GameMap {
  const collision: boolean[][] = [];

  for (let row = 0; row < H; row++) {
    collision[row] = [];
    for (let col = 0; col < W; col++) {
      const isBorder = col <= 0 || col >= W - 1 || row <= 0 || row >= H - 1;

      // 建筑碰撞
      const isLibrary = (col >= 10 && col <= 14 && row >= 9 && row <= 16);
      const isChurch  = (col >= 30 && col <= 34 && row >= 9 && row <= 16);
      const isInn     = (col >= 20 && col <= 24 && row >= 7 && row <= 12);
      const isShop    = (col >= 10 && col <= 14 && row >= 29 && row <= 34);
      const isForge   = (col >= 29 && col <= 34 && row >= 29 && row <= 34);

      // 广场喷泉
      const isFountain = (col >= 22 && col <= 24 && row >= 22 && row <= 24);

      collision[row][col] = isBorder || isLibrary || isChurch || isInn || isShop || isForge || isFountain;
    }
  }

  const map: GameMap = {
    id: 'town',
    name: '余晖镇',
    width: W,
    height: H,
    layers: [],
    collision,
    transitions: [
      { fromTileX: 1, fromTileY: Math.floor(H / 2), toMapId: 'farm', toTileX: 78, toTileY: Math.floor(60 / 2) },
    ],
    npcPositions: [
      { npcId: 'lily', tileX: 12, tileY: 17 },
      { npcId: 'erin', tileX: 22, tileY: 13 },
      { npcId: 'sebastian', tileX: 32, tileY: 17 },
      { npcId: 'hana', tileX: 12, tileY: 35 },
      { npcId: 'hank', tileX: 32, tileY: 35 },
      { npcId: 'shadow', tileX: 22, tileY: 26 },
    ],
  };

  return map;
}
