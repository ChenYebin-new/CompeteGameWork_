// ============================================================
// 余晖谷 Embervale - 叙事树主控制器
// ============================================================

import type { DialogueNode } from '../types';
import { DialogueSystem } from '../systems/DialogueSystem';
import { FlagManager } from './FlagManager';
import { RelationshipManager } from './RelationshipManager';
import { QuestSystem } from '../systems/QuestSystem';
import type { Player } from '../entities/Player';

/**
 * NarrativeTree 是叙事系统的总入口
 * 协调 FlagManager + RelationshipManager + DialogueSystem + QuestSystem
 */
export class NarrativeTree {
  public flags: FlagManager;
  public relationships: RelationshipManager;
  public dialogue: DialogueSystem;
  public quests: QuestSystem;

  constructor(player: Player) {
    this.flags = new FlagManager();
    this.relationships = new RelationshipManager();
    this.quests = new QuestSystem(this.flags);
    this.dialogue = new DialogueSystem(
      this.flags,
      this.relationships,
      this.quests,
      player,
    );
  }

  // ========== NPC对话入口 ==========

  talkToNPC(npcId: string): DialogueNode | null {
    // 根据当前剧情状态决定启动哪个对话节点
    const startNode = this.getNPCStartNode(npcId);
    return this.dialogue.startDialogue(startNode, npcId);
  }

  private getNPCStartNode(npcId: string): string {
    // 根据剧情Flag决定对话起始节点
    switch (npcId) {
      case 'old_tom':
        if (this.flags.getBool('farm_tutorial_done')) return 'tom_tutorial_complete';
        if (this.flags.getBool('farm_tutorial_started')) return 'tom_after_planting';
        if (this.flags.getBool('met_old_tom')) return 'tom_farming_lesson_1';
        return 'meet_old_tom';

      case 'lily':
        if (this.flags.getBool('lily_archive_started')) return 'lily_agree';
        if (this.flags.getBool('met_lily')) return 'lily_first_meet';
        return 'lily_first_meet';

      case 'hank':
        if (this.flags.getBool('met_hank')) return 'hank_first_meet';
        return 'hank_first_meet';

      case 'erin':
        if (this.flags.getBool('met_erin')) return 'erin_first_meet';
        return 'erin_first_meet';

      case 'sebastian':
        if (this.flags.getBool('met_sebastian')) return 'sebastian_first_meet';
        return 'sebastian_first_meet';

      case 'hana':
        if (this.flags.getBool('met_hana')) return 'hana_first_meet';
        return 'hana_first_meet';

      case 'shadow':
        if (this.flags.getBool('met_shadow')) return 'shadow_first_meet';
        return 'shadow_first_meet';

      case 'luna':
        if (this.flags.getBool('trial_all_complete')) return 'luna_trial_complete';
        if (this.flags.getBool('met_luna')) return 'luna_confirm_kin';
        return 'luna_first_meet';

      default:
        return 'meet_old_tom';
    }
  }

  // ========== 剧情事件检查 ==========

  checkStoryEvent(): string | null {
    // 返回应该触发的对话节点ID（基于flag）
    if (!this.flags.has('met_old_tom')) return 'meet_old_tom';
    if (this.flags.getBool('found_family_emblem') && !this.flags.getBool('emblem_explained')) {
      return 'tom_emblem_reaction';
    }
    if (this.flags.getBool('leyline_awakened') && !this.flags.getBool('chapter_one_done')) {
      return 'chapter_one_ending';
    }
    return null;
  }

  // ========== 序列化 ==========

  toJSON() {
    return {
      flags: this.flags.toJSON(),
      relationships: this.relationships.toJSON(),
      quests: this.quests.toJSON(),
    };
  }

  fromJSON(data: {
    flags: Record<string, string | number | boolean>;
    relationships: import('../types').NPCRelationship[];
    quests: { activeQuests: { questId: string; objectives: import('../types').QuestObjective[] }[]; completedQuests: string[] };
  }): void {
    this.flags.fromJSON(data.flags);
    this.relationships.fromJSON(data.relationships);
    this.quests.fromJSON(data.quests);
  }
}
