// ============================================================
// 余晖谷 Embervale - 幽光森林地图数据
// ============================================================

import type { GameMap } from '../types';

const W = 80;
const H = 60;

export function createForestMap(): GameMap {
  const collision: boolean[][] = [];

  for (let row = 0; row < H; row++) {
    collision[row] = [];
    for (let col = 0; col < W; col++) {
      const isBorder = col <= 0 || col >= W - 1 || row <= 0 || row >= H - 1;

      // 大树（橡树区域）
      const isBigTree = (
        (col >= 15 && col <= 18 && row >= 15 && row <= 18) ||
        (col >= 35 && col <= 38 && row >= 10 && row <= 13) ||
        (col >= 55 && col <= 58 && row >= 25 && row <= 28) ||
        (col >= 25 && col <= 28 && row >= 40 && row <= 43)
      );

      // 空心橡树（露娜所在地）
      const isHollowOak = (col >= 38 && col <= 42 && row >= 38 && row <= 42);

      // 岩壁
      const isRock = (col >= 60 && col <= 65 && row >= 5 && row <= 20);

      collision[row][col] = isBorder || isBigTree || isHollowOak || isRock;
    }
  }

  const map: GameMap = {
    id: 'forest',
    name: '幽光森林',
    width: W,
    height: H,
    layers: [],
    collision,
    transitions: [
      { fromTileX: W - 2, fromTileY: Math.floor(H / 2), toMapId: 'farm', toTileX: 2, toTileY: Math.floor(60 / 2) - 2 },
    ],
    npcPositions: [
      { npcId: 'luna', tileX: 40, tileY: 43 },
    ],
  };

  return map;
}
