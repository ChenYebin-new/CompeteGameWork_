// ============================================================
// 余晖谷 Embervale - 主菜单（1080p）
// ============================================================

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config/game';
import { SceneKey } from '../types';
import { SaveSystem } from '../systems/SaveSystem';

export class MenuScene extends Phaser.Scene {
  // 面板元素追踪（全部使用实例成员，避免静态残留）
  private panelElements: Phaser.GameObjects.GameObject[] = [];
  private titleElements: { title: Phaser.GameObjects.Text; sub: Phaser.GameObjects.Text; desc: Phaser.GameObjects.Text } | null = null;

  constructor() { super({ key: SceneKey.MENU }); }

  create(): void {
    this.cameras.main.setBackgroundColor(0x1A1A2E);
    this.panelElements = [];

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

    this.titleElements = { title, sub, desc };

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
      { text: '读 取 存 档', y: btnStartY + btnGap, action: () => this.showLoadPanel() },
      { text: '游 戏 设 定', y: btnStartY + btnGap * 2, action: () => this.showSettingsPanel() },
    ];

    btns.forEach((btn, i) => {
      this.createButton(btnX, btn.y, btnW, btnH, btn.text, btn.action, 900 + i * 200);
    });

    // 版本
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 40, 'v0.3.0 · Demo', {
      fontSize: '13px', color: '#555',
    }).setOrigin(0.5);
  }

  // ========== 按钮创建 ==========
  private createButton(cx: number, cy: number, w: number, h: number, text: string, action: () => void, delay: number): void {
    const shadow = this.add.rectangle(cx + 3, cy + 3, w, h, 0x000000, 0.3);
    shadow.setOrigin(0.5);

    const btn = this.add.rectangle(cx, cy, w, h, COLORS.BUTTON_WOOD);
    btn.setOrigin(0.5);
    btn.setStrokeStyle(2, COLORS.UI_GOLD, 0.7);

    const label = this.add.text(cx, cy, text, {
      fontSize: '22px', fontFamily: 'serif', color: '#F5E6C8',
    }).setOrigin(0.5);

    [shadow, btn, label].forEach(o => o.setAlpha(0));
    this.tweens.add({ targets: [shadow, btn, label], alpha: 1, duration: 400, delay, ease: 'Sine.easeOut' });

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

    // 脉冲呼吸动画（微妙的缩放）
    this.tweens.add({
      targets: [btn, label],
      scaleX: 1.03, scaleY: 1.03,
      duration: 1500 + delay * 1.5,
      yoyo: true, repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  // ========== 读取存档面板 ==========
  private showLoadPanel(): void {
    this.destroyPanel();
    const d = 200;
    const pw = 560, ph = 500;

    const mask = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.6);
    mask.setDepth(d).setInteractive();
    mask.on('pointerdown', () => this.destroyPanel());
    this.panelElements.push(mask);

    const panel = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, pw, ph, 0x2A1A0A, 0.95);
    panel.setStrokeStyle(3, COLORS.UI_GOLD);
    panel.setDepth(d + 1);
    this.panelElements.push(panel);

    const title = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - ph / 2 + 32, '━━ 读 取 存 档 ━━', {
      fontSize: '24px', fontFamily: 'serif', color: '#C49A3C',
    }).setOrigin(0.5).setDepth(d + 5);
    this.panelElements.push(title);

    const slots = SaveSystem.getSaveSlots();
    for (let i = 0; i < 3; i++) {
      const slot = slots[i];
      const sy = GAME_HEIGHT / 2 - 70 + i * 120;
      const hasData = slot.data !== null;

      // 槽位背景
      const slotBg = this.add.rectangle(GAME_WIDTH / 2, sy + 30, pw - 80, 90, hasData ? 0x3C2E1F : 0x2A1A0A, 0.9);
      slotBg.setStrokeStyle(1, COLORS.UI_GOLD, 0.3);
      slotBg.setDepth(d + 2);
      this.panelElements.push(slotBg);

      // 槽位编号
      const slotLabel = this.add.text(GAME_WIDTH / 2 - pw / 2 + 60, sy, `存档 ${i + 1}`, {
        fontSize: '20px', fontFamily: 'serif', color: '#C49A3C',
      }).setDepth(d + 5);
      this.panelElements.push(slotLabel);

      // 存档信息
      if (hasData && slot.data) {
        const ts = new Date(slot.data.timestamp).toLocaleString('zh-CN');
        const timeInfo = this.add.text(GAME_WIDTH / 2 - pw / 2 + 60, sy + 28,
          `${slot.data.slotName} · ${ts}`,
          { fontSize: '13px', color: '#8B7355' },
        ).setDepth(d + 5);
        this.panelElements.push(timeInfo);

        const seasonInfo = this.add.text(GAME_WIDTH / 2 - pw / 2 + 60, sy + 48,
          `${slot.data.time.season}第${slot.data.time.day}天 · ${slot.data.player.gold}金币`,
          { fontSize: '12px', color: '#5C4033' },
        ).setDepth(d + 5);
        this.panelElements.push(seasonInfo);

        // 读取按钮
        const loadBtn = this.add.rectangle(GAME_WIDTH / 2 + pw / 2 - 80, sy + 30, 80, 36, COLORS.BUTTON_WOOD);
        loadBtn.setStrokeStyle(1, COLORS.UI_GOLD, 0.6);
        loadBtn.setDepth(d + 5).setInteractive({ useHandCursor: true });
        loadBtn.on('pointerdown', () => this.loadGame(i));
        loadBtn.on('pointerover', () => loadBtn.setFillStyle(COLORS.BUTTON_HOVER));
        loadBtn.on('pointerout', () => loadBtn.setFillStyle(COLORS.BUTTON_WOOD));
        this.panelElements.push(loadBtn);

        const loadLabel = this.add.text(GAME_WIDTH / 2 + pw / 2 - 80, sy + 30, '读取', {
          fontSize: '15px', color: '#F5E6C8',
        }).setOrigin(0.5).setDepth(d + 6);
        this.panelElements.push(loadLabel);
      } else {
        const emptyText = this.add.text(GAME_WIDTH / 2 - pw / 2 + 60, sy + 30,
          '（空槽位）',
          { fontSize: '14px', color: '#555', fontStyle: 'italic' },
        ).setDepth(d + 5);
        this.panelElements.push(emptyText);
      }
    }

    // 关闭按钮
    const closeBtn = this.add.text(GAME_WIDTH / 2 + pw / 2 - 24, GAME_HEIGHT / 2 - ph / 2 + 24, '✕ 关闭', {
      fontSize: '16px', color: '#8B7355', fontFamily: 'serif',
    }).setOrigin(1, 0).setDepth(d + 5).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => this.destroyPanel());
    this.panelElements.push(closeBtn);
  }

  private loadGame(slotIndex: number): void {
    const data = SaveSystem.load(slotIndex);
    if (!data) return;

    // 将存档数据注入 Scene，GameScene 启动时读取
    this.registry.set('loadedSave', data);
    this.destroyPanel();
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(SceneKey.GAME);
    });
  }

  // ========== 游戏设定面板 ==========
  private showSettingsPanel(): void {
    this.destroyPanel();
    const d = 200;
    const pw = 500, ph = 380;

    const mask = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.6);
    mask.setDepth(d).setInteractive();
    mask.on('pointerdown', () => this.destroyPanel());
    this.panelElements.push(mask);

    const panel = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, pw, ph, 0x2A1A0A, 0.95);
    panel.setStrokeStyle(3, COLORS.UI_GOLD);
    panel.setDepth(d + 1);
    this.panelElements.push(panel);

    const title = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - ph / 2 + 32, '━━ 游 戏 设 定 ━━', {
      fontSize: '24px', fontFamily: 'serif', color: '#C49A3C',
    }).setOrigin(0.5).setDepth(d + 5);
    this.panelElements.push(title);

    // 设定项
    const settings = [
      { label: '音效音量', value: '80%' },
      { label: '音乐音量', value: '70%' },
      { label: '界面语言', value: '简体中文' },
    ];

    settings.forEach((s, i) => {
      const sy = GAME_HEIGHT / 2 - 60 + i * 80;
      const label = this.add.text(GAME_WIDTH / 2 - 120, sy, s.label, {
        fontSize: '18px', fontFamily: 'serif', color: '#F5E6C8',
      }).setDepth(d + 5);
      this.panelElements.push(label);

      const val = this.add.text(GAME_WIDTH / 2 + 120, sy, s.value, {
        fontSize: '18px', fontFamily: 'serif', color: '#C49A3C',
      }).setOrigin(1, 0).setDepth(d + 5);
      this.panelElements.push(val);

      // 分隔线
      if (i < settings.length - 1) {
        const line = this.add.rectangle(GAME_WIDTH / 2, sy + 50, pw - 80, 1, COLORS.UI_GOLD, 0.2);
        line.setDepth(d + 2);
        this.panelElements.push(line);
      }
    });

    // Demo提示
    const demoHint = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + ph / 2 - 70,
      '※ 设定功能将在后续版本中实装',
      { fontSize: '13px', color: '#8B7355', fontStyle: 'italic' },
    ).setOrigin(0.5).setDepth(d + 5);
    this.panelElements.push(demoHint);

    // 关闭按钮
    const closeBtn = this.add.text(GAME_WIDTH / 2 + pw / 2 - 24, GAME_HEIGHT / 2 - ph / 2 + 24, '✕ 关闭', {
      fontSize: '16px', color: '#8B7355', fontFamily: 'serif',
    }).setOrigin(1, 0).setDepth(d + 5).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => this.destroyPanel());
    this.panelElements.push(closeBtn);
  }

  private destroyPanel(): void {
    this.panelElements.forEach(e => e.destroy());
    this.panelElements = [];
  }

  // ========== 开始游戏 ==========
  private startGame(): void {
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(SceneKey.GAME);
    });
  }
}
