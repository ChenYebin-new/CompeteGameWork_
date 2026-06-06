// ============================================================
// 余晖谷 Embervale - 存档系统
// ============================================================

import type { SaveData } from '../types';

const SAVE_VERSION = '0.1.0';
const SAVE_KEY_PREFIX = 'embervale_save_';
const MAX_SLOTS = 3;

export class SaveSystem {
  // ========== 保存 ==========

  static save(slotIndex: number, data: SaveData): boolean {
    if (slotIndex < 0 || slotIndex >= MAX_SLOTS) return false;

    try {
      const saveData: SaveData = {
        ...data,
        version: SAVE_VERSION,
        timestamp: Date.now(),
      };
      const json = JSON.stringify(saveData);
      localStorage.setItem(`${SAVE_KEY_PREFIX}${slotIndex}`, json);
      return true;
    } catch (err) {
      console.error('存档失败:', err);
      return false;
    }
  }

  // ========== 读取 ==========

  static load(slotIndex: number): SaveData | null {
    if (slotIndex < 0 || slotIndex >= MAX_SLOTS) return null;

    try {
      const json = localStorage.getItem(`${SAVE_KEY_PREFIX}${slotIndex}`);
      if (!json) return null;

      const data = JSON.parse(json) as SaveData;
      if (!data.version || !data.player || !data.time) {
        console.error('存档数据损坏');
        return null;
      }
      return data;
    } catch (err) {
      console.error('读档失败:', err);
      return null;
    }
  }

  // ========== 删除 ==========

  static delete(slotIndex: number): boolean {
    if (slotIndex < 0 || slotIndex >= MAX_SLOTS) return false;
    localStorage.removeItem(`${SAVE_KEY_PREFIX}${slotIndex}`);
    return true;
  }

  // ========== 存档列表 ==========

  static getSaveSlots(): { slotIndex: number; data: SaveData | null }[] {
    const slots = [];
    for (let i = 0; i < MAX_SLOTS; i++) {
      slots.push({ slotIndex: i, data: SaveSystem.load(i) });
    }
    return slots;
  }

  // ========== 新建存档数据 ==========

  static createNewSaveData(slotName: string = '新游戏'): SaveData {
    return {
      version: SAVE_VERSION,
      timestamp: Date.now(),
      slotName,
      player: {
        name: '莱拉',
        gold: 500,
        stamina: 100,
        maxStamina: 100,
        currentTool: 'hoe',
        inventory: Array.from({ length: 24 }, () => ({ itemId: '', quantity: 0 })),
        inventorySize: 24,
        position: { x: 0, y: 0 },
        direction: 'down',
      },
      time: {
        year: 1,
        season: 'spring',
        day: 1,
        hour: 6,
        minute: 0,
      },
      weather: 'sunny',
      plantedCrops: {},
      relationships: [],
      storyFlags: {},
      activeQuests: [],
      completedQuests: [],
      farmLevel: 1,
    };
  }
}
