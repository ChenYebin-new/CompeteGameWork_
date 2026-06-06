// ============================================================
// 余晖谷 Embervale - 章节剧情脚本
// ============================================================

import { Season } from '../types';

/**
 * 剧情事件定义
 * 每个事件对应游戏中的一个关键剧情节点
 */
export interface StoryEvent {
  id: string;
  chapter: number;
  title: string;
  description: string;
  trigger: StoryTrigger;
  dialogueStartNode: string;    // 对应 dialogue.ts 中的对话节点
  order: number;                // 在同一章节中的顺序
  requiredEvents: string[];     // 前置剧情事件
  completionFlags: string[];    // 完成后设置的flag
  rewards?: StoryReward[];
}

export interface StoryTrigger {
  type: 'time' | 'location' | 'quest' | 'flag' | 'item';
  value?: string;
  season?: Season;
  dayRange?: { min: number; max: number };
  hourRange?: { min: number; max: number };
}

export interface StoryReward {
  type: 'gold' | 'item' | 'friendship' | 'flag' | 'cutscene';
  target: string;
  amount: number;
}

// ============================================================
// 第一章 "归途" 完整剧情线
// ============================================================

export const CHAPTER_ONE = {
  title: '归途',
  description: '莱拉收到遗产信后回到余晖谷。在老汤姆的指导下学会农耕，结识全镇居民，在农场地下室发现丰收使族徽章，深入幽光森林见到荧族少女露娜，完成荧族试炼，最终在古井旁唤醒大地之脉。外祖父在封印阵中睁开眼睛。',
  theme: '归乡、传承、觉醒',
};

