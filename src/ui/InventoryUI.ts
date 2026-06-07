// ============================================================
// 余晖谷 Embervale - UI 背包界面 (1080p) + 图标 + 金币实时刷新
// ============================================================

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config/game';
import { ITEMS } from '../data/items';
import type { Player } from '../entities/Player';
import type { ItemData } from '../types';

interface SlotElement {
  bg: Phaser.GameObjects.Rectangle;
  icon: Phaser.GameObjects.Rectangle;
  nameText: Phaser.GameObjects.Text;
  qtyText: Phaser.GameObjects.Text;
  qualityDot: Phaser.GameObjects.Rectangle;  // 品质指示
}

export class InventoryUI {
  private scene: Phaser.Scene;
  private player: Player;
  private elements: Phaser.GameObjects.GameObject[] = [];
  private slotElements: SlotElement[] = [];
  private descText!: Phaser.GameObjects.Text;
  private goldText!: Phaser.GameObjects.Text;
  private isVisible = false;

  // 物品颜色映射（图标占位色）
  private static ITEM_COLORS: Record<string, number> = {
    seed_parsnip: 0x8B7355, seed_potato: 0xD4A76A, seed_tomato: 0xE84D3D,
    seed_starberry: 0xFF69B4,
    parsnip: 0xD4A574, potato: 0xC49A3C, tomato: 0xE8492D,
    starberry: 0xFF1493, stone: 0x808080, wood: 0x8B6914,
    fiber: 0x7B9E5A, hoe: 0x8B8B8B, watering_can: 0x4A90D9,
    axe: 0xA0A0A0, pickaxe: 0x909090, scythe: 0x707070,
  };

  constructor(scene: Phaser.Scene, player: Player) {
    this.scene = scene;
    this.player = player;
    this.build();
    this.setVisible(false);
  }

  private build(): void {
    const d = 300;
    const pw = 640, ph = 660;

    // 遮罩
    const mask = this.scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.5);
    mask.setScrollFactor(0).setDepth(d).setInteractive();
    mask.on('pointerdown', () => this.close());
    this.elements.push(mask);

