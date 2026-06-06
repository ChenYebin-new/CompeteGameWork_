// ============================================================
// 余晖谷 Embervale - 启动加载（1080p + 像素风角色生成）
// ============================================================

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS, TILE_SIZE } from '../config/game';
import { SceneKey } from '../types';

export class BootScene extends Phaser.Scene {
  private loadingText!: Phaser.GameObjects.Text;
  private loadCount = 0;

  constructor() { super({ key: SceneKey.BOOT }); }

  preload(): void {
    this.cameras.main.setBackgroundColor(COLORS.SKY_NIGHT);

    // 加载界面
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 3, '余 晖 谷', {
      fontSize: '64px', fontFamily: 'serif', color: '#C49A3C',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 3 + 64, 'Embervale', {
      fontSize: '22px', fontFamily: 'serif', color: '#8B7355',
    }).setOrigin(0.5);

    // 进度条
    const pbg = this.add.graphics();
    pbg.lineStyle(2, COLORS.HARVEST_GOLD, 1);
    pbg.strokeRect(GAME_WIDTH / 2 - 200, GAME_HEIGHT / 2 + 40, 400, 24);

    const pbar = this.add.graphics();
    this.load.on('progress', (v: number) => {
      pbar.clear();
      pbar.fillStyle(COLORS.HARVEST_GOLD, 1);
      pbar.fillRect(GAME_WIDTH / 2 - 197, GAME_HEIGHT / 2 + 43, 394 * v, 18);
    });

    this.loadingText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 80, '加载中...', {
      fontSize: '14px', color: '#8B7355',
    }).setOrigin(0.5);

