// ============================================================
// 余晖谷 Embervale - 暂停菜单 (1080p)
// ============================================================

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config/game';
import { SceneKey } from '../types';
import { SaveSystem } from '../systems/SaveSystem';
import type { SaveData } from '../types';

export class PauseMenu {
  private scene: Phaser.Scene;
  private elements: Phaser.GameObjects.GameObject[] = [];
  private isVisible = false;
  // 存档面板
  private savePanelElements: Phaser.GameObjects.GameObject[] = [];
  private getSaveData?: () => SaveData;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.build();
    this.setVisible(false);
  }

  setSaveDataProvider(fn: () => SaveData): void {
    this.getSaveData = fn;
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
      { text: '保存游戏', dy: btnGap - 60, action: () => this.showSavePanel() },
      { text: '返回标题', dy: btnGap * 2 - 60, action: () => this.returnToTitle() },
    ];

    buttons.forEach((btn) => {
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

  // ========== 保存游戏面板 ==========
  private showSavePanel(): void {
    this.destroySavePanel();
    const d = 500;
    const pw = 560, ph = 500;

    // 遮罩
    const mask = this.scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.6);
    mask.setScrollFactor(0).setDepth(d).setInteractive();
    mask.on('pointerdown', () => this.destroySavePanel());
    this.savePanelElements.push(mask);

    // 面板
    const panel = this.scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, pw, ph, 0x2A1A0A, 0.96);
    panel.setStrokeStyle(3, COLORS.UI_GOLD);
    panel.setScrollFactor(0).setDepth(d + 1);
    this.savePanelElements.push(panel);

    const title = this.scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - ph / 2 + 32, '━━ 保 存 游 戏 ━━', {
      fontSize: '24px', fontFamily: 'serif', color: '#C49A3C',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(d + 5);
    this.savePanelElements.push(title);

    const slots = SaveSystem.getSaveSlots();
    for (let i = 0; i < 3; i++) {
      const slot = slots[i];
      const sy = GAME_HEIGHT / 2 - 70 + i * 120;
      const hasData = slot.data !== null;

      // 槽位背景
      const slotBg = this.scene.add.rectangle(GAME_WIDTH / 2, sy + 30, pw - 80, 90, hasData ? 0x3C2E1F : 0x2A1A0A, 0.9);
      slotBg.setStrokeStyle(1, COLORS.UI_GOLD, 0.3);
      slotBg.setScrollFactor(0).setDepth(d + 2);
      this.savePanelElements.push(slotBg);

      // 槽位编号
      const slotLabel = this.scene.add.text(GAME_WIDTH / 2 - pw / 2 + 60, sy, `存档 ${i + 1}`, {
        fontSize: '20px', fontFamily: 'serif', color: '#C49A3C',
      }).setScrollFactor(0).setDepth(d + 5);
      this.savePanelElements.push(slotLabel);

      // 存档信息
      if (hasData && slot.data) {
        const ts = new Date(slot.data.timestamp).toLocaleString('zh-CN');
        const info = this.scene.add.text(GAME_WIDTH / 2 - pw / 2 + 60, sy + 28,
          `${slot.data.slotName} · ${ts}`,
          { fontSize: '13px', color: '#8B7355' },
        ).setScrollFactor(0).setDepth(d + 5);
        this.savePanelElements.push(info);
      } else {
        const emptyText = this.scene.add.text(GAME_WIDTH / 2 - pw / 2 + 60, sy + 30,
          '（空槽位）',
          { fontSize: '14px', color: '#555', fontStyle: 'italic' },
        ).setScrollFactor(0).setDepth(d + 5);
        this.savePanelElements.push(emptyText);
      }

      // 保存按钮
      const saveBtn = this.scene.add.rectangle(GAME_WIDTH / 2 + pw / 2 - 80, sy + 30, 80, 36, 0x4A8C3F);
      saveBtn.setStrokeStyle(1, COLORS.UI_GOLD, 0.6);
      saveBtn.setScrollFactor(0).setDepth(d + 5).setInteractive({ useHandCursor: true });
      const slotIndex = i;
      saveBtn.on('pointerdown', () => this.doSave(slotIndex));
      saveBtn.on('pointerover', () => saveBtn.setFillStyle(0x5CAA4F));
      saveBtn.on('pointerout', () => saveBtn.setFillStyle(0x4A8C3F));
      this.savePanelElements.push(saveBtn);

      const saveLabel = this.scene.add.text(GAME_WIDTH / 2 + pw / 2 - 80, sy + 30, hasData ? '覆盖' : '保存', {
        fontSize: '15px', color: '#F5E6C8',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(d + 6);
      this.savePanelElements.push(saveLabel);

      // 删除按钮（仅已有存档）
      if (hasData) {
        const delBtn = this.scene.add.rectangle(GAME_WIDTH / 2 + pw / 2 - 165, sy + 30, 80, 36, 0x8B3A3A);
        delBtn.setStrokeStyle(1, 0xAA5555, 0.6);
        delBtn.setScrollFactor(0).setDepth(d + 5).setInteractive({ useHandCursor: true });
        delBtn.on('pointerdown', () => {
          SaveSystem.delete(slotIndex);
          this.destroySavePanel();
          this.showSavePanel(); // 刷新面板
        });
        delBtn.on('pointerover', () => delBtn.setFillStyle(0xA04444));
        delBtn.on('pointerout', () => delBtn.setFillStyle(0x8B3A3A));
        this.savePanelElements.push(delBtn);

        const delLabel = this.scene.add.text(GAME_WIDTH / 2 + pw / 2 - 165, sy + 30, '删除', {
          fontSize: '15px', color: '#F5E6C8',
        }).setOrigin(0.5).setScrollFactor(0).setDepth(d + 6);
        this.savePanelElements.push(delLabel);
      }
    }

    // 关闭按钮
    const closeBtn = this.scene.add.text(GAME_WIDTH / 2 + pw / 2 - 24, GAME_HEIGHT / 2 - ph / 2 + 24, '✕ 关闭', {
      fontSize: '16px', color: '#8B7355', fontFamily: 'serif',
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(d + 5).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => this.destroySavePanel());
    this.savePanelElements.push(closeBtn);
  }

  private doSave(slotIndex: number): void {
    if (!this.getSaveData) return;

    const data: SaveData = {
      ...this.getSaveData(),
      slotName: `存档 ${slotIndex + 1}`,
      timestamp: Date.now(),
    };

    const ok = SaveSystem.save(slotIndex, data);
    if (ok) {
      this.destroySavePanel();
      this.showToast('保存成功！');
    } else {
      this.showToast('保存失败，请重试');
    }
  }

  private showToast(msg: string): void {
    const toast = this.scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 200, msg, {
      fontSize: '18px', fontFamily: 'serif', color: '#F5E6C8',
      backgroundColor: '#000000aa', padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(600);

    this.scene.tweens.add({
      targets: toast, alpha: 0, y: toast.y - 30,
      delay: 1500, duration: 500,
      onComplete: () => toast.destroy(),
    });
  }

  private destroySavePanel(): void {
    this.savePanelElements.forEach(e => e.destroy());
    this.savePanelElements = [];
  }

  // ========== 返回标题（安全清理，走Phaser生命周期） ==========
  private returnToTitle(): void {
    this.close();
    this.destroySavePanel();
    // 直接停止游戏场景 → Phaser 自动触发内置 shutdown → GameScene.onShutdown() 统一清理
    this.scene.scene.stop(SceneKey.GAME);
    this.scene.scene.start(SceneKey.MENU);
  }

  private setVisible(v: boolean): void {
    this.isVisible = v;
    this.elements.forEach(e => {
      if ('setVisible' in e) (e as Phaser.GameObjects.Components.Visible).setVisible(v);
    });
    if (!v) this.destroySavePanel();
  }

  toggle(): void { this.setVisible(!this.isVisible); }
  close(): void { this.setVisible(false); }
  get visible(): boolean { return this.isVisible; }
}
