// ============================================================
// 余晖谷 Embervale - 通用工具函数
// ============================================================

import { TILE_SIZE } from '../config/game';
import type { TilePosition, WorldPosition } from '../types';

/** 世界坐标 → 瓦片坐标 */
export function worldToTile(worldX: number, worldY: number): TilePosition {
  return {
    tileX: Math.floor(worldX / TILE_SIZE),
    tileY: Math.floor(worldY / TILE_SIZE),
  };
}

/** 瓦片坐标 → 世界坐标（瓦片中心） */
export function tileToWorld(tileX: number, tileY: number): WorldPosition {
  return {
    x: tileX * TILE_SIZE + TILE_SIZE / 2,
    y: tileY * TILE_SIZE + TILE_SIZE / 2,
  };
}

/** 生成瓦片唯一键 */
export function tileKey(tileX: number, tileY: number): string {
  return `${tileX},${tileY}`;
}

/** 解析瓦片唯一键 */
export function parseTileKey(key: string): TilePosition {
  const [x, y] = key.split(',').map(Number);
  return { tileX: x, tileY: y };
}

/** 限制数值范围 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** 线性插值 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** 曼哈顿距离（瓦片） */
export function manhattanDistance(a: TilePosition, b: TilePosition): number {
  return Math.abs(a.tileX - b.tileX) + Math.abs(a.tileY - b.tileY);
}

/** 格式化游戏时间 */
export function formatGameTime(hour: number, minute: number): string {
  const displayHour = hour <= 24 ? hour : hour - 24;
  const period = hour < 12 ? 'AM' : hour < 24 ? 'PM' : 'AM';
  const h = String(displayHour === 0 ? 12 : displayHour).padStart(2, '0');
  const m = String(minute).padStart(2, '0');
  return `${h}:${m} ${period}`;
}

/** 随机整数 [min, max] */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 数组随机取一个 */
export function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** 深拷贝 JSON 安全对象 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
