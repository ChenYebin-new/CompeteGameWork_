// ============================================================
// 余晖谷 Embervale - 核心游戏场景（使用AI真实图片素材）
// ============================================================

import Phaser from 'phaser';
import {
  GAME_WIDTH, GAME_HEIGHT, TILE_SIZE, COLORS, STAMINA_COST,
} from '../config/game';
import { Player } from '../entities/Player';
import { PlayerController } from '../systems/PlayerController';
import { MapManager } from '../systems/MapManager';
import { TimeSystem } from '../systems/TimeSystem';
import { WeatherSystem } from '../systems/WeatherSystem';
import { CropSystem } from '../systems/CropSystem';
import { NarrativeTree } from '../narrative/NarrativeTree';
import { InventoryUI } from '../ui/InventoryUI';
import { PauseMenu } from '../ui/PauseMenu';
import { createFarmMap } from '../maps/FarmMap';
import { createTownMap } from '../maps/TownMap';
import { createForestMap } from '../maps/ForestMap';
import { ToolType, ItemCategory } from '../types';
import type { GameMap, MapTransition } from '../types';
import { ITEMS } from '../data/items';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private controller!: PlayerController;
  private mapManager!: MapManager;
  private timeSystem!: TimeSystem;
  private weatherSystem!: WeatherSystem;
  private cropSystem!: CropSystem;
  private narrative!: NarrativeTree;
  private camTarget!: Phaser.GameObjects.Container;
  private maps: Map<string, GameMap> = new Map();

  // HUD
  private hudBg!: Phaser.GameObjects.Rectangle;
  private hudTimeText!: Phaser.GameObjects.Text;
  private hudGoldText!: Phaser.GameObjects.Text;
  private hudStaminaText!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;
  private toolText!: Phaser.GameObjects.Text;

  // 对话UI
  private dialogueBox!: Phaser.GameObjects.Container;
  private dialogueNameText!: Phaser.GameObjects.Text;
  private dialogueText!: Phaser.GameObjects.Text;
  private dialogueChoiceTexts: Phaser.GameObjects.Text[] = [];
  private isInDialogue = false;

  // UI子系统
  private inventoryUI!: InventoryUI;
  private pauseMenu!: PauseMenu;

  // NPC（使用真实图片）
  private npcSprites: Map<string, Phaser.GameObjects.Image> = new Map();
  private npcLabels: Map<string, Phaser.GameObjects.Text> = new Map();

  // 地图背景图
  private mapBgImages: Phaser.GameObjects.Image[] = [];

  private isTransitioning = false;
  private isShuttingDown = false;

  // 水面波纹效果
  private waterRippleGfx?: Phaser.GameObjects.Graphics;
  private waterRippleTime = 0;

  // HUD体力进度条
  private staminaBarBg!: Phaser.GameObjects.Rectangle;
  private staminaBarFill!: Phaser.GameObjects.Rectangle;

  constructor() { super({ key: 'GameScene' }); }

  create(): void {
    this.maps.set('farm', createFarmMap());
    this.maps.set('town', createTownMap());
    this.maps.set('forest', createForestMap());

    this.timeSystem = new TimeSystem();
    const startMap = this.maps.get('farm')!;
    this.mapManager = new MapManager(this, startMap);
    this.setupInteractions(startMap.id);

    const startTX = Math.floor(startMap.width / 2);
    const startTY = Math.floor(startMap.height / 2);
    this.player = new Player(this, startTX, startTY);
    this.player.addItem('seed_parsnip', 5);
    this.player.addItem('seed_potato', 3);

    this.controller = new PlayerController(this);
    this.narrative = new NarrativeTree(this.player);
    this.cropSystem = new CropSystem(this, this.timeSystem, this.player);
    this.weatherSystem = new WeatherSystem(this, this.timeSystem);

    // 检查是否有加载的存档数据
    const loadedSave = this.registry.get('loadedSave') as import('../types').SaveData | undefined;
    if (loadedSave) {
      this.applyLoadedSave(loadedSave);
      this.registry.remove('loadedSave');
    }

    this.camTarget = this.add.container(this.player.sprite.x, this.player.sprite.y);
    this.cameras.main.startFollow(this.camTarget, true, 0.1, 0.1);
    this.setCameraBounds();

    this.inventoryUI = new InventoryUI(this, this.player);
    this.pauseMenu = new PauseMenu(this);
    this.pauseMenu.setSaveDataProvider(() => this.collectSaveData());
    this.createHUD();
    this.createDialogueUI();
    this.renderNPCs(startMap);
    this.createWaterEffects(startMap.id);

    this.timeSystem.onHourChange = () => { this.player.restoreStamina(2); };

    // 安全关闭处理：返回标题时清理资源（once 确保只触发一次）
    this.events.once('shutdown', this.onShutdown, this);

    this.cameras.main.fadeIn(800, 0, 0, 0);
  }

  // ========== 安全关闭（防重入） ==========
  private onShutdown(): void {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;
    this.isTransitioning = true;
    this.timeSystem.pause();

    // 销毁所有子系统
    this.mapManager?.destroy();
    this.cropSystem?.destroy();
    this.weatherSystem?.destroy();
    this.controller?.destroy();
    this.player?.destroy();
    this.waterRippleGfx?.destroy();

    // 清理UI
    this.clearNPCs();
    this.inventoryUI?.close();
    this.pauseMenu?.close();
    this.dialogueBox?.setVisible(false);
    this.clearDialogueChoices();
    this.isInDialogue = false;
  }

  // ========== 存档数据收集 ==========
  private collectSaveData(): import('../types').SaveData {
    // 将 Map 转为普通对象以便 JSON 序列化
    const plantedCropsObj: { [key: string]: import('../types').PlantedCrop } = {};
    this.cropSystem.plantedCrops.forEach((v, k) => { plantedCropsObj[k] = v; });

    return {
      version: '0.3.0',
      timestamp: Date.now(),
      slotName: '',
      player: { ...this.player.state, inventory: [...this.player.state.inventory] },
      time: { ...this.timeSystem.time },
      weather: this.timeSystem.currentWeather,
      plantedCrops: plantedCropsObj,
      relationships: [],
      storyFlags: {},
      activeQuests: [],
      completedQuests: [],
      farmLevel: 1,
    };
  }

  private applyLoadedSave(data: import('../types').SaveData): void {
    // 恢复玩家状态
    this.player.state.gold = data.player.gold;
    this.player.state.stamina = data.player.stamina;
    this.player.state.maxStamina = data.player.maxStamina;
    this.player.state.inventory = data.player.inventory;
    this.player.state.currentTool = data.player.currentTool;
    this.player.sprite.setPosition(data.player.position.x, data.player.position.y);
    // 恢复时间
    this.timeSystem.time = { ...data.time };
    this.timeSystem.currentWeather = data.weather;
  }

  // ========== 主循环 ==========
  update(_time: number, delta: number): void {
    if (this.isTransitioning) return;
    this.timeSystem.update(delta);

    if (this.isInDialogue) {
      if (Phaser.Input.Keyboard.JustDown(this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E))) {
        this.advanceNPCDialogue();
      }
      return;
    }

    this.controller.update();
    const input = this.controller.input;
    const move = this.controller.getMoveInput();

    this.player.update(
      move.vx, move.vy, delta,
      (x, y) => this.mapManager.checkCollision(x, y),
      this.mapManager.currentMap.width,
      this.mapManager.currentMap.height,
    );

    this.camTarget.setPosition(this.player.sprite.x, this.player.sprite.y);
    this.weatherSystem.update();
    this.cropSystem.update();
    if (!this.isTransitioning) this.updateWaterEffects(delta);

    // 工具切换
    const k = this.input.keyboard!;
    if (Phaser.Input.Keyboard.JustDown(k.addKey(Phaser.Input.Keyboard.KeyCodes.ONE))) {
      this.player.state.currentTool = ToolType.HOE; this.showHint('工具：锄头');
    }
    if (Phaser.Input.Keyboard.JustDown(k.addKey(Phaser.Input.Keyboard.KeyCodes.TWO))) {
      this.player.state.currentTool = ToolType.WATERING_CAN; this.showHint('工具：水壶');
    }
    if (Phaser.Input.Keyboard.JustDown(k.addKey(Phaser.Input.Keyboard.KeyCodes.THREE))) {
      this.player.state.currentTool = ToolType.SCYTHE; this.showHint('工具：镰刀');
    }
    if (Phaser.Input.Keyboard.JustDown(k.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR))) {
      const seedItem = this.player.state.inventory.find(s =>
        s.itemId && s.quantity > 0 && ITEMS[s.itemId]?.category === ItemCategory.SEED
      );
      if (seedItem) {
        this.player.state.currentTool = ToolType.SEED_BAG;
        const itemName = ITEMS[seedItem.itemId]?.name ?? '种子';
        this.showHint(`种植模式：${itemName}（按4切换种子类型）`);
      } else {
        this.showHint('背包没有种子！');
      }
    }

    if (move.vx !== 0 || move.vy !== 0) this.checkMapTransition();
    if (input.interact) this.handleInteraction();
    // UI互斥：打开背包时关闭暂停菜单，打开暂停菜单时关闭背包
    if (input.inventory) {
      if (this.pauseMenu.visible) this.pauseMenu.close();
      this.inventoryUI.toggle();
      this.timeSystem.isPaused = this.inventoryUI.visible || this.pauseMenu.visible;
    }
    if (input.pause) {
      if (this.inventoryUI.visible) this.inventoryUI.close();
      this.pauseMenu.toggle();
      this.timeSystem.isPaused = this.pauseMenu.visible || this.inventoryUI.visible;
    }

    this.updateHUD();
  }

  // ========== 地图过渡 ==========
  private checkMapTransition(): void {
    const tp = this.player.getTilePosition();
    const t = this.mapManager.checkTransition(tp.tileX, tp.tileY);
    if (t && !this.isTransitioning) this.transitionToMap(t);
  }

  private async transitionToMap(trans: MapTransition): Promise<void> {
    this.isTransitioning = true;
    this.cameras.main.fadeOut(400, 0, 0, 0);
    await this.delay(400);

    const newMap = this.maps.get(trans.toMapId);
    if (!newMap) { this.isTransitioning = false; return; }

    this.mapManager.destroy();
    this.clearNPCs();

    this.mapManager = new MapManager(this, newMap);
    this.setupInteractions(newMap.id);
    this.setCameraBounds();
    this.renderNPCs(newMap);

    this.player.sprite.setPosition(
      trans.toTileX * TILE_SIZE + TILE_SIZE / 2,
      trans.toTileY * TILE_SIZE + TILE_SIZE / 2,
    );

    this.cameras.main.fadeIn(400, 0, 0, 0);
    await this.delay(400);
    this.isTransitioning = false;
  }

  // ========== 交互 ==========
  private handleInteraction(): void {
    const ft = this.player.getFrontTile();
    const tx = ft.tileX, ty = ft.tileY;

    const nearbyNpc = this.findNearbyNPC(tx, ty);
    if (nearbyNpc) { this.startNPCDialogue(nearbyNpc); return; }

    const interaction = this.mapManager.getInteractionAt(tx, ty);
    if (interaction) { this.showHint(`[交互] ${interaction}`); return; }

    const tool = this.player.state.currentTool;
    if (tool === ToolType.HOE) {
      if (this.cropSystem.hoeTile(tx, ty)) this.showHint('翻松了土地！');
      else this.showHint('此处无法耕地');
      return;
    }
    if (tool === ToolType.WATERING_CAN) {
      if (this.cropSystem.waterTile(tx, ty)) this.showHint('浇了水！');
      else this.showHint('此处不需要浇水');
      return;
    }
    if (tool === ToolType.SCYTHE) {
      const r = this.cropSystem.harvestCrop(tx, ty);
      if (r) {
        this.player.addItem(r.itemId, r.quantity);
        this.showHint(`收获了作物！`);
      } else this.showHint('无可收获的作物');
      return;
    }
    if (tool === ToolType.SEED_BAG) {
      // 找到背包中第一个种子
      const seedSlot = this.player.state.inventory.find(s =>
        s.itemId && s.quantity > 0 && ITEMS[s.itemId]?.category === ItemCategory.SEED
      );
      if (!seedSlot) {
        this.showHint('背包没有种子！按4切换工具');
        return;
      }
      const seedItem = ITEMS[seedSlot.itemId];
      if (this.cropSystem.plantSeed(tx, ty, seedSlot.itemId)) {
        this.showHint(`种下了${seedItem.name}！`);
        // 如果种子用完自动切回锄头
        if (!this.player.hasItem(seedSlot.itemId, 1)) {
          this.player.state.currentTool = ToolType.HOE;
        }
      } else {
        this.showHint('此处无法种植（需要已耕地）');
      }
    }
  }

  private setupInteractions(mapId: string): void {
    if (mapId === 'farm') {
      this.mapManager.setInteraction(12, 13, '进入小屋');
      this.mapManager.setInteraction(14, 14, '调查旧井');
    } else if (mapId === 'town') {
      this.mapManager.setInteraction(12, 17, '图书馆');
      this.mapManager.setInteraction(22, 13, '余晖客栈');
      this.mapManager.setInteraction(32, 17, '教堂');
      this.mapManager.setInteraction(12, 35, '哈娜的杂货店');
      this.mapManager.setInteraction(32, 35, '汉克铁匠铺');
    } else if (mapId === 'forest') {
      this.mapManager.setInteraction(40, 43, '空心橡树（荧族领地）');
    }
  }

  // ========== NPC（像素风精灵） ==========
  private renderNPCs(map: GameMap): void {
    const npcNames: Record<string, string> = {
      old_tom: '老汤姆', lily: '莉莉', hank: '铁锤汉克', erin: '艾琳',
      sebastian: '塞巴斯蒂安', hana: '哈娜大婶', shadow: '影子', luna: '露娜',
    };

    for (const npcPos of map.npcPositions) {
      const x = npcPos.tileX * TILE_SIZE + TILE_SIZE / 2;
      const y = npcPos.tileY * TILE_SIZE + TILE_SIZE / 2;

      // 使用生成的像素风NPC精灵
      const texKey = 'npc_' + npcPos.npcId;
      const sprite = this.textures.exists(texKey)
        ? this.add.image(x, y, texKey)
        : this.add.rectangle(x, y, TILE_SIZE - 4, TILE_SIZE - 4, 0x888888);
      sprite.setDepth(9);
      this.npcSprites.set(npcPos.npcId, sprite);

      // NPC 微呼吸动画
      this.tweens.add({
        targets: sprite,
        scaleX: 1.03, scaleY: 1.03,
        duration: 1800 + Math.random() * 400,
        yoyo: true, repeat: -1,
        ease: 'Sine.easeInOut',
      });

      const label = this.add.text(x, y - TILE_SIZE / 2 - 10, npcNames[npcPos.npcId] ?? npcPos.npcId, {
        fontSize: '11px', color: '#FFFFFF', stroke: '#000000', strokeThickness: 3,
      }).setOrigin(0.5).setDepth(12);
      this.npcLabels.set(npcPos.npcId, label);
    }
  }

  private clearNPCs(): void {
    this.npcSprites.forEach(s => s.destroy()); this.npcSprites.clear();
    this.npcLabels.forEach(l => l.destroy()); this.npcLabels.clear();
  }

  private findNearbyNPC(tx: number, ty: number): string | null {
    for (const np of this.mapManager.currentMap.npcPositions) {
      const d = Math.abs(np.tileX - tx) + Math.abs(np.tileY - ty);
      if (d <= 1) return np.npcId;
    }
    return null;
  }

  private setCameraBounds(): void {
    const m = this.mapManager.currentMap;
    this.cameras.main.setBounds(0, 0, m.width * TILE_SIZE, m.height * TILE_SIZE);
  }

  // ========== HUD (1080p) ==========
  private createHUD(): void {
    const hudH = 48;

    // 顶部HUD栏 - 渐变深色
    this.hudBg = this.add.rectangle(GAME_WIDTH / 2, 0, GAME_WIDTH, hudH, 0x1A1210, 0.9)
      .setScrollFactor(0).setOrigin(0.5, 0).setDepth(100);

    // HUD 分隔线
    const line = this.add.rectangle(GAME_WIDTH / 2, hudH, GAME_WIDTH, 2, COLORS.UI_GOLD, 0.4)
      .setScrollFactor(0).setDepth(100);

    this.hudTimeText = this.add.text(24, 12, '', {
      fontSize: '16px', color: '#F5E6C8', fontFamily: 'serif',
    }).setScrollFactor(0).setDepth(101);

    this.hudGoldText = this.add.text(GAME_WIDTH / 2, 12, '', {
      fontSize: '16px', color: '#FFD700', fontFamily: 'serif',
    }).setScrollFactor(0).setDepth(101).setOrigin(0.5, 0);

    this.hudStaminaText = this.add.text(GAME_WIDTH - 24, 12, '', {
      fontSize: '16px', color: '#4CAF50', fontFamily: 'serif',
    }).setScrollFactor(0).setDepth(101).setOrigin(1, 0);

    // 体力进度条（右上角）
    this.staminaBarBg = this.add.rectangle(GAME_WIDTH - 24, 30, 120, 6, 0x333333, 0.8)
      .setScrollFactor(0).setDepth(101).setOrigin(1, 0);
    this.staminaBarFill = this.add.rectangle(GAME_WIDTH - 26, 31, 116, 4, 0x4CAF50, 1)
      .setScrollFactor(0).setDepth(102).setOrigin(1, 0);

    this.toolText = this.add.text(24, GAME_HEIGHT - 40, '', {
      fontSize: '13px', color: '#C49A3C', fontFamily: 'serif',
      backgroundColor: '#00000088', padding: { x: 10, y: 5 },
    }).setScrollFactor(0).setDepth(101);

    this.hintText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 60,
      'WASD 移动 | E 交互 | 1锄头 2水壶 3镰刀 4种子 | Tab 背包 | Esc 暂停',
      {
        fontSize: '14px', color: '#F5E6C8', fontFamily: 'serif',
        backgroundColor: '#00000088', padding: { x: 16, y: 8 },
      },
    ).setScrollFactor(0).setDepth(101).setOrigin(0.5).setAlpha(0.7);
  }

  private updateHUD(): void {
    const p = this.player.state;
    const t = this.timeSystem;
    this.hudTimeText.setText(`${t.formatDate()} · ${t.formatTime()} | ${this.mapManager.currentMap.name}`);
    this.hudGoldText.setText(`💰 ${p.gold} 金币`);
    this.hudStaminaText.setText(`⚡ ${p.stamina}/${p.maxStamina}`);
    const tn: Record<string, string> = { hoe: '锄头', watering_can: '水壶', scythe: '镰刀', axe: '斧头', pickaxe: '十字镐', seed_bag: '种子袋' };
    this.toolText.setText(`工具：${tn[p.currentTool] ?? p.currentTool} [1/2/3/4切换]`);
    if (p.stamina < 30) this.hudStaminaText.setColor('#F44336');
    else if (p.stamina < 60) this.hudStaminaText.setColor('#FF9800');
    else this.hudStaminaText.setColor('#4CAF50');

    // 体力进度条
    const ratio = p.stamina / p.maxStamina;
    this.staminaBarFill.setSize(116 * ratio, 4);
    if (ratio < 0.3) this.staminaBarFill.setFillStyle(0xF44336, 1);
    else if (ratio < 0.6) this.staminaBarFill.setFillStyle(0xFF9800, 1);
    else this.staminaBarFill.setFillStyle(0x4CAF50, 1);
  }

  private showHint(text: string): void {
    this.hintText.setText(text).setAlpha(1);
    this.tweens.killTweensOf(this.hintText);
    this.tweens.add({ targets: this.hintText, alpha: 0, delay: 2000, duration: 500 });
  }

  // ========== 对话系统 ==========
  private createDialogueUI(): void {
    const bw = GAME_WIDTH - 200, bh = 200;
    const boxY = GAME_HEIGHT - 140;
    this.dialogueBox = this.add.container(GAME_WIDTH / 2, boxY).setScrollFactor(0).setDepth(200).setVisible(false);

    const bg = this.add.rectangle(0, 0, bw, bh, 0xF5E6C8, 0.96);
    bg.setStrokeStyle(3, 0x8B6914);
    bg.setName('dialogueBg');
    this.dialogueBox.add(bg);

    // NPC头像区域（左侧圆形占位）
    const avatarBg = this.add.rectangle(-bw / 2 + 52, 0, 72, 72, 0xD4C4A0, 0.9);
    avatarBg.setStrokeStyle(2, 0x8B6914, 0.6);
    avatarBg.setName('avatarBg');
    this.dialogueBox.add(avatarBg);

    const avatarIcon = this.add.text(-bw / 2 + 52, 0, '👤', {
      fontSize: '28px',
    }).setOrigin(0.5).setName('avatarIcon');
    this.dialogueBox.add(avatarIcon);

    this.dialogueNameText = this.add.text(-bw / 2 + 100, -bh / 2 + 16, '', {
      fontSize: '18px', fontFamily: 'serif', color: '#5C4033', fontStyle: 'bold',
    });
    this.dialogueBox.add(this.dialogueNameText);

    this.dialogueText = this.add.text(-bw / 2 + 100, -bh / 2 + 50, '', {
      fontSize: '15px', fontFamily: 'serif', color: '#3C2E1F',
      wordWrap: { width: bw - 130 }, lineSpacing: 5,
    });
    this.dialogueBox.add(this.dialogueText);

    this.dialogueBox.add(this.add.text(bw / 2 - 24, bh / 2 - 16, '▼ E / 点击继续', {
      fontSize: '11px', color: '#8B6914', fontFamily: 'serif',
    }).setOrigin(1, 1));

    bg.setInteractive();
    bg.on('pointerdown', () => this.advanceNPCDialogue());
  }

  private getDialogueBg(): Phaser.GameObjects.Rectangle | null {
    return this.dialogueBox.getByName('dialogueBg') as Phaser.GameObjects.Rectangle;
  }

  private startNPCDialogue(npcId: string): void {
    const node = this.narrative.talkToNPC(npcId);
    if (!node) return;
    this.isInDialogue = true;
    this.timeSystem.pause();
    this.showDialogueNode(node, npcId);
  }

  private showDialogueNode(node: import('../types').DialogueNode, npcId: string): void {
    this.dialogueBox.setVisible(true);
    const names: Record<string, string> = {
      old_tom: '老汤姆', lily: '莉莉', hank: '铁锤汉克', erin: '艾琳',
      sebastian: '塞巴斯蒂安', hana: '哈娜大婶', shadow: '影子', luna: '露娜',
      narrator: '旁白',
    };
    this.dialogueNameText.setText(names[npcId] ?? npcId);
    this.dialogueText.setText(node.text);
    this.clearDialogueChoices();

    if (node.choices?.length) {
      const filtered = node.choices.filter(c => {
        if (!c.conditions?.length) return true;
        return c.conditions.every(cc => this.narrative.flags.checkCondition(cc.type, cc.key, cc.operator, cc.value));
      });
      if (filtered.length) {
        // 关键修复：有选项时禁用背景点击，防止拦截选项事件
        const bg = this.getDialogueBg();
        if (bg) bg.disableInteractive();

        const sy = this.dialogueBox.y + 60;
        filtered.forEach((ch, i) => {
          const ct = this.add.text(GAME_WIDTH / 2, sy + i * 30,
            `${i + 1}. ${ch.text}`,
            { fontSize: '13px', fontFamily: 'serif', color: '#5C4033', backgroundColor: '#E8D5B7', padding: { x: 12, y: 4 } },
          ).setOrigin(0.5).setScrollFactor(0).setDepth(210); // 提高depth确保高于所有内容
          ct.setInteractive({ useHandCursor: true });
          ct.on('pointerdown', () => this.selectDialogueChoice(i));
          this.dialogueChoiceTexts.push(ct);
        });
      }
    } else {
      // 无选项时启用背景点击继续
      const bg = this.getDialogueBg();
      if (bg) bg.setInteractive();
    }
  }

  private selectDialogueChoice(i: number): void {
    const node = this.narrative.dialogue.selectChoice(i);
    if (node) this.showDialogueNode(node, this.narrative.dialogue.state!.npcId);
    else this.endDialogue();
  }

  private advanceNPCDialogue(): void {
    if (!this.narrative.dialogue.state?.isActive) { this.endDialogue(); return; }
    const node = this.narrative.dialogue.advanceDialogue();
    if (node) this.showDialogueNode(node, this.narrative.dialogue.state!.npcId);
    else this.endDialogue();
  }

  private clearDialogueChoices(): void {
    this.dialogueChoiceTexts.forEach(t => t.destroy());
    this.dialogueChoiceTexts = [];
  }

  private endDialogue(): void {
    this.isInDialogue = false;
    this.dialogueBox.setVisible(false);
    this.clearDialogueChoices();
    this.narrative.dialogue.endDialogue();
    this.timeSystem.resume();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(r => this.time.delayedCall(ms, r));
  }

  // ========== 水面波纹效果 ==========
  private createWaterEffects(mapId: string): void {
    if (mapId !== 'farm') return;

    this.waterRippleGfx = this.add.graphics();
    this.waterRippleGfx.setDepth(3); // 在水面之上
    this.waterRippleTime = 0;
  }

  private updateWaterEffects(delta: number): void {
    if (!this.waterRippleGfx) return;
    this.waterRippleTime += delta;

    const gfx = this.waterRippleGfx;
    gfx.clear();

    const map = this.mapManager.currentMap;
    if (map.id !== 'farm') return;

    const mw = map.width;
    const mh = map.height;

    // 两个水塘位置
    const ponds = [
      { cx: 7 * TILE_SIZE, cy: 9 * TILE_SIZE, r: 75 },
      { cx: (mw - 7) * TILE_SIZE, cy: (mh - 9) * TILE_SIZE, r: 75 },
    ];

    const t = this.waterRippleTime * 0.001;
    for (const pond of ponds) {
      // 波纹圈
      for (let i = 0; i < 2; i++) {
        const phase = t * 1.5 + i * Math.PI / 2;
        const alpha = 0.12 + 0.08 * Math.sin(phase);
        const r = pond.r * (0.7 + 0.15 * Math.cos(phase * 0.7 + i));

        gfx.fillStyle(0x88CCFF, alpha);
        gfx.fillEllipse(pond.cx, pond.cy, r * 2, r * 1.5);
      }
    }
  }
  getPlayer(): Player { return this.player; }
  getMapManager(): MapManager { return this.mapManager; }
}