export const CHAPTER_ONE_EVENTS: StoryEvent[] = [

  // --- 序章：抵达 ---
  {
    id: 'evt_intro_train',
    chapter: 1,
    title: '末班列车',
    description: '莱拉乘坐最后一班列车从铁冠城前往余晖谷',
    trigger: { type: 'time', dayRange: { min: 1, max: 1 }, hourRange: { min: 6, max: 8 } },
    dialogueStartNode: 'intro_train',
    order: 1,
    requiredEvents: [],
    completionFlags: ['evt_intro_train_done'],
  },
  {
    id: 'evt_intro_arrival',
    chapter: 1,
    title: '抵达余晖谷',
    description: '莱拉抵达余晖谷小站，老汤姆迎接',
    trigger: { type: 'flag', value: 'evt_intro_train_done' },
    dialogueStartNode: 'intro_arrival',
    order: 2,
    requiredEvents: ['evt_intro_train'],
    completionFlags: ['evt_intro_arrival_done'],
  },

  // --- 第一幕：初识与教学 ---
  {
    id: 'evt_meet_tom',
    chapter: 1,
    title: '守夜人',
    description: '初次见到老汤姆，了解到外祖父的一些往事',
    trigger: { type: 'flag', value: 'evt_intro_arrival_done' },
    dialogueStartNode: 'meet_old_tom',
    order: 3,
    requiredEvents: ['evt_intro_arrival'],
    completionFlags: ['met_old_tom', 'first_day_start'],
    rewards: [{ type: 'friendship', target: 'old_tom', amount: 20 }],
  },
  {
    id: 'evt_farm_tutorial',
    chapter: 1,
    title: '农耕启蒙',
    description: '老汤姆教莱拉耕地、播种、浇水的基础知识',
    trigger: { type: 'time', dayRange: { min: 2, max: 3 }, hourRange: { min: 6, max: 10 } },
    dialogueStartNode: 'tom_farming_lesson_1',
    order: 4,
    requiredEvents: ['evt_meet_tom'],
    completionFlags: ['farm_tutorial_done'],
    rewards: [
      { type: 'gold', target: '', amount: 100 },
      { type: 'item', target: 'seed_parsnip', amount: 5 },
    ],
  },

  // --- 第二幕：发现与探索 ---
  {
    id: 'evt_find_basement',
    chapter: 1,
    title: '尘封的地下室',
    description: '莱拉在农场主屋旧床下找到地下室入口并进入',
    trigger: { type: 'location', value: 'farm_house' },
    dialogueStartNode: 'basement_discovery',
    order: 5,
    requiredEvents: ['evt_farm_tutorial'],
    completionFlags: ['found_family_emblem', 'has_emblem'],
    rewards: [{ type: 'item', target: 'family_emblem', amount: 1 }],
  },
  {
    id: 'evt_tom_emblem',
    chapter: 1,
    title: '徽章的秘密',
    description: '老汤姆看到徽章，讲述它的来历和功能',
    trigger: { type: 'flag', value: 'found_family_emblem' },
    dialogueStartNode: 'tom_emblem_reaction',
    order: 6,
    requiredEvents: ['evt_find_basement'],
    completionFlags: ['emblem_explained'],
    rewards: [{ type: 'friendship', target: 'old_tom', amount: 25 }],
  },

  // --- 第三幕：结识居民 ---
  {
    id: 'evt_meet_lily',
    chapter: 1,
    title: '书海中的女孩',
    description: '在余晖镇图书馆认识管理员莉莉',
    trigger: { type: 'location', value: 'town_library' },
    dialogueStartNode: 'lily_first_meet',
    order: 7,
    requiredEvents: ['evt_tom_emblem'],
    completionFlags: ['met_lily'],
    rewards: [{ type: 'friendship', target: 'lily', amount: 5 }],
  },
  {
    id: 'evt_meet_hank',
    chapter: 1,
    title: '铁锤之歌',
    description: '在汉克铁匠铺买到第一把锄头',
    trigger: { type: 'location', value: 'hank_forge' },
    dialogueStartNode: 'hank_first_meet',
    order: 8,
    requiredEvents: ['evt_farm_tutorial'],
    completionFlags: ['met_hank'],
    rewards: [
      { type: 'friendship', target: 'hank', amount: 5 },
      { type: 'item', target: 'hoe', amount: 1 },
    ],
  },
  {
    id: 'evt_meet_erin',
    chapter: 1,
    title: '苹果酒与八卦',
    description: '在余晖客栈喝到第一杯免费的苹果酒，听艾琳讲山谷闲话',
    trigger: { type: 'location', value: 'erin_inn' },
    dialogueStartNode: 'erin_first_meet',
    order: 9,
    requiredEvents: ['evt_farm_tutorial'],
    completionFlags: ['met_erin'],
    rewards: [{ type: 'friendship', target: 'erin', amount: 10 }],
  },
  {
    id: 'evt_meet_sebastian',
    chapter: 1,
    title: '追光者的教堂',
    description: '走进余晖谷教堂，遇见内心矛盾的神父塞巴斯蒂安',
    trigger: { type: 'location', value: 'town_church' },
    dialogueStartNode: 'sebastian_first_meet',
    order: 10,
    requiredEvents: ['evt_farm_tutorial'],
    completionFlags: ['met_sebastian'],
    rewards: [{ type: 'friendship', target: 'sebastian', amount: 5 }],
  },
  {
    id: 'evt_meet_hana',
    chapter: 1,
    title: '百宝箱的女主人',
    description: '在哈娜的杂货店感受到家的温暖',
    trigger: { type: 'location', value: 'hana_shop' },
    dialogueStartNode: 'hana_first_meet',
    order: 11,
    requiredEvents: ['evt_farm_tutorial'],
    completionFlags: ['met_hana'],
    rewards: [{ type: 'friendship', target: 'hana', amount: 10 }],
  },
  {
    id: 'evt_meet_shadow',
    chapter: 1,
    title: '紫色帐篷下的秘密',
    description: '在旧水井旁遇见神秘商人"影子"',
    trigger: { type: 'time', dayRange: { min: 3, max: 10 }, hourRange: { min: 17, max: 21 } },
    dialogueStartNode: 'shadow_first_meet',
    order: 12,
    requiredEvents: ['evt_tom_emblem'],
    completionFlags: ['met_shadow', 'shadow_shop_opened'],
    rewards: [{ type: 'friendship', target: 'shadow', amount: 5 }],
  },

  // --- 第四幕：荧族与试炼 ---
  {
    id: 'evt_meet_luna',
    chapter: 1,
    title: '空心橡树中的少女',
    description: '深入幽光森林，在空心橡树中遇见荧族少女露娜',
    trigger: { type: 'location', value: 'hollow_oak' },
    dialogueStartNode: 'luna_first_meet',
    order: 13,
    requiredEvents: ['evt_meet_old_tom'],
    completionFlags: ['met_luna', 'luna_trial_ready'],
    rewards: [{ type: 'friendship', target: 'luna', amount: 25 }],
  },
  {
    id: 'evt_trial_memories',
    chapter: 1,
    title: '荧族试炼：三道光',
    description: '触碰三个荧族记忆光点，见证丰收使族与荧族的历史',
    trigger: { type: 'flag', value: 'luna_trial_ready' },
    dialogueStartNode: 'trial_memory_1',
    order: 14,
    requiredEvents: ['evt_meet_luna'],
    completionFlags: ['trial_all_complete', 'trial_done'],
    rewards: [
      { type: 'friendship', target: 'luna', amount: 30 },
      { type: 'cutscene', target: 'trial_complete', amount: 1 },
    ],
  },

  // --- 终章：觉醒 ---
  {
    id: 'evt_awaken_leyline',
    chapter: 1,
    title: '唤醒大地之脉',
    description: '在古井旁进行唤醒仪式：至亲之血与荧族之泪',
    trigger: { type: 'flag', value: 'trial_done' },
    dialogueStartNode: 'awakening_leyline',
    order: 15,
    requiredEvents: ['evt_trial_memories'],
    completionFlags: ['leyline_awakened', 'star_ruins_unlocked'],
    rewards: [
      { type: 'gold', target: '', amount: 500 },
      { type: 'friendship', target: 'luna', amount: 30 },
      { type: 'friendship', target: 'old_tom', amount: 20 },
      { type: 'cutscene', target: 'leyline_restored', amount: 1 },
    ],
  },
  {
    id: 'evt_chapter_one_end',
    chapter: 1,
    title: '归途·完',
    description: '大地之脉复苏的影响蔓延整个余晖谷。封印阵深处，安德烈亚斯睁开眼睛。',
    trigger: { type: 'flag', value: 'leyline_awakened' },
    dialogueStartNode: 'chapter_one_ending',
    order: 16,
    requiredEvents: ['evt_awaken_leyline'],
    completionFlags: ['chapter_one_done'],
    rewards: [
      { type: 'flag', target: 'chapter_one_completed', amount: 1 },
      { type: 'cutscene', target: 'chapter_one_credits', amount: 1 },
    ],
  },
];

// ============================================================
// 节日事件
// ============================================================

export const FESTIVAL_EVENTS = [
  {
    id: 'fest_spring_planting',
    name: '春之播种祭',
    season: Season.SPRING,
    day: 13,
    description: '全余晖谷的居民聚集在广场，一同播种希望之树。',
  },
  {
    id: 'fest_summer_fireworks',
    name: '夏之花火祭',
    season: Season.SUMMER,
    day: 20,
    description: '夜空中的烟火大会。可邀请一位好感度最高的NPC一起观赏。',
  },
  {
    id: 'fest_autumn_starlight',
    name: '秋之星辉夜',
    season: Season.AUTUMN,
    day: 28,
    description: '星辉雨降临之夜。解锁主线关键线索的最佳时间。',
  },
  {
    id: 'fest_winter_hearth',
    name: '冬之暖炉节',
    season: Season.WINTER,
    day: 15,
    description: '所有NPC聚在客栈围着暖炉讲故事。关键剧情线索在此揭示。',
  },
];
