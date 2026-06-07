// ============================================================
// 余晖谷 Embervale - 玩家实体（Sprite + 四方向行走动画）
// ============================================================

import Phaser from 'phaser';
import { TILE_SIZE, PLAYER_SPEED, INITIAL_PLAYER } from '../config/game';
import { Direction } from '../types';
import type { PlayerState, InventorySlot, ToolType } from '../types';

const FRAME_COUNT = 4;
const ANIM_FRAME_RATE = 8;

export class Player {
  public scene: Phaser.Scene;
  public sprite: Phaser.GameObjects.Sprite;
  public state: PlayerState;
  private moveSpeed = PLAYER_SPEED;
  private nameLabel!: Phaser.GameObjects.Text;
  private isMoving = false;

  constructor(scene: Phaser.Scene, startTileX: number, startTileY: number) {
    this.scene = scene;
    const sx = startTileX * TILE_SIZE + TILE_SIZE / 2;
    const sy = startTileY * TILE_SIZE + TILE_SIZE / 2;

    // 使用 Sprite（默认朝下站立帧）
    this.sprite = scene.add.sprite(sx, sy, 'player_down_0');
    this.sprite.setDepth(10);

    // 创建四个方向的行走动画
    this.createAnimations();

    // 名字标签
    this.nameLabel = scene.add.text(sx, sy - TILE_SIZE / 2 - 14, INITIAL_PLAYER.name, {
      fontSize: '12px', fontFamily: 'serif', color: '#FFFFFF',
      stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(12);

    this.state = {
      name: INITIAL_PLAYER.name, gold: INITIAL_PLAYER.gold,
      stamina: INITIAL_PLAYER.stamina, maxStamina: INITIAL_PLAYER.maxStamina,
      currentTool: 'hoe' as ToolType,
      inventory: this.makeInv(INITIAL_PLAYER.inventorySize),
      inventorySize: INITIAL_PLAYER.inventorySize,
      position: { x: sx, y: sy },
      direction: Direction.DOWN,
    };
  }

  // ========== 创建四方向行走动画 ==========
  private createAnimations(): void {
    const dirs = ['down', 'up', 'left', 'right'];
    for (const dir of dirs) {
      const animKey = 'player_walk_' + dir;
      if (this.scene.anims.exists(animKey)) continue;

      const frames = [];
      for (let f = 0; f < FRAME_COUNT; f++) {
        const texKey = 'player_' + dir + '_' + f;
        if (this.scene.textures.exists(texKey)) {
          frames.push({ key: texKey });
        }
      }

      if (frames.length > 0) {
        this.scene.anims.create({
          key: animKey,
          frames: frames as Phaser.Types.Animations.AnimationFrame[],
          frameRate: ANIM_FRAME_RATE,
          repeat: -1,
        });
      }
    }
  }

  // ========== 主更新 ==========
  update(vx: number, vy: number, delta: number,
    collisionCheck: (x: number, y: number) => boolean,
    mapWidth: number, mapHeight: number,
  ): void {
    if (vx !== 0 && vy !== 0) { const n = Math.SQRT1_2; vx *= n; vy *= n; }

    if (vx !== 0 || vy !== 0) {
      // 计算方向
      let dir: Direction;
      if (Math.abs(vy) >= Math.abs(vx)) {
        dir = vy < 0 ? Direction.UP : Direction.DOWN;
      } else {
        dir = vx < 0 ? Direction.LEFT : Direction.RIGHT;
      }
      this.setDirection(dir);

      // 播放行走动画
      if (!this.isMoving) {
        this.isMoving = true;
        this.sprite.play('player_walk_' + dir);
      }

      const dx = vx * this.moveSpeed * (delta / 1000);
      const dy = vy * this.moveSpeed * (delta / 1000);
      let nx = this.sprite.x + dx;
      let ny = this.sprite.y + dy;

      if (!collisionCheck(nx, this.sprite.y)) this.sprite.x = nx;
      if (!collisionCheck(this.sprite.x, ny)) this.sprite.y = ny;

      this.sprite.x = Phaser.Math.Clamp(this.sprite.x, TILE_SIZE, mapWidth * TILE_SIZE - TILE_SIZE);
      this.sprite.y = Phaser.Math.Clamp(this.sprite.y, TILE_SIZE, mapHeight * TILE_SIZE - TILE_SIZE);

      this.state.position.x = this.sprite.x;
      this.state.position.y = this.sprite.y;
      this.nameLabel.setPosition(this.sprite.x, this.sprite.y - TILE_SIZE / 2 - 14);
    } else if (this.isMoving) {
      // 停止行走，显示站立帧
      this.isMoving = false;
      this.sprite.stop();
      this.sprite.setTexture('player_' + this.state.direction + '_0');
    }
  }

  private setDirection(dir: Direction): void {
    if (this.state.direction === dir) return;
    this.state.direction = dir;

    // 如果正在移动，切换到新方向的动画
    if (this.isMoving) {
      this.sprite.play('player_walk_' + dir);
    } else {
      this.sprite.setTexture('player_' + dir + '_0');
    }
  }

  getTilePosition() {
    return { tileX: Math.floor(this.sprite.x / TILE_SIZE), tileY: Math.floor(this.sprite.y / TILE_SIZE) };
  }

  getFrontTile() {
    const p = this.getTilePosition();
    switch (this.state.direction) {
      case Direction.UP:    return { tileX: p.tileX, tileY: p.tileY - 1 };
      case Direction.DOWN:  return { tileX: p.tileX, tileY: p.tileY + 1 };
      case Direction.LEFT:  return { tileX: p.tileX - 1, tileY: p.tileY };
      case Direction.RIGHT: return { tileX: p.tileX + 1, tileY: p.tileY };
    }
  }

  addGold(a: number) { this.state.gold += a; }
  spendGold(a: number): boolean { if (this.state.gold >= a) { this.state.gold -= a; return true; } return false; }
  consumeStamina(a: number): boolean { if (this.state.stamina >= a) { this.state.stamina -= a; return true; } return false; }
  restoreStamina(a: number) { this.state.stamina = Math.min(this.state.stamina + a, this.state.maxStamina); }

  private makeInv(s: number): InventorySlot[] {
    return Array.from({ length: s }, () => ({ itemId: '', quantity: 0 }));
  }

  addItem(id: string, qty: number): boolean {
    for (const s of this.state.inventory) { if (s.itemId === id && s.quantity > 0) { s.quantity += qty; return true; } }
    for (const s of this.state.inventory) { if (s.itemId === '' || s.quantity === 0) { s.itemId = id; s.quantity = qty; return true; } }
    return false;
  }

  removeItem(id: string, qty: number): boolean {
    let r = qty;
    for (const s of this.state.inventory) {
      if (s.itemId === id) { const d = Math.min(s.quantity, r); s.quantity -= d; r -= d; if (s.quantity <= 0) { s.itemId = ''; s.quantity = 0; } if (r <= 0) return true; }
    }
    return r <= 0;
  }

  hasItem(id: string, qty = 1): boolean {
    let c = 0; for (const s of this.state.inventory) { if (s.itemId === id) c += s.quantity; } return c >= qty;
  }

  destroy(): void { this.nameLabel?.destroy(); this.sprite.destroy(); }
}
