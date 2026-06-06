// ============================================================
// 余晖谷 Embervale - 主菜单（1080p）
// ============================================================

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config/game';
import { SceneKey } from '../types';

export class MenuScene extends Phaser.Scene {
  constructor() { super({ key: SceneKey.MENU }); }

  create(): void {
    this.cameras.main.setBackgroundColor(0x1A1A2E);

    // 背景图
    if (this.textures.exists('title_bg')) {
      const bg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'title_bg');
      bg.setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
      bg.setAlpha(0.35);
    }

    // 金色粒子
    for (let i = 0; i < 30; i++) {
      const p = this.add.circle(
        Phaser.Math.Between(0, GAME_WIDTH), Phaser.Math.Between(0, GAME_HEIGHT),
        Phaser.Math.FloatBetween(1, 3),
        COLORS.HARVEST_GOLD, Phaser.Math.FloatBetween(0.15, 0.5),
      );
      this.tweens.add({
        targets: p, y: p.y - 80, alpha: 0,
        duration: Phaser.Math.Between(3000, 6000), repeat: -1,
        delay: Phaser.Math.Between(0, 4000),
        onRepeat: () => { p.x = Phaser.Math.Between(0, GAME_WIDTH); p.y = GAME_HEIGHT + 20; p.setAlpha(0.4); },
      });
    }

    // 标题
    const title = this.add.text(GAME_WIDTH / 2, 220, '余 晖 谷', {
      fontSize: '72px', fontFamily: 'serif', color: '#C49A3C',
      stroke: '#3C1E0A', strokeThickness: 6,
    }).setOrigin(0.5).setAlpha(0);

    const sub = this.add.text(GAME_WIDTH / 2, 290, 'Embervale', {
      fontSize: '22px', fontFamily: 'serif', color: '#A08060', fontStyle: 'italic',
    }).setOrigin(0.5).setAlpha(0);

    const desc = this.add.text(GAME_WIDTH / 2, 330,
      '◇ 一场关于归乡与传承的田园诗篇 ◇',
      { fontSize: '15px', fontFamily: 'serif', color: '#8B7355' },
    ).setOrigin(0.5).setAlpha(0);

    this.tweens.add({ targets: title, alpha: 1, y: 230, duration: 1500, ease: 'Sine.easeOut' });
    this.tweens.add({ targets: sub, alpha: 1, duration: 1500, delay: 400 });
    this.tweens.add({ targets: desc, alpha: 1, duration: 1500, delay: 700 });

    // 按钮
    const btnW = 320;
    const btnH = 52;
    const btnX = GAME_WIDTH / 2;
    const btnStartY = 480;
    const btnGap = 72;

    const btns = [
      { text: '开 始 新 游 戏', y: btnStartY, action: () => this.startGame() },
      { text: '读 取 存 档', y: btnStartY + btnGap, action: () => {} },
      { text: '游 戏 设 定', y: btnStartY + btnGap * 2, action: () => {} },
    ];

    btns.forEach((btn, i) => {
      this.createButton(btnX, btn.y, btnW, btnH, btn.text, btn.action, 900 + i * 200);
    });

    // 版本
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 40, 'v0.1.0 · Demo', {
      fontSize: '13px', color: '#555',
    }).setOrigin(0.5);
  }

  private createButton(cx: number, cy: number, w: number, h: number, text: string, action: () => void, delay: number): void {
    // 按钮阴影
    const shadow = this.add.rectangle(cx + 3, cy + 3, w, h, 0x000000, 0.3);
    shadow.setOrigin(0.5);

    // 按钮主体 - 直接用 Rectangle 作为交互载体
    const btn = this.add.rectangle(cx, cy, w, h, COLORS.BUTTON_WOOD);
    btn.setOrigin(0.5);
    btn.setStrokeStyle(2, COLORS.UI_GOLD, 0.7);

    // 标签
    const label = this.add.text(cx, cy, text, {
      fontSize: '22px', fontFamily: 'serif', color: '#F5E6C8',
    }).setOrigin(0.5);

    // 动画入场
    [shadow, btn, label].forEach(o => o.setAlpha(0));
    this.tweens.add({ targets: [shadow, btn, label], alpha: 1, duration: 400, delay, ease: 'Sine.easeOut' });

    // 关键：Rectangle 直接 setInteractive
    btn.setInteractive({ useHandCursor: true });
    btn.on('pointerover', () => {
      btn.setFillStyle(COLORS.BUTTON_HOVER);
      btn.setStrokeStyle(2, COLORS.UI_GOLD, 1);
      label.setColor('#FFFFFF');
    });
    btn.on('pointerout', () => {
      btn.setFillStyle(COLORS.BUTTON_WOOD);
      btn.setStrokeStyle(2, COLORS.UI_GOLD, 0.7);
      label.setColor('#F5E6C8');
    });
    btn.on('pointerdown', action);
  }

  private startGame(): void {
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(SceneKey.GAME);
    });
  }
}
