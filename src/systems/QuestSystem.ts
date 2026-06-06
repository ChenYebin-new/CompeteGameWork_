// ============================================================
// 余晖谷 Embervale - 任务系统
// ============================================================

import { QUESTS } from '../data/quests';
import type { QuestData, QuestObjective, QuestStatus } from '../types';
import type { FlagManager } from '../narrative/FlagManager';

export interface ActiveQuest {
  questId: string;
  objectives: QuestObjective[];
}

export class QuestSystem {
  private flags: FlagManager;
  public activeQuests: Map<string, ActiveQuest> = new Map();
  public completedQuests: Set<string> = new Set();

  constructor(flags: FlagManager) {
    this.flags = flags;
  }

  // ========== 启动任务 ==========

  startQuest(questId: string): boolean {
    const quest = QUESTS[questId];
    if (!quest) return false;
    if (this.activeQuests.has(questId) || this.completedQuests.has(questId)) return false;

    // 检查前置条件
    for (const req of quest.prerequisites) {
      switch (req.type) {
        case 'quest':
          if (!this.completedQuests.has(req.target)) return false;
          break;
        case 'friendship':
          // 由外部检查
          break;
        case 'flag':
          if (!this.flags.has(req.target)) return false;
          break;
      }
    }

    this.activeQuests.set(questId, {
      questId,
      objectives: quest.objectives.map(o => ({ ...o, current: 0 })),
    });

    this.flags.set(`quest_${questId}`, 'active');
    return true;
  }

  // ========== 更新目标 ==========

  updateObjective(questId: string, type: string, target: string, amount: number = 1): void {
    const active = this.activeQuests.get(questId);
    if (!active) return;

    for (const obj of active.objectives) {
      if (obj.type === type && obj.target === target) {
        obj.current = Math.min(obj.count, obj.current + amount);
      }
    }

    // 检查完成
    if (this.isQuestComplete(active)) {
      this.flags.set(`quest_${questId}_ready`, 1);
    }
  }

  private isQuestComplete(active: ActiveQuest): boolean {
    return active.objectives.every(o => o.current >= o.count);
  }

  // ========== 完成任务 ==========

  completeQuest(questId: string): boolean {
    const active = this.activeQuests.get(questId);
    if (!active) return false;
    if (!this.isQuestComplete(active)) return false;

    const quest = QUESTS[questId];
    if (!quest) return false;

    // 发放奖励
    const rewards = quest.rewards;
    // rewards由外部处理（金币、物品、好感度等）

    this.activeQuests.delete(questId);
    this.completedQuests.add(questId);
    this.flags.set(`quest_${questId}`, 'completed');

    return true;
  }

  // ========== 查询 ==========

  getQuest(questId: string): QuestData | null {
    return QUESTS[questId] ?? null;
  }

  getStatus(questId: string): QuestStatus {
    if (this.completedQuests.has(questId)) return 'completed';
    if (this.activeQuests.has(questId)) return 'active';
    return 'not_started';
  }

  getActiveQuestObjectives(): { quest: QuestData; objectives: QuestObjective[] }[] {
    const result = [];
    for (const [, active] of this.activeQuests) {
      const quest = QUESTS[active.questId];
      if (quest) {
        result.push({ quest, objectives: active.objectives });
      }
    }
    return result;
  }

  // 检查哪个任务可以开始
  getAvailableQuests(): QuestData[] {
    const available = [];
    for (const [, quest] of Object.entries(QUESTS)) {
      if (this.getStatus(quest.id) === 'not_started') {
        let canStart = true;
        for (const req of quest.prerequisites) {
          if (req.type === 'quest' && !this.completedQuests.has(req.target)) {
            canStart = false;
            break;
          }
          if (req.type === 'flag' && !this.flags.has(req.target)) {
            canStart = false;
            break;
          }
        }
        if (canStart) available.push(quest);
      }
    }
    return available;
  }

  // ========== 序列化 ==========

  toJSON(): { activeQuests: { questId: string; objectives: QuestObjective[] }[]; completedQuests: string[] } {
    return {
      activeQuests: Array.from(this.activeQuests.values()).map(q => ({
        questId: q.questId,
        objectives: q.objectives,
      })),
      completedQuests: Array.from(this.completedQuests),
    };
  }

  fromJSON(data: { activeQuests: { questId: string; objectives: QuestObjective[] }[]; completedQuests: string[] }): void {
    this.activeQuests.clear();
    for (const q of data.activeQuests) {
      this.activeQuests.set(q.questId, { questId: q.questId, objectives: q.objectives });
    }
    this.completedQuests = new Set(data.completedQuests);
  }
}
