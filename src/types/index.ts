// ============================================================
// 余晖谷 Embervale - 全局类型定义
// ============================================================

// --- 基础枚举 ---

export enum Direction {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

export enum Season {
  SPRING = 'spring',
  SUMMER = 'summer',
  AUTUMN = 'autumn',
  WINTER = 'winter',
}

export enum Weather {
  SUNNY = 'sunny',
  RAINY = 'rainy',
  CLOUDY = 'cloudy',
  STORMY = 'stormy',
}

export enum CropStage {
  SEED = 0,
  SPROUT = 1,
  GROWING = 2,
  MATURE = 3,
  HARVESTABLE = 4,
}

export enum ItemCategory {
  SEED = 'seed',
  CROP = 'crop',
  TOOL = 'tool',
  MATERIAL = 'material',
  QUEST = 'quest',
  CONSUMABLE = 'consumable',
}

export enum ToolType {
  HOE = 'hoe',
  WATERING_CAN = 'watering_can',
  AXE = 'axe',
  PICKAXE = 'pickaxe',
  SCYTHE = 'scythe',
  SEED_BAG = 'seed_bag',
}

export enum SceneKey {
  BOOT = 'BootScene',
  MENU = 'MenuScene',
  GAME = 'GameScene',
}

// --- 坐标与地图 ---

export interface TilePosition {
  tileX: number;
  tileY: number;
}

export interface WorldPosition {
  x: number;
  y: number;
}

// --- 物品 ---

export interface ItemData {
  id: string;
  name: string;
  category: ItemCategory;
  description: string;
  sellPrice: number;
  buyPrice: number;
  stackable: boolean;
  maxStack: number;
  textureKey: string;
}

export interface InventorySlot {
  itemId: string;
  quantity: number;
}

// --- 作物 ---

export interface CropData {
  id: string;
  name: string;
  seedItemId: string;
  harvestItemId: string;
  growthDays: number;        // 每阶段生长天数
  totalStages: number;       // 总生长阶段数
  regrowDays: number;        // 0=一次性收获, >0=重生长天数
  seasons: Season[];         // 可种植季节
  waterNeeded: number;       // 每天需浇水次数
  texturePrefix: string;     // 纹理前缀
}

export interface PlantedCrop {
  cropId: string;
  currentStage: CropStage;
  daysInStage: number;
  wateredToday: boolean;
  quality: number;           // 0=普通, 1=银星, 2=金星
}

// --- 时间 ---

export interface GameTime {
  year: number;
  season: Season;
  day: number;
  hour: number;              // 6-26 (6AM-2AM)
  minute: number;
}

// --- 玩家 ---

export interface PlayerState {
  name: string;
  gold: number;
  stamina: number;
  maxStamina: number;
  currentTool: ToolType;
  inventory: InventorySlot[];
  inventorySize: number;
  position: WorldPosition;
  direction: Direction;
}

// --- NPC ---

export interface NPCData {
  id: string;
  name: string;
  role: string;
  spriteKey: string;
  portraitKey: string;
  schedule: NPCSchedule;
  birthday: { season: Season; day: number };
}

export interface NPCSchedule {
  [locationId: string]: {
    hour: number;
    minute: number;
    tileX: number;
    tileY: number;
  }[];
}

export interface NPCRelationship {
  npcId: string;
  friendship: number;        // 0-1000
  heartLevel: number;        // 0-10
  hasMet: boolean;
  giftsGivenThisWeek: number;
}

// --- 对话与叙事 ---

export interface DialogueNode {
  id: string;
  speakerId: string;
  text: string;
  conditions?: DialogueCondition[];
  choices?: DialogueChoice[];
  nextNodeId?: string;
  onExit?: DialogueAction[];
}

export interface DialogueCondition {
  type: 'flag' | 'friendship' | 'season' | 'hasItem' | 'questStatus';
  key: string;
  operator: 'eq' | 'gte' | 'lte' | 'has';
  value: string | number;
}

export interface DialogueChoice {
  text: string;
  nextNodeId: string;
  conditions?: DialogueCondition[];
  actions?: DialogueAction[];
}

export interface DialogueAction {
  type: 'setFlag' | 'addFriendship' | 'giveItem' | 'startQuest' | 'completeQuest';
  target: string;
  value?: number | string;
}

// --- 任务 ---

export type QuestStatus = 'not_started' | 'active' | 'completed' | 'failed';

export interface QuestData {
  id: string;
  name: string;
  description: string;
  giverNPC: string;
  prerequisites: QuestRequirement[];
  objectives: QuestObjective[];
  rewards: QuestReward[];
  nextQuestId?: string;
  category: 'main' | 'side';
}

export interface QuestRequirement {
  type: 'quest' | 'season' | 'friendship' | 'flag';
  target: string;
  value?: number;
}

export interface QuestObjective {
  type: 'collect' | 'deliver' | 'talk' | 'visit' | 'plant' | 'harvest';
  target: string;
  count: number;
  current: number;
  description: string;
}

export interface QuestReward {
  type: 'gold' | 'item' | 'friendship' | 'unlock';
  target: string;
  amount: number;
}

// --- 存档 ---

export interface SaveData {
  version: string;
  timestamp: number;
  slotName: string;
  player: PlayerState;
  time: GameTime;
  weather: Weather;
  plantedCrops: { [key: string]: PlantedCrop };  // "tileX,tileY" -> PlantedCrop
  relationships: NPCRelationship[];
  storyFlags: { [key: string]: string | number | boolean };
  activeQuests: { questId: string; objectives: QuestObjective[] }[];
  completedQuests: string[];
  farmLevel: number;
}

// --- 地图 ---

export interface MapLayer {
  data: number[][];           // 瓦片ID二维数组
  depth: number;              // 渲染深度
}

export interface GameMap {
  id: string;
  name: string;
  width: number;              // 瓦片宽
  height: number;             // 瓦片高
  layers: MapLayer[];
  collision: boolean[][];     // 碰撞二维数组
  transitions: MapTransition[];
  npcPositions: { npcId: string; tileX: number; tileY: number }[];
}

export interface MapTransition {
  fromTileX: number;
  fromTileY: number;
  toMapId: string;
  toTileX: number;
  toTileY: number;
}

// --- Phaser Scene 接口扩展 ---

declare module 'phaser' {
  interface Scene {
    gameState?: import('./index').SaveData;
  }
}
