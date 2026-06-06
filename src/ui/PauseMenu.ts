// ============================================================
// 余晖谷 Embervale - 暂停菜单 (1080p)
// ============================================================

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config/game';
import { SceneKey } from '../types';

export class PauseMenu {
  private scene: Phaser.Scene;
  private elements: Phaser.GameObjects.GameObject[] = [];
  private isVisible = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.build();
    this.setVisible(false);
  }

  private build(): void {
    const d = 400;
    const pw = 400, ph = 480;

    // 遮罩
    const mask = this.scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.55);
    mask.setScrollFactor(0).setDepth(d).setInteractive();
    mask.on('pointerdown', () => this.close());
    this.elements.push(mask);

    // 面板
    const panel = this.scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, pw, ph, COLORS.UI_PANEL, 0.95);
    panel.setStrokeStyle(3, COLORS.UI_GOLD);
    panel.setScrollFactor(0).setDepth(d + 1);
    this.elements.push(panel);

    // 标题 + 装饰线
    const title = this.scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - ph / 2 + 36, '━━ 暂 停 ━━', {
      fontSize: '28px', fontFamily: 'serif', color: '#C49A3C',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(d + 5);
    this.elements.push(title);

    // 按钮
    const btnW = 280, btnH = 50, btnGap = 70;
    const buttons = [
      { text: '继续游戏', dy: -60, action: () => this.close() },
      { text: '保存游戏', dy: btnGap - 60, action: () => console.log('[保存]') },
      { text: '返回标题', dy: btnGap * 2 - 60, action: () => { this.close(); this.scene.scene.start(SceneKey.MENU); } },
    ];

    buttons.forEach((btn, i) => {
      const by = GAME_HEIGHT / 2 + btn.dy;

      const bg = this.scene.add.rectangle(GAME_WIDTH / 2, by, btnW, btnH, 0x8B6914, 1);
      bg.setStrokeStyle(2, COLORS.UI_GOLD, 0.6);
      bg.setScrollFactor(0).setDepth(d + 5);

      const label = this.scene.add.text(GAME_WIDTH / 2, by, btn.text, {
        fontSize: '18px', fontFamily: 'serif', color: '#F5E6C8',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(d + 6);

      this.elements.push(bg, label);

      bg.setInteractive({ useHandCursor: true });
      bg.on('pointerover', () => { bg.setFillStyle(COLORS.BUTTON_HOVER); label.setColor('#FFFFFF'); });
      bg.on('pointerout', () => { bg.setFillStyle(0x8B6914); label.setColor('#F5E6C8'); });
      bg.on('pointerdown', btn.action);
    });
  }

  private setVisible(v: boolean): void {
    this.isVisible = v;
    this.elements.forEach(e => {
      if ('setVisible' in e) (e as Phaser.GameObjects.Components.Visible).setVisible(v);
    });
  }

  toggle(): void { this.setVisible(!this.isVisible); }
  close(): void { this.setVisible(false); }
  get visible(): boolean { return this.isVisible; }
}
