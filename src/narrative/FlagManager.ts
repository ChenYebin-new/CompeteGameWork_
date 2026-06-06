// ============================================================
// 余晖谷 Embervale - 剧情标志管理器
// ============================================================

export class FlagManager {
  private flags: Map<string, string | number | boolean> = new Map();

  // ========== 设置 ==========

  set(key: string, value: string | number | boolean): void {
    this.flags.set(key, value);
  }

  get(key: string): string | number | boolean | undefined {
    return this.flags.get(key);
  }

  getString(key: string): string {
    const v = this.flags.get(key);
    return typeof v === 'string' ? v : '';
  }

  getNumber(key: string): number {
    const v = this.flags.get(key);
    return typeof v === 'number' ? v : 0;
  }

  getBool(key: string): boolean {
    const v = this.flags.get(key);
    return !!v;
  }

  has(key: string): boolean {
    return this.flags.has(key);
  }

  // ========== 条件检查 ==========

  checkCondition(type: string, key: string, operator: string, value: string | number): boolean {
    const flagValue = this.flags.get(key);

    switch (type) {
      case 'flag': {
        if (flagValue === undefined) return false;
        switch (operator) {
          case 'eq': return flagValue === value;
          case 'gte': return Number(flagValue) >= Number(value);
          case 'lte': return Number(flagValue) <= Number(value);
          case 'has': return !!flagValue;
          default: return false;
        }
      }
      case 'season':
        return flagValue === value;
      case 'hasItem':
        // 由InventorySystem处理
        return true;
      case 'questStatus':
        return flagValue === value;
      default:
        return false;
    }
  }

  // ========== 序列化 ==========

  toJSON(): Record<string, string | number | boolean> {
    const obj: Record<string, string | number | boolean> = {};
    this.flags.forEach((v, k) => { obj[k] = v; });
    return obj;
  }

  fromJSON(data: Record<string, string | number | boolean>): void {
    this.flags.clear();
    for (const [k, v] of Object.entries(data)) {
      this.flags.set(k, v);
    }
  }
}
