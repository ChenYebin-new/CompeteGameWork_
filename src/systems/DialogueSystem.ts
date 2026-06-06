// ============================================================
// 余晖谷 Embervale - 对话系统引擎
// ============================================================

import { DIALOGUE_TREE } from '../data/dialogue';
import type { DialogueNode, DialogueCondition, DialogueChoice, DialogueAction } from '../types';
import type { FlagManager } from '../narrative/FlagManager';
import type { RelationshipManager } from '../narrative/RelationshipManager';
import type { QuestSystem } from './QuestSystem';
import type { Player } from '../entities/Player';

export interface DialogueState {
  currentNode: DialogueNode;
  npcId: string;
  choices: DialogueChoice[];
  isActive: boolean;
}

export class DialogueSystem {
  private flags: FlagManager;
  private relationships: RelationshipManager;
  private questSystem: QuestSystem;
  private player: Player;

  public state: DialogueState | null = null;

  constructor(
    flags: FlagManager,
    relationships: RelationshipManager,
    questSystem: QuestSystem,
    player: Player,
  ) {
    this.flags = flags;
    this.relationships = relationships;
    this.questSystem = questSystem;
    this.player = player;
  }

  // ========== 启动对话 ==========

  startDialogue(nodeId: string, npcId: string): DialogueNode | null {
    const node = this.resolveNode(nodeId);
    if (!node) return null;

    // 标记已见面
    this.relationships.setMet(npcId);

    // 评估选项
    const availableChoices = (node.choices ?? [])
      .filter(c => this.checkConditions(c.conditions));

    this.state = {
      currentNode: node,
      npcId,
      choices: availableChoices,
      isActive: true,
    };

    return node;
  }

  // ========== 选择选项 ==========

  selectChoice(choiceIndex: number): DialogueNode | null {
    if (!this.state || !this.state.isActive) return null;
    if (choiceIndex < 0 || choiceIndex >= this.state.choices.length) return null;

    const choice = this.state.choices[choiceIndex];

    // 执行选项动作
    this.executeActions(choice.actions);

    // 跳转到下一个节点
    const nextNode = this.resolveNode(choice.nextNodeId);
    if (!nextNode || nextNode.id === 'end_dialogue') {
      // 执行退出动作
      this.executeActions(this.state.currentNode.onExit);
      this.state.isActive = false;
      return null;
    }

    // 更新状态
    const availableChoices = (nextNode.choices ?? [])
      .filter(c => this.checkConditions(c.conditions));

    this.state.currentNode = nextNode;
    this.state.choices = availableChoices;

    return nextNode;
  }

  // ========== 自动推进（无选项时） ==========

  advanceDialogue(): DialogueNode | null {
    if (!this.state || !this.state.isActive) return null;

    const node = this.state.currentNode;

    if (node.choices && node.choices.length > 0) {
      // 有选项，等待玩家选择
      return node;
    }

    // 无选项，自动跳到下一个
    this.executeActions(node.onExit);

    if (!node.nextNodeId || node.nextNodeId === 'end_dialogue') {
      this.state.isActive = false;
      return null;
    }

    return this.startDialogue(node.nextNodeId, this.state.npcId);
  }

  // ========== 条件检查 ==========

  private checkConditions(conditions?: DialogueCondition[]): boolean {
    if (!conditions || conditions.length === 0) return true;

    for (const cond of conditions) {
      const passes = this.flags.checkCondition(cond.type, cond.key, cond.operator, cond.value);
      if (!passes) return false;
    }
    return true;
  }

  // ========== 动作执行 ==========

  private executeActions(actions?: DialogueAction[]): void {
    if (!actions) return;

    for (const action of actions) {
      switch (action.type) {
        case 'setFlag':
          this.flags.set(action.target, action.value ?? 1);
          break;
        case 'addFriendship':
          this.relationships.addFriendship(action.target, action.value as number ?? 0);
          break;
        case 'giveItem':
          this.player.addItem(action.target, (action.value as number) ?? 1);
          break;
        case 'startQuest':
          this.questSystem.startQuest(action.target);
          break;
        case 'completeQuest':
          this.questSystem.completeQuest(action.target);
          break;
      }
    }
  }

  // ========== 节点解析 ==========

  private resolveNode(nodeId: string): DialogueNode | null {
    return DIALOGUE_TREE[nodeId] ?? null;
  }

  // ========== 关闭 ==========

  endDialogue(): void {
    if (this.state) {
      this.executeActions(this.state.currentNode.onExit);
    }
    this.state = null;
  }
}
