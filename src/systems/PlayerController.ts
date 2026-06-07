// ============================================================
// 余晖谷 Embervale - 玩家控制器（输入处理）
// ============================================================

import Phaser from 'phaser';

export interface PlayerInput {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  interact: boolean;   // E键
  action1: boolean;     // 数字1-0 / 鼠标左键
  inventory: boolean;   // Tab / I键
  pause: boolean;       // ESC
}

export class PlayerController {
  private scene: Phaser.Scene;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    E: Phaser.Input.Keyboard.Key;
    TAB: Phaser.Input.Keyboard.Key;
    I: Phaser.Input.Keyboard.Key;
    ESC: Phaser.Input.Keyboard.Key;
  };
  public input: PlayerInput;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.keys = {
      W: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      E: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      TAB: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.TAB),
      I: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.I),
      ESC: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
    };

    this.input = {
      up: false,
      down: false,
      left: false,
      right: false,
      interact: false,
      action1: false,
      inventory: false,
      pause: false,
    };
  }

  update(): PlayerInput {
    this.input = {
      up: this.keys.W.isDown || this.cursors.up.isDown,
      down: this.keys.S.isDown || this.cursors.down.isDown,
      left: this.keys.A.isDown || this.cursors.left.isDown,
      right: this.keys.D.isDown || this.cursors.right.isDown,
      interact: Phaser.Input.Keyboard.JustDown(this.keys.E),
      action1: false, // 阶段6实现
      inventory: Phaser.Input.Keyboard.JustDown(this.keys.TAB) || Phaser.Input.Keyboard.JustDown(this.keys.I),
      pause: Phaser.Input.Keyboard.JustDown(this.keys.ESC),
    };

    return this.input;
  }

  /** 获取移动输入 (-1, 0, 1) */
  getMoveInput(): { vx: number; vy: number } {
    let vx = 0;
    let vy = 0;
    if (this.input.left) vx -= 1;
    if (this.input.right) vx += 1;
    if (this.input.up) vy -= 1;
    if (this.input.down) vy += 1;
    return { vx, vy };
  }

  destroy(): void {
    // 键盘对象由 Phaser 管理，无需手动清理
    this.input = {
      up: false, down: false, left: false, right: false,
      interact: false, action1: false, inventory: false, pause: false,
    };
  }
}
