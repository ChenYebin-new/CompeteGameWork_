// ============================================================
// 余晖谷 Embervale - 天气系统
// ============================================================

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config/game';
import { Weather } from '../types';
import { TimeSystem } from './TimeSystem';

export class WeatherSystem {
  private scene: Phaser.Scene;
  private timeSystem: TimeSystem;

  // 天气粒子
  private rainParticles: Phaser.GameObjects.Rectangle[] = [];
  private cloudOverlay!: Phaser.GameObjects.Rectangle;

  // 光照滤镜
  private nightOverlay!: Phaser.GameObjects.Rectangle;
  private dayTint: number = COLORS.WHITE;

  constructor(scene: Phaser.Scene, timeSystem: TimeSystem) {
    this.scene = scene;
    this.timeSystem = timeSystem;

    // 云层覆盖
    this.cloudOverlay = scene.add.rectangle(
      GAME_WIDTH / 2, GAME_HEIGHT / 2,
      GAME_WIDTH, GAME_HEIGHT,
      0x888888, 0,
    ).setScrollFactor(0).setDepth(99);

    // 夜空覆盖
    this.nightOverlay = scene.add.rectangle(
      GAME_WIDTH / 2, GAME_HEIGHT / 2,
      GAME_WIDTH, GAME_HEIGHT,
      0x0a0a2e, 0,
    ).setScrollFactor(0).setDepth(98);

    // 监听天气变化
    this.timeSystem.onWeatherChange = (weather) => this.applyWeather(weather);
  }

  update(): void {
    // 日/夜循环
    this.updateDayNightCycle();

    // 粒子动画
    this.updateParticles();
  }

  // ========== 日夜循环 ==========

  private updateDayNightCycle(): void {
    const progress = this.timeSystem.getDayProgress();

    // 白天(0-0.6进度): 明亮
    // 黄昏(0.6-0.8): 渐暗
    // 夜晚(0.8-1.0): 黑暗
    let alpha = 0;

    if (progress < 0.6) {
      alpha = 0;
    } else if (progress < 0.8) {
      alpha = (progress - 0.6) / 0.2 * 0.5;
    } else {
      alpha = 0.5 + (progress - 0.8) / 0.2 * 0.3;
    }

    this.nightOverlay.setAlpha(alpha);
  }

  // ========== 天气效果 ==========

  private applyWeather(weather: Weather): void {
    // 清除旧粒子
    this.clearRainParticles();

    switch (weather) {
      case Weather.SUNNY:
        this.cloudOverlay.setAlpha(0);
        break;
      case Weather.CLOUDY:
        this.cloudOverlay.setAlpha(0.2);
        break;
      case Weather.RAINY:
        this.createRainEffect(80);
        this.cloudOverlay.setAlpha(0.35);
        break;
      case Weather.STORMY:
        this.createRainEffect(150);
        this.cloudOverlay.setAlpha(0.5);
        break;
    }
  }

  private createRainEffect(count: number): void {
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(0, GAME_WIDTH);
      const y = Phaser.Math.Between(-20, GAME_HEIGHT);
      const len = Phaser.Math.Between(8, 16);
      const speed = Phaser.Math.Between(3, 7);

      const drop = this.scene.add.rectangle(x, y, 1, len, 0x4A90D9, 0.6);
      drop.setScrollFactor(0).setDepth(99);
      drop.setData('speed', speed);
      drop.setData('length', len);
      this.rainParticles.push(drop);
    }
  }

  private updateParticles(): void {
    for (const drop of this.rainParticles) {
      const speed = drop.getData('speed') as number;
      drop.y += speed;

      if (drop.y > GAME_HEIGHT + 20) {
        drop.y = -20;
        drop.x = Phaser.Math.Between(0, GAME_WIDTH);
      }
    }
  }

  private clearRainParticles(): void {
    this.rainParticles.forEach(d => d.destroy());
    this.rainParticles = [];
  }

  // ========== 销毁 ==========

  destroy(): void {
    this.clearRainParticles();
    this.cloudOverlay.destroy();
    this.nightOverlay.destroy();
  }
}
