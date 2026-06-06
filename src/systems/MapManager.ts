// ============================================================
// 余晖谷 Embervale - 地图管理器（RenderTexture 平滑渲染）
// ============================================================

import Phaser from 'phaser';
import { TILE_SIZE, COLORS } from '../config/game';
import type { GameMap, MapTransition } from '../types';

export class MapManager {
  public currentMap: GameMap;
  public collisionMap: boolean[][] = [];
  public transitions: MapTransition[] = [];
  public interactionTiles: Map<string, string> = new Map();

  private mapTexture!: Phaser.GameObjects.Image;
  private mapWidth: number;
  private mapHeight: number;

  constructor(private scene: Phaser.Scene, map: GameMap) {
    this.currentMap = map;
    this.collisionMap = map.collision;
    this.transitions = map.transitions;
    this.mapWidth = map.width * TILE_SIZE;
    this.mapHeight = map.height * TILE_SIZE;

    this.renderToTexture();
  }

  // ========== 核心：渲染到单张纹理 ==========

  private renderToTexture(): void {
    const w = this.mapWidth;
    const h = this.mapHeight;

    // 创建离屏 RenderTexture
    const rt = this.scene.add.renderTexture(0, 0, w, h);
    rt.setOrigin(0, 0);

    // 1. 铺底色
    const baseColor = this.getBaseColor();
    const baseRect = this.scene.make.graphics({ x: 0, y: 0 }, false);
    baseRect.fillStyle(baseColor, 1);
    baseRect.fillRect(0, 0, w, h);
    rt.draw(baseRect);
    baseRect.destroy();

    // 2. 叠加 AI 瓦片纹理（柔和混合）
    if (this.scene.textures.exists('tileset_ground')) {
      const tex = this.scene.textures.get('tileset_ground');
      const srcW = tex.source[0].width;
      const srcH = tex.source[0].height;

      for (let x = 0; x < w; x += srcW / 2) {
        for (let y = 0; y < h; y += srcH / 2) {
          const img = this.scene.make.image({
            x: x + srcW / 4, y: y + srcH / 4,
            key: 'tileset_ground',
          }, false);
          img.setDisplaySize(srcW / 2, srcH / 2);
          img.setAlpha(0.35);
          rt.draw(img);
          img.destroy();
        }
      }
    }

    // 3. 绘制地形特征（水、建筑、特殊区域）
    this.drawTerrainToTexture(rt, w, h);

    // 4. 将 RenderTexture 保存为静态 Image（性能更好）
    rt.saveTexture(this.currentMap.id + '_map_tex');
    rt.destroy();

    // 5. 显示纹理
    this.mapTexture = this.scene.add.image(0, 0, this.currentMap.id + '_map_tex');
    this.mapTexture.setOrigin(0, 0);
    this.mapTexture.setDepth(-1);
  }

  private getBaseColor(): number {
    switch (this.currentMap.id) {
      case 'farm':  return 0x5A9E4B;
      case 'town':  return 0x8FBC8F;
      case 'forest': return 0x2D5A27;
      default: return 0x4A8C3F;
    }
  }

  private drawTerrainToTexture(rt: Phaser.GameObjects.RenderTexture, w: number, h: number): void {
    const map = this.currentMap;
    const mw = map.width, mh = map.height;

    // 使用一个大 Graphics 批量绘制所有地形
    const gfx = this.scene.make.graphics({ x: 0, y: 0 }, false);

    if (map.id === 'farm') this.drawFarmTerrain(gfx, mw, mh, w, h);
    else if (map.id === 'town') this.drawTownTerrain(gfx, mw, mh, w, h);
    else if (map.id === 'forest') this.drawForestTerrain(gfx, mw, mh, w, h);

    rt.draw(gfx);
    gfx.destroy();
  }

  private drawFarmTerrain(g: Phaser.GameObjects.Graphics, mw: number, mh: number, _tw: number, _th: number): void {
    // 水塘（完整圆形区域，不是格子）
    const ponds: { cx: number; cy: number; r: number }[] = [
      { cx: 7 * TILE_SIZE, cy: 9 * TILE_SIZE, r: 80 },
      { cx: (mw - 7) * TILE_SIZE, cy: (mh - 9) * TILE_SIZE, r: 80 },
    ];
    for (const pond of ponds) {
      g.fillStyle(0x3A80C9, 0.85);
      g.fillEllipse(pond.cx, pond.cy, pond.r * 2, pond.r * 1.5);
      // 水面高光
      g.fillStyle(0x6AB8F0, 0.25);
      g.fillEllipse(pond.cx - 10, pond.cy - 15, pond.r * 1.2, pond.r * 0.4);
    }

    // 房屋区域（圆角矩形）
    const hx = 10 * TILE_SIZE, hy = 10 * TILE_SIZE;
    const hw = 4 * TILE_SIZE, hh = 3 * TILE_SIZE;
    g.fillStyle(0x9B7928, 0.9);
    g.fillRoundedRect(hx, hy, hw, hh, 6);
    // 屋顶
    g.fillStyle(0x8B2500, 0.8);
    g.fillRoundedRect(hx - 4, hy - TILE_SIZE + 8, hw + 8, TILE_SIZE, 4);

    // 围栏（连续线条而不是格子）
    g.lineStyle(6, 0x5C4033, 0.8);
    g.strokeRect(4, 4, _tw - 8, _th - 8);

    // 已耕地（柔和色调的大块区域）
    g.fillStyle(0x7B5236, 0.3);
    g.fillRect(18 * TILE_SIZE, 18 * TILE_SIZE, 34 * TILE_SIZE, 24 * TILE_SIZE);
  }