    // 加载AI生成的图片
    this.load.image('player_sprite', 'assets/characters/pixel_art_game_character_sprit_2026-06-06T15-27-55.png');
    this.load.image('npc_sheet', 'assets/characters/pixel_art_game_NPC_sprites_she_2026-06-06T15-27-44.png');
    this.load.image('tileset_ground', 'assets/tilesets/pixel_art_tileable_ground_text_2026-06-06T15-27-41.png');
    this.load.image('tileset_buildings', 'assets/tilesets/pixel_art_top_down_RPG_buildin_2026-06-06T15-28-32.png');
    this.load.image('title_bg', 'assets/ui/pixel_art_game_title_screen_ar_2026-06-06T15-27-38.png');
    this.load.image('ui_elements', 'assets/ui/pixel_art_game_UI_elements_set_2026-06-06T15-28-29.png');
    this.load.image('item_icons', 'assets/items/pixel_art_item_icons_for_farmi_2026-06-06T15-28-24.png');
    this.load.image('crop_stages', 'assets/items/pixel_art_crop_growth_stages_f_2026-06-06T15-28-56.png');
  }

  create(): void {
    this.loadingText.setText('生成角色...');

    // 生成像素风玩家精灵（四方向）
    this.generatePlayerSprites();

    // 生成像素风NPC精灵
    this.generateNPCSprites();

    // 生成UI纹理
    this.generateUITextures();

    this.loadingText.setText('准备就绪');
    this.time.delayedCall(300, () => this.scene.start(SceneKey.MENU));
  }

  // ========================================
  // 像素风玩家精灵 (TILE_SIZE宽 x TILE_SIZE*1.25高)
  // ========================================
  private generatePlayerSprites(): void {
    const pw = TILE_SIZE;
    const ph = Math.floor(TILE_SIZE * 1.25); // 48 x 60

    // 生成四个方向的玩家精灵（简化：只区分正面/侧面颜色）
    for (const dir of ['down', 'up', 'left', 'right']) {
      const g = this.add.graphics();

      const cropX = 11, cropW = 26;
      const bodyTop = 20, bodyH = 30;

      // --- 阴影（圆形） ---
      g.fillStyle(0x000000, 0.2);
      g.fillEllipse(pw / 2, ph - 4, pw - 8, 12);

      // --- 鞋子 ---
      g.fillStyle(0x3A2A1A, 1);
      g.fillRect(14, ph - 10, 8, 8);
      g.fillRect(pw - 22, ph - 10, 8, 8);

      // --- 裤子 ---
      g.fillStyle(0x4A6FA5, 1);
      g.fillRect(cropX + 1, bodyTop + 16, cropW - 2, 14);

      // --- 上衣（绿色农夫衬衫） ---
      g.fillStyle(0x5B8C5A, 1);
      g.fillRect(cropX, bodyTop, cropW, 16);

      // --- 手臂 ---
      g.fillStyle(0xFFDAB9, 1);
      g.fillRect(4, bodyTop, 7, 20);
      g.fillRect(pw - 11, bodyTop, 7, 20);

      // --- 领口 ---
      g.fillStyle(0x8B6B4A, 1);
      g.fillRect(cropX + 8, bodyTop, 10, 4);

      // --- 头部 ---
      const headY = 4, headH = 18;
      g.fillStyle(0xFFDAB9, 1);
      g.fillRect(cropX + 2, headY, cropW - 4, headH);

      // --- 头发（棕色长发/马尾） ---
      g.fillStyle(0x6B4226, 1);
      g.fillRect(cropX + 1, headY, cropW - 2, 10);
      // 马尾辫
      g.fillRect(pw - 8, headY + 6, 5, 5);

      // --- 眼睛 ---
      g.fillStyle(0x000000, 1);
      g.fillRect(cropX + 6, headY + 7, 3, 3);
      g.fillRect(cropX + cropW - 11, headY + 7, 3, 3);

      // --- 草帽 ---
      g.fillStyle(0xDAA520, 1);
      g.fillRect(cropX - 1, headY - 2, cropW + 2, 6);
      g.fillStyle(0xC49A3C, 0.6);
      g.fillRect(cropX - 2, headY - 4, cropW + 4, 4);

      // 侧面朝向微调（左右翻转时做镜像）
      const flipX = (dir === 'right');

      g.generateTexture('player_' + dir, pw, ph);
      g.destroy();
      this.loadCount++;
    }
  }

  // ========================================
  // 像素风NPC精灵（8个角色，每个32x40）
  // ========================================
  private generateNPCSprites(): void {
    const npcDefs: { id: string; body: number; hair: number; style: string }[] = [
      { id: 'old_tom', body: 0x6B8E6B, hair: 0xCCCCCC, style: 'old' },
      { id: 'lily', body: 0xD4A5A5, hair: 0x4A3728, style: 'girl' },
      { id: 'hank', body: 0x8B4513, hair: 0x333333, style: 'muscle' },
      { id: 'erin', body: 0xCD853F, hair: 0xDAA520, style: 'girl' },
      { id: 'sebastian', body: 0x2F2F2F, hair: 0x1A1A1A, style: 'priest' },
      { id: 'hana', body: 0xD2691E, hair: 0x8B8B83, style: 'old' },
      { id: 'shadow', body: 0x483D8B, hair: 0x191970, style: 'hood' },
      { id: 'luna', body: 0xADD8E6, hair: 0xFFD700, style: 'fairy' },
    ];

    for (const npc of npcDefs) {
      const g = this.add.graphics();
      const nw = 48, nh = 56;

      // 阴影
      g.fillStyle(0x000000, 0.2);
      g.fillEllipse(nw / 2, nh - 4, nw - 8, 10);

      // 腿部
      g.fillStyle(0x4A3728, 1);
      g.fillRect(14, nh - 8, 7, 6);
      g.fillRect(nw - 21, nh - 8, 7, 6);

      // 身体
      g.fillStyle(npc.body, 1);
      g.fillRect(10, 22, nw - 20, 28);

      // 头部
      g.fillStyle(0xFFDAB9, 1);
      g.fillRect(12, 4, nw - 24, 16);

      // 头发
      g.fillStyle(npc.hair, 1);
      if (npc.style === 'hood') {
        g.fillRect(8, 2, nw - 16, 22); // 兜帽覆盖更多
      } else if (npc.style === 'fairy') {
        g.fillRect(10, 2, nw - 20, 14);
        g.fillStyle(0xFFD700, 0.5);
        g.fillCircle(nw / 2, 2, 6); // 光环
      } else {
        g.fillRect(11, 3, nw - 22, 12);
      }

      // 眼睛
      g.fillStyle(0x000000, 1);
      g.fillRect(16, 9, 3, 3);
      g.fillRect(nw - 19, 9, 3, 3);

      // 特定装饰
      if (npc.style === 'old') {
        g.fillStyle(0x8B6914, 1);
        g.fillRect(6, nh / 2 + 4, 4, nh / 2 - 8); // 拐杖
      }
      if (npc.style === 'priest') {
        g.fillStyle(0xFFFFFF, 0.4);
        g.fillRect(18, 18, nw - 36, 8); // 领饰
      }

      g.generateTexture('npc_' + npc.id, nw, nh);
      g.destroy();
      this.loadCount++;
    }
  }

  // ========================================
  // UI纹理
  // ========================================
  private generateUITextures(): void {
    // 按钮木纹 (已由主菜单自行绘制)
    this.createColorTexture('btn_wood', '#8B6914', 320, 52);
    this.createColorTexture('btn_hover', '#C49A3C', 320, 52);
    this.createColorTexture('panel_bg', '#2A1A0A', 32, 32);
    this.createColorTexture('slot_bg', '#3C2E1F', 72, 72);
    this.createColorTexture('heart', '#FF4081', 20, 20);
    this.createColorTexture('particle_white', '#FFFFFF', 4, 4);
    this.createColorTexture('particle_gold', '#FFD700', 4, 4);
    this.createColorTexture('particle_water', '#4A90D9', 2, 20);
  }

  private createColorTexture(key: string, hex: string, w: number, h: number): void {
    const g = this.add.graphics();
    g.fillStyle(Phaser.Display.Color.HexStringToColor(hex).color, 1);
    g.fillRect(0, 0, w, h);
    g.generateTexture(key, w, h);
    g.destroy();
  }
}
