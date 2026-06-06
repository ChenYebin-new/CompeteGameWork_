// ============================================================
// 余晖谷 Embervale - 好感度管理器
// ============================================================

import type { NPCRelationship } from '../types';

export class RelationshipManager {
  public relationships: Map<string, NPCRelationship> = new Map();

  // ========== 初始化NPC ==========

  initNPC(npcId: string): void {
    if (!this.relationships.has(npcId)) {
      this.relationships.set(npcId, {
        npcId,
        friendship: 0,
        heartLevel: 0,
        hasMet: false,
        giftsGivenThisWeek: 0,
      });
    }
  }

  // ========== 好感度操作 ==========

  addFriendship(npcId: string, amount: number): void {
    this.initNPC(npcId);
    const rel = this.relationships.get(npcId)!;
    rel.friendship = Math.min(1000, Math.max(0, rel.friendship + amount));
    rel.heartLevel = Math.floor(rel.friendship / 100);
  }

  getFriendship(npcId: string): number {
    return this.relationships.get(npcId)?.friendship ?? 0;
  }

  getHeartLevel(npcId: string): number {
    return this.relationships.get(npcId)?.heartLevel ?? 0;
  }

  setMet(npcId: string): void {
    this.initNPC(npcId);
    this.relationships.get(npcId)!.hasMet = true;
  }

  hasMet(npcId: string): boolean {
    return this.relationships.get(npcId)?.hasMet ?? false;
  }

  // ========== 每周礼物限制 ==========

  getGiftsRemaining(npcId: string): number {
    this.initNPC(npcId);
    const rel = this.relationships.get(npcId)!;
    return Math.max(0, 2 - rel.giftsGivenThisWeek);
  }

  giveGift(npcId: string): boolean {
    this.initNPC(npcId);
    const rel = this.relationships.get(npcId)!;
    if (rel.giftsGivenThisWeek >= 2) return false;
    rel.giftsGivenThisWeek += 1;
    return true;
  }

  // ========== 每周重置 ==========

  resetWeeklyGifts(): void {
    this.relationships.forEach(rel => {
      rel.giftsGivenThisWeek = 0;
    });
  }

  // ========== 序列化 ==========

  toJSON(): NPCRelationship[] {
    return Array.from(this.relationships.values()).map(r => ({ ...r }));
  }

  fromJSON(data: NPCRelationship[]): void {
    this.relationships.clear();
    for (const rel of data) {
      this.relationships.set(rel.npcId, { ...rel });
    }
  }
}
