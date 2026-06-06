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
    if (this.player.state.currentTool === ToolType.HOE || this.player.state.currentTool === ToolType.WATERING_CAN) {
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
    this.tillGraphics.fillStyle(0x6B4226, 1);
    this.tillGraphics.fillRect(
      tileX * TILE_SIZE + 2, tileY * TILE_SIZE + 2,
      TILE_SIZE - 4, TILE_SIZE - 4,
    );
  }

  private renderCrop(tileX: number, tileY: number, planted: PlantedCrop, crop: CropData): void {
    // 重绘所有作物（简单方案）
    this.cropGraphics.clear();

    for (const [key, p] of this.plantedCrops) {
      const c = CROPS[p.cropId];
      if (!c) continue;

      const [x, y] = key.split(',').map(Number);
      const stageColors: Record<number, number> = {
        [CropStage.SEED]: 0x8B6914,
        [CropStage.SPROUT]: 0x6B8E23,
        [CropStage.GROWING]: 0x556B2F,
        [CropStage.MATURE]: 0x228B22,
        [CropStage.HARVESTABLE]: crop.id === 'starberry' ? 0xFFD700 : 0x32CD32,
      };

      const color = stageColors[p.currentStage] ?? 0x6B8E23;

      // 种子阶段画小点
      if (p.currentStage === CropStage.SEED) {
        this.cropGraphics.fillStyle(color, 1);
        this.cropGraphics.fillCircle(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, 4);
      } else {
        // 其他阶段画方块
        const size = 8 + p.currentStage * 4;
        this.cropGraphics.fillStyle(color, 1);
        this.cropGraphics.fillRect(
          x * TILE_SIZE + (TILE_SIZE - size) / 2,
          y * TILE_SIZE + (TILE_SIZE - size) / 2,
          size, size,
        );
      }

      // 品质指示（星号）
      if (p.quality > 0) {
        const qColor = p.quality === 2 ? 0xFFD700 : 0xC0C0C0;
        this.cropGraphics.fillStyle(qColor, 0.8);
        this.cropGraphics.fillCircle(
          x * TILE_SIZE + TILE_SIZE - 6,
          y * TILE_SIZE + 6,
          3,
        );
      }
    }
  }

  // ========== 全部重绘 ==========

  renderAll(): void {
    this.tillGraphics.clear();
    for (const key of this.tilledTiles) {
      const [tx, ty] = key.split(',').map(Number);
      this.tillGraphics.fillStyle(0x6B4226, 1);
      this.tillGraphics.fillRect(
        tx * TILE_SIZE + 2, ty * TILE_SIZE + 2,
        TILE_SIZE - 4, TILE_SIZE - 4,
      );
    }

    this.cropGraphics.clear();
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
