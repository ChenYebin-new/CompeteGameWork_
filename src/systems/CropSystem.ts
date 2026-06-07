// ============================================================
// 余晖谷 Embervale - 种植系统
// ============================================================

import Phaser from 'phaser';
import { TILE_SIZE, COLORS, STAMINA_COST } from '../config/game';
import { CropStage, Season, ToolType } from '../types';
import type { PlantedCrop, CropData } from '../types';
import { CROPS } from '../data/crops';
import { ITEMS } from '../data/items';
import { tileKey } from '../utils/helpers';
import { TimeSystem } from './TimeSystem';
import type { Player } from '../entities/Player';

/**
 * 作物渲染层：显示耕地上的作物
 */
export class CropSystem {
  private scene: Phaser.Scene;
  private timeSystem: TimeSystem;
  private player: Player;

  /** 已种植作物: "tileX,tileY" -> PlantedCrop */
  public plantedCrops: Map<string, PlantedCrop> = new Map();

  /** 已耕地: Set<"tileX,tileY"> */
  public tilledTiles: Set<string> = new Set();

  /** 耕地渲染Graphics */
  private tillGraphics: Phaser.GameObjects.Graphics;
  private cropGraphics: Phaser.GameObjects.Graphics;

  /** 玩家当前持工具时的高亮 */
  private highlightRect: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, timeSystem: TimeSystem, player: Player) {
    this.scene = scene;
    this.timeSystem = timeSystem;
    this.player = player;

    // 耕地层（depth 1）
    this.tillGraphics = scene.add.graphics();
    this.tillGraphics.setDepth(1);

    // 作物层（depth 5）
    this.cropGraphics = scene.add.graphics();
    this.cropGraphics.setDepth(5);

    // 高亮指示器
    this.highlightRect = scene.add.rectangle(0, 0, TILE_SIZE, TILE_SIZE, COLORS.HARVEST_GOLD, 0.3);
    this.highlightRect.setDepth(4).setVisible(false);

    // 每天新日时作物成长
    this.timeSystem.onDayStart = () => this.onDayPass();
  }

  // ========== 每帧更新 ==========

  update(): void {
    const frontTile = this.player.getFrontTile();

    // 工具高亮
    if (this.player.state.currentTool === ToolType.HOE ||
        this.player.state.currentTool === ToolType.WATERING_CAN ||
        this.player.state.currentTool === ToolType.SEED_BAG) {
      this.highlightRect.setPosition(
        frontTile.tileX * TILE_SIZE + TILE_SIZE / 2,
        frontTile.tileY * TILE_SIZE + TILE_SIZE / 2,
      );
      this.highlightRect.setVisible(true);
    } else {
      this.highlightRect.setVisible(false);
    }
  }

  // ========== 交互：锄地 ==========

  hoeTile(tileX: number, tileY: number): boolean {
    const key = tileKey(tileX, tileY);

    if (this.tilledTiles.has(key)) return false; // 已耕地

    if (!this.player.consumeStamina(STAMINA_COST.HOE)) return false;

    this.tilledTiles.add(key);
    this.renderTilledGround(tileX, tileY);
    return true;
  }

  // ========== 交互：播种 ==========

  plantSeed(tileX: number, tileY: number, seedItemId: string): boolean {
    const key = tileKey(tileX, tileY);

    // 必须已耕地且无作物
    if (!this.tilledTiles.has(key)) return false;
    if (this.plantedCrops.has(key)) return false;

    // 找对应作物数据
    const crop = this.findCropBySeed(seedItemId);
    if (!crop) return false;

    // 检查季节
    if (!crop.seasons.includes(this.timeSystem.time.season)) return false;

    // 消耗种子
    if (!this.player.removeItem(seedItemId, 1)) return false;

    // 种植
    const planted: PlantedCrop = {
      cropId: crop.id,
      currentStage: CropStage.SEED,
      daysInStage: 0,
      wateredToday: true, // 第一天算浇水
      quality: 0,
    };

    this.plantedCrops.set(key, planted);
    this.renderCrop(tileX, tileY, planted, crop);
    return true;
  }

  // ========== 交互：浇水 ==========

  waterTile(tileX: number, tileY: number): boolean {
    const key = tileKey(tileX, tileY);
    const planted = this.plantedCrops.get(key);
    if (!planted || planted.wateredToday) return false;

    if (!this.player.consumeStamina(STAMINA_COST.WATER)) return false;

    planted.wateredToday = true;
    return true;
  }

  // ========== 交互：收获 ==========

  harvestCrop(tileX: number, tileY: number): { itemId: string; quantity: number; quality: number } | null {
    const key = tileKey(tileX, tileY);
    const planted = this.plantedCrops.get(key);
    if (!planted || planted.currentStage !== CropStage.HARVESTABLE) return null;

    const crop = CROPS[planted.cropId];
    if (!crop) return null;

    // 可再生作物：回到成熟阶段
    if (crop.regrowDays > 0) {
      planted.currentStage = CropStage.MATURE;
      planted.daysInStage = 0;
    } else {
      // 一次性作物：移除
      this.plantedCrops.delete(key);
    }

    this.renderCrop(tileX, tileY, planted, crop);

    return {
      itemId: crop.harvestItemId,
      quantity: 1,
      quality: planted.quality,
    };
  }

  // ========== 每日推进 ==========

  private onDayPass(): void {
    for (const [key, planted] of this.plantedCrops) {
      const crop = CROPS[planted.cropId];
      if (!crop) continue;

      // 未浇水的惩罚：跳过一天
      if (!planted.wateredToday) {
        planted.wateredToday = false;
        continue;
      }

      // 推进生长
      planted.daysInStage += 1;
      planted.wateredToday = false; // 重置浇水标记

      // 检查阶段提升
      if (planted.daysInStage >= crop.growthDays) {
        planted.daysInStage = 0;
        if (planted.currentStage < CropStage.HARVESTABLE) {
          planted.currentStage += 1;
        }

        // 品质计算（10%概率银星，5%金星）
        if (planted.currentStage === CropStage.HARVESTABLE) {
          const qualityRoll = Math.random();
          if (qualityRoll < 0.05) planted.quality = 2;    // 金星
          else if (qualityRoll < 0.15) planted.quality = 1; // 银星
        }
      }

      // 重新渲染
      const [tx, ty] = key.split(',').map(Number);
      this.renderCrop(tx, ty, planted, crop);
    }
  }

  // ========== 渲染 ==========

  private renderTilledGround(tileX: number, tileY: number): void {
    const x = tileX * TILE_SIZE;
    const y = tileY * TILE_SIZE;
    const s = TILE_SIZE;

    // 基底深色
    this.tillGraphics.fillStyle(0x5C3A1E, 1);
    this.tillGraphics.fillRect(x + 1, y + 1, s - 2, s - 2);

    // 表土主色
    this.tillGraphics.fillStyle(0x7B5236, 0.9);
    this.tillGraphics.fillRect(x + 3, y + 3, s - 6, s - 6);

    // 随机纹理线条（模拟犁沟）
    const seed = (tileX * 31 + tileY * 17) % 13;
    this.tillGraphics.lineStyle(1, 0x6B4226, 0.4);
    for (let i = 0; i < 3; i++) {
      const ly = y + 8 + (i * (s - 16)) / 2 + ((seed + i) % 5 - 2);
      this.tillGraphics.lineBetween(x + 6, ly, x + s - 6, ly + ((seed + i * 3) % 3 - 1));
    }

    // 微小石块点缀
    this.tillGraphics.fillStyle(0x8A7A6A, 0.3);
    if (seed % 3 === 0) {
      this.tillGraphics.fillCircle(x + 12 + (seed % 20), y + 12 + ((seed * 7) % 20), 2);
    }
  }

  private renderCrop(tileX: number, tileY: number, planted: PlantedCrop, crop: CropData): void {
    // 重绘所有作物（程序化渐变渲染）
    this.cropGraphics.clear();

    for (const [key, p] of this.plantedCrops) {
      const c = CROPS[p.cropId];
      if (!c) continue;

      const [x, y] = key.split(',').map(Number);
      const cx = x * TILE_SIZE + TILE_SIZE / 2;
      const cy = y * TILE_SIZE + TILE_SIZE / 2;

      // 渐变颜色表（不同阶段使用自然色调）
      const stageGradients: Record<number, { base: number; light: number; dark: number }> = {
        [CropStage.SEED]:       { base: 0x8B6914, light: 0xC49A3C, dark: 0x5C3A0A },
        [CropStage.SPROUT]:     { base: 0x6B8E23, light: 0x98D04A, dark: 0x3D6210 },
        [CropStage.GROWING]:    { base: 0x228B22, light: 0x4CAF50, dark: 0x0D5A0D },
        [CropStage.MATURE]:     { base: 0x2E8B57, light: 0x5CBF7F, dark: 0x1A5532 },
        [CropStage.HARVESTABLE]: crop.id === 'starberry'
          ? { base: 0xFFD700, light: 0xFFEC8B, dark: 0xB8860B }
          : { base: 0x32CD32, light: 0x7CFC00, dark: 0x1E7B1E },
      };

      const gc = stageGradients[p.currentStage] ?? stageGradients[CropStage.SPROUT];

      if (p.currentStage === CropStage.SEED) {
        // 种子阶段 - 画一个小土堆
        this.cropGraphics.fillStyle(gc.dark, 0.9);
        this.cropGraphics.fillEllipse(cx, cy + 3, 10, 6);
        this.cropGraphics.fillStyle(gc.base, 0.8);
        this.cropGraphics.fillCircle(cx, cy, 3);
      } else {
        // 生长阶段 - 多层渐变模拟立体感
        const size = 10 + p.currentStage * 4;
        const half = Math.floor(size / 2);

        // 阴影
        this.cropGraphics.fillStyle(gc.dark, 0.5);
        this.cropGraphics.fillEllipse(cx + 2, cy + 2, size + 2, size * 0.8);

        // 主体
        this.cropGraphics.fillStyle(gc.base, 0.85);
        this.cropGraphics.fillRoundedRect(cx - half, cy - half, size, size, 3);

        // 高光
        this.cropGraphics.fillStyle(gc.light, 0.4);
        this.cropGraphics.fillRoundedRect(
          cx - half + 2, cy - half + 2,
          Math.floor(size * 0.55), Math.floor(size * 0.45),
          2,
        );
      }

      // 品质星光
      if (p.quality > 0) {
        const qColor = p.quality === 2 ? 0xFFD700 : 0xC0C0C0;
        this.cropGraphics.fillStyle(qColor, 0.9);
        this.cropGraphics.fillCircle(cx + TILE_SIZE / 2 - 7, cy - TILE_SIZE / 2 + 7, 4);
        // 发光外圈
        this.cropGraphics.fillStyle(qColor, 0.25);
        this.cropGraphics.fillCircle(cx + TILE_SIZE / 2 - 7, cy - TILE_SIZE / 2 + 7, 7);
      }
    }
  }

  // ========== 全部重绘 ==========

  renderAll(): void {
    this.tillGraphics.clear();
    for (const key of this.tilledTiles) {
      const [tx, ty] = key.split(',').map(Number);
      const x = tx * TILE_SIZE;
      const y = ty * TILE_SIZE;
      const s = TILE_SIZE;

      this.tillGraphics.fillStyle(0x5C3A1E, 1);
      this.tillGraphics.fillRect(x + 1, y + 1, s - 2, s - 2);
      this.tillGraphics.fillStyle(0x7B5236, 0.9);
      this.tillGraphics.fillRect(x + 3, y + 3, s - 6, s - 6);

      const seed = (tx * 31 + ty * 17) % 13;
      this.tillGraphics.lineStyle(1, 0x6B4226, 0.4);
      for (let i = 0; i < 3; i++) {
        const ly = y + 8 + (i * (s - 16)) / 2 + ((seed + i) % 5 - 2);
        this.tillGraphics.lineBetween(x + 6, ly, x + s - 6, ly + ((seed + i * 3) % 3 - 1));
      }
      if (seed % 3 === 0) {
        this.tillGraphics.fillStyle(0x8A7A6A, 0.3);
        this.tillGraphics.fillCircle(x + 12 + (seed % 20), y + 12 + ((seed * 7) % 20), 2);
      }
    }

    this.cropGraphics.clear();
    // 遍历所有作物重新渲染
    for (const [key, planted] of this.plantedCrops) {
      const crop = CROPS[planted.cropId];
      if (!crop) continue;
      const [tx, ty] = key.split(',').map(Number);
      this.renderCrop(tx, ty, planted, crop);
    }
  }

  // ========== 工具方法 ==========

  private findCropBySeed(seedItemId: string): CropData | null {
    for (const [, crop] of Object.entries(CROPS)) {
      if (crop.seedItemId === seedItemId) return crop;
    }
    return null;
  }

  // ========== 销毁 ==========

  destroy(): void {
    this.tillGraphics.destroy();
    this.cropGraphics.destroy();
    this.highlightRect.destroy();
  }
}