  private drawTownTerrain(g: Phaser.GameObjects.Graphics, mw: number, mh: number, _tw: number, _th: number): void {
    // 广场
    g.fillStyle(0xA0956B, 0.6);
    g.fillRoundedRect(17 * TILE_SIZE, 17 * TILE_SIZE, 12 * TILE_SIZE, 12 * TILE_SIZE, 8);

    // 中央喷泉
    g.fillStyle(0x4A90D9, 0.5);
    g.fillCircle(23 * TILE_SIZE, 23 * TILE_SIZE, TILE_SIZE * 1.5);

    // 建筑
    const buildings: { x: number; y: number; w: number; h: number; color: number }[] = [
      { x: 10, y: 9, w: 4, h: 7, color: 0x8B6928 },   // 图书馆
      { x: 30, y: 9, w: 4, h: 7, color: 0x9B7928 },    // 教堂
      { x: 20, y: 7, w: 4, h: 5, color: 0xB8860B },    // 客栈
      { x: 10, y: 29, w: 4, h: 5, color: 0xCD853F },   // 杂货店
      { x: 29, y: 29, w: 5, h: 5, color: 0x696969 },   // 铁匠铺
    ];

    for (const b of buildings) {
      g.fillStyle(b.color, 0.85);
      g.fillRoundedRect(b.x * TILE_SIZE + 2, b.y * TILE_SIZE + 2,
        b.w * TILE_SIZE - 4, b.h * TILE_SIZE - 4, 4);
      g.lineStyle(2, 0x5C4033, 0.3);
      g.strokeRoundedRect(b.x * TILE_SIZE + 2, b.y * TILE_SIZE + 2,
        b.w * TILE_SIZE - 4, b.h * TILE_SIZE - 4, 4);
    }

    // 围栏
    g.lineStyle(6, 0x6B4226, 0.5);
    g.strokeRect(4, 4, _tw - 8, _th - 8);
  }

  private drawForestTerrain(g: Phaser.GameObjects.Graphics, mw: number, mh: number, _tw: number, _th: number): void {
    // 随机树冠（圆形斑点模拟森林）
    const treePositions = [
      { x: 17, y: 17 }, { x: 36, y: 12 }, { x: 56, y: 28 },
      { x: 26, y: 42 }, { x: 50, y: 50 }, { x: 65, y: 40 },
      { x: 10, y: 30 }, { x: 45, y: 8 }, { x: 70, y: 15 },
      { x: 30, y: 55 }, { x: 15, y: 50 }, { x: 60, y: 55 },
    ];

    for (const tp of treePositions) {
      // 深色树冠
      g.fillStyle(0x1A5A1A, 0.4);
      g.fillCircle(tp.x * TILE_SIZE, tp.y * TILE_SIZE, TILE_SIZE * 2.5);

      // 浅色高光
      g.fillStyle(0x3A8A3A, 0.2);
      g.fillCircle(tp.x * TILE_SIZE - 8, tp.y * TILE_SIZE - 12, TILE_SIZE * 1.5);
    }

    // 空心橡树（特殊标记）
    const oakX = 40 * TILE_SIZE, oakY = 40 * TILE_SIZE;
    g.fillStyle(0x5C4033, 0.9);
    g.fillCircle(oakX, oakY - 8, TILE_SIZE);
    g.fillStyle(0x2D6A27, 0.7);
    g.fillCircle(oakX, oakY - 20, TILE_SIZE * 2);
    // 金色光点标记
    g.fillStyle(0xFFD700, 0.6);
    g.fillCircle(oakX, oakY - 20, 6);

    // 岩壁
    g.fillStyle(0x696969, 0.5);
    g.fillRect(60 * TILE_SIZE, 5 * TILE_SIZE, 6 * TILE_SIZE, 15 * TILE_SIZE);

    // 森林步道
    g.fillStyle(0x6B4226, 0.3);
    g.fillRect(2 * TILE_SIZE, mh / 2 * TILE_SIZE - 4, (mw - 4) * TILE_SIZE, 8);

    // 边界
    g.lineStyle(8, 0x1A3A1A, 0.6);
    g.strokeRect(4, 4, _tw - 8, _th - 8);
  }

  // ========== 碰撞检测 ==========

  checkCollision(worldX: number, worldY: number): boolean {
    const tileX = Math.floor(worldX / TILE_SIZE);
    const tileY = Math.floor(worldY / TILE_SIZE);
    if (tileX < 0 || tileX >= this.currentMap.width || tileY < 0 || tileY >= this.currentMap.height) return true;
    return this.collisionMap[tileY]?.[tileX] ?? false;
  }

  checkTransition(tileX: number, tileY: number): MapTransition | null {
    for (const trans of this.transitions) {
      if (trans.fromTileX === tileX && trans.fromTileY === tileY) return trans;
    }
    return null;
  }

  getInteractionAt(tileX: number, tileY: number): string | null {
    return this.interactionTiles.get(`${tileX},${tileY}`) ?? null;
  }

  setInteraction(tileX: number, tileY: number, type: string): void {
    this.interactionTiles.set(`${tileX},${tileY}`, type);
  }

  destroy(): void {
    this.mapTexture?.destroy();
  }
}