    // 面板 + 边框
    const panel = this.scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, pw, ph, COLORS.UI_PANEL, 0.95);
    panel.setStrokeStyle(3, COLORS.UI_GOLD);
    panel.setScrollFactor(0).setDepth(d + 1);
    this.elements.push(panel);

    // 内边框装饰
    const inner = this.scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, pw - 12, ph - 12, 0x000000, 0);
    inner.setStrokeStyle(1, COLORS.UI_GOLD, 0.3);
    inner.setScrollFactor(0).setDepth(d + 2);
    this.elements.push(inner);

    // 标题
    const title = this.scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - ph / 2 + 24, '━━ 背 包 ━━', {
      fontSize: '24px', fontFamily: 'serif', color: '#C49A3C',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(d + 5);
    this.elements.push(title);

    const closeHint = this.scene.add.text(GAME_WIDTH / 2 + pw / 2 - 24, GAME_HEIGHT / 2 - ph / 2 + 24, 'Tab 关闭', {
      fontSize: '12px', color: '#8B7355',
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(d + 5);
    this.elements.push(closeHint);

    // 金币显示（动态刷新）
    this.goldText = this.scene.add.text(GAME_WIDTH / 2 - pw / 2 + 24, GAME_HEIGHT / 2 - ph / 2 + 24,
      `💰 ${this.player.state.gold}`,
      { fontSize: '13px', color: '#FFD700', fontFamily: 'serif' },
    ).setScrollFactor(0).setDepth(d + 5);
    this.elements.push(this.goldText);

    // 描述
    this.descText = this.scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + ph / 2 - 60, '', {
      fontSize: '13px', color: '#C49A3C', fontFamily: 'serif',
      wordWrap: { width: pw - 60 }, align: 'center',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(d + 5);
    this.elements.push(this.descText);

    // 格子 6x4
    const cols = 6, rows = 4, slotSize = 80;
    const sx = GAME_WIDTH / 2 - (cols * slotSize) / 2 + slotSize / 2;
    const sy = GAME_HEIGHT / 2 - 100;

    for (let i = 0; i < cols * rows; i++) {
      const cx = sx + (i % cols) * slotSize;
      const cy = sy + Math.floor(i / cols) * slotSize;
      const idx = i;

      const slotBg = this.scene.add.rectangle(cx, cy, slotSize - 6, slotSize - 6, 0x3C2E1F, 0.8);
      slotBg.setStrokeStyle(1, COLORS.UI_GOLD, 0.4);
      slotBg.setScrollFactor(0).setDepth(d + 3);
      this.elements.push(slotBg);

      // 物品图标（带颜色的矩形）
      const icon = this.scene.add.rectangle(cx, cy - 8, 30, 30, 0x555555, 0);
      icon.setStrokeStyle(1, 0x888888, 0.5);
      icon.setScrollFactor(0).setDepth(d + 3);
      this.elements.push(icon);

      const nameText = this.scene.add.text(cx, cy + 22, '', {
        fontSize: '10px', color: '#F5E6C8', fontFamily: 'serif',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(d + 4);

      const qtyText = this.scene.add.text(cx + slotSize / 2 - 8, cy + slotSize / 2 - 8, '', {
        fontSize: '11px', color: '#FFD700',
      }).setOrigin(1, 1).setScrollFactor(0).setDepth(d + 4);

      // 品质指示点（默认隐藏）
      const qualityDot = this.scene.add.rectangle(cx + slotSize / 2 - 16, cy - slotSize / 2 + 10, 6, 6, 0xFFFFFF, 0)
        .setScrollFactor(0).setDepth(d + 5);

      this.elements.push(nameText, qtyText, qualityDot);
      this.slotElements.push({ bg: slotBg, icon, nameText, qtyText, qualityDot });

      slotBg.setInteractive({ useHandCursor: true });
      slotBg.on('pointerover', () => {
        const s = this.player.state.inventory[idx];
        if (s?.itemId) {
          const item = ITEMS[s.itemId];
          if (item) this.descText.setText(`「${item.name}」${item.description}\n售价: ${item.sellPrice}G · 买入: ${item.buyPrice}G`);
          slotBg.setFillStyle(0x5C3E2F);
        }
      });
      slotBg.on('pointerout', () => {
        slotBg.setFillStyle(0x3C2E1F, 0.8);
        this.descText.setText('');
      });
    }

    // 排序按钮
    const sortBtn = this.scene.add.text(GAME_WIDTH / 2 + pw / 2 - 28, GAME_HEIGHT / 2 + ph / 2 - 28, '[排序]', {
      fontSize: '14px', color: '#C49A3C', fontFamily: 'serif',
      backgroundColor: '#3C2E1F', padding: { x: 10, y: 6 },
    }).setOrigin(1, 1).setScrollFactor(0).setDepth(d + 5).setInteractive({ useHandCursor: true });
    sortBtn.on('pointerdown', () => {
      this.player.state.inventory.sort((a, b) => {
        if (a.itemId === '' && b.itemId === '') return 0;
        if (a.itemId === '') return 1;
        if (b.itemId === '') return -1;
        return a.itemId.localeCompare(b.itemId);
      });
      this.refresh();
    });
    this.elements.push(sortBtn);
  }

  refresh(): void {
    // 刷新金币
    this.goldText.setText(`💰 ${this.player.state.gold}`);

    for (let i = 0; i < this.slotElements.length; i++) {
      const slot = this.player.state.inventory[i];
      const { icon, nameText, qtyText, qualityDot } = this.slotElements[i];
      if (slot?.itemId && slot.quantity > 0) {
        const item = ITEMS[slot.itemId];
        // 物品图标颜色 + 内发光边框
        const iconColor = InventoryUI.ITEM_COLORS[slot.itemId] ?? 0x888888;
        icon.setFillStyle(iconColor, 0.8);
        icon.setStrokeStyle(2, 0xFFD700, 0.6);
        nameText.setText(item?.name ?? slot.itemId);
        qtyText.setText(slot.quantity > 1 ? `x${slot.quantity}` : '');
        // 品质指示（种子/作物根据类别显示边框色）
        qualityDot.setFillStyle(0xFFFFFF, 0);
      } else {
        icon.setFillStyle(0x555555, 0);
        icon.setStrokeStyle(1, 0x888888, 0.5);
        nameText.setText('');
        qtyText.setText('');
        qualityDot.setFillStyle(0xFFFFFF, 0);
      }
    }
  }

  private setVisible(v: boolean): void {
    this.isVisible = v;
    this.elements.forEach(e => {
      if ('setVisible' in e) (e as Phaser.GameObjects.Components.Visible).setVisible(v);
    });
  }

  toggle(): void { this.setVisible(!this.isVisible); if (this.isVisible) this.refresh(); }
  close(): void { this.setVisible(false); }
  get visible(): boolean { return this.isVisible; }
}
