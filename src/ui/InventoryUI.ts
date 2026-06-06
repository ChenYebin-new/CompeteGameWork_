// ============================================================
// 余晖谷 Embervale - UI 背包界面 (1080p)
// ============================================================

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config/game';
import { ITEMS } from '../data/items';
import type { Player } from '../entities/Player';

interface SlotElement {
  nameText: Phaser.GameObjects.Text;
  qtyText: Phaser.GameObjects.Text;
}

export class InventoryUI {
  private scene: Phaser.Scene;
  private player: Player;
  private elements: Phaser.GameObjects.GameObject[] = [];
  private slotElements: SlotElement[] = [];
  private descText!: Phaser.GameObjects.Text;
  private isVisible = false;

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

    // 金币显示
    const goldText = this.scene.add.text(GAME_WIDTH / 2 - pw / 2 + 24, GAME_HEIGHT / 2 - ph / 2 + 24,
      `💰 ${this.player.state.gold}`, {
        fontSize: '13px', color: '#FFD700', fontFamily: 'serif',
      },
    ).setScrollFactor(0).setDepth(d + 5);
    this.elements.push(goldText);

    // 描述
    this.descText = this.scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + ph / 2 - 60, '', {
      fontSize: '13px', color: '#C49A3C', fontFamily: 'serif',
      wordWrap: { width: pw - 60 }, align: 'center',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(d + 5);
    this.elements.push(this.descText);

    // 格子 6x4 (1080p: slotSize=80)
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

      const nameText = this.scene.add.text(cx, cy + 22, '', {
        fontSize: '10px', color: '#F5E6C8', fontFamily: 'serif',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(d + 4);

      const qtyText = this.scene.add.text(cx + slotSize / 2 - 8, cy + slotSize / 2 - 8, '', {
        fontSize: '11px', color: '#FFD700',
      }).setOrigin(1, 1).setScrollFactor(0).setDepth(d + 4);

      this.elements.push(nameText, qtyText);
      this.slotElements.push({ nameText, qtyText });

      slotBg.setInteractive();
      slotBg.on('pointerover', () => {
        const s = this.player.state.inventory[idx];
        if (s?.itemId) {
          const item = ITEMS[s.itemId];
          if (item) this.descText.setText(item.description);
        }
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
    for (let i = 0; i < this.slotElements.length; i++) {
      const slot = this.player.state.inventory[i];
      const { nameText, qtyText } = this.slotElements[i];
      if (slot?.itemId && slot.quantity > 0) {
        const item = ITEMS[slot.itemId];
        nameText.setText(item?.name ?? slot.itemId);
        qtyText.setText(slot.quantity > 1 ? `x${slot.quantity}` : '');
      } else {
        nameText.setText('');
        qtyText.setText('');
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
