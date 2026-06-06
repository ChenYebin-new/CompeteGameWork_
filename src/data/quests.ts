// ============================================================
// 余晖谷 Embervale - 第一章任务数据
// ============================================================

import type { QuestData } from '../types';
import { Season } from '../types';

export const QUESTS: Record<string, QuestData> = {

  // =====================
  // 主线任务链
  // =====================

  // 任务1: 农耕教学
  q_tutorial_farming: {
    id: 'q_tutorial_farming',
    name: '继承的晨曦农场',
    description: '在老汤姆的指导下学会农耕基础：锄地、播种和浇水。',
    giverNPC: 'old_tom',
    prerequisites: [],
    objectives: [
      { type: 'collect', target: 'hoe', count: 1, current: 0, description: '获得锄头' },
      { type: 'collect', target: 'seed_parsnip', count: 3, current: 0, description: '获得防风草种子（3粒）' },
      { type: 'plant', target: 'parsnip', count: 3, current: 0, description: '播种防风草（3块地）' },
      { type: 'harvest', target: 'parsnip', count: 3, current: 0, description: '收获防风草（3棵）' },
    ],
    rewards: [
      { type: 'gold', target: '', amount: 100 },
      { type: 'item', target: 'seed_parsnip', amount: 5 },
    ],
    category: 'main',
  },

  // 任务2: 探索地下室
  q_explore_basement: {
    id: 'q_explore_basement',
    name: '祖父的遗产',
    description: '老汤姆提到晨曦农场下方有一个地下室。去那里看看外祖父留下了什么。',
    giverNPC: 'old_tom',
    prerequisites: [
      { type: 'quest', target: 'q_tutorial_farming' },
    ],
    objectives: [
      { type: 'visit', target: 'farm_basement', count: 1, current: 0, description: '进入农场地下室' },
      { type: 'collect', target: 'family_emblem', count: 1, current: 0, description: '找到丰收使族徽章' },
    ],
    rewards: [
      { type: 'item', target: 'family_emblem', amount: 1 },
      { type: 'unlock', target: 'basement_access', amount: 1 },
    ],
    category: 'main',
  },

  // 任务3: 探索幽光森林
  q_explore_forest: {
    id: 'q_explore_forest',
    name: '幽光森林的秘密',
    description: '老汤姆说如果徽章发光了，就应该去幽光森林深处。探索幽光森林，寻找徽章发光的源头。',
    giverNPC: 'old_tom',
    prerequisites: [
      { type: 'quest', target: 'q_explore_basement' },
    ],
    objectives: [
      { type: 'visit', target: 'glow_forest_entrance', count: 1, current: 0, description: '进入幽光森林' },
      { type: 'visit', target: 'hollow_oak', count: 1, current: 0, description: '找到森林深处的空心橡树' },
    ],
    rewards: [
      { type: 'gold', target: '', amount: 200 },
      { type: 'unlock', target: 'forest_access', amount: 1 },
    ],
    category: 'main',
  },

  // 任务4: 莹族试炼
  q_luna_trial: {
    id: 'q_luna_trial',
    name: '荧族试炼',
    description: '露娜邀请你触碰荧族记忆光点。触碰三个光点，了解丰收使族和荧族的真实历史，赢得露娜的信任。',
    giverNPC: 'luna',
    prerequisites: [
      { type: 'quest', target: 'q_explore_forest' },
    ],
    objectives: [
      { type: 'collect', target: 'memory_shard_1', count: 1, current: 0, description: '触碰第一个记忆光点（丰收使族起源）' },
      { type: 'collect', target: 'memory_shard_2', count: 1, current: 0, description: '触碰第二个记忆光点（大地之脉诞生）' },
      { type: 'collect', target: 'memory_shard_3', count: 1, current: 0, description: '触碰第三个记忆光点（封印阵的代价）' },
    ],
    rewards: [
      { type: 'friendship', target: 'luna', amount: 50 },
      { type: 'unlock', target: 'leyline_access', amount: 1 },
    ],
    category: 'main',
  },

  // 任务5: 唤醒大地之脉（第一章终章）
  q_awaken_leyline: {
    id: 'q_awaken_leyline',
    name: '唤醒大地之脉',
    description: '露娜告诉你唤醒大地之脉需要两样东西：丰收使族后人的血液，和荧族的眼泪。在古井旁进行唤醒仪式。',
    giverNPC: 'luna',
    prerequisites: [
      { type: 'quest', target: 'q_luna_trial' },
    ],
    objectives: [
      { type: 'visit', target: 'farm_well', count: 1, current: 0, description: '前往农场古井' },
      { type: 'collect', target: 'blood_drop', count: 1, current: 0, description: '滴入丰收使族后人的血液' },
      { type: 'collect', target: 'luna_tear', count: 1, current: 0, description: '露娜滴入荧族之泪' },
    ],
    rewards: [
      { type: 'gold', target: '', amount: 500 },
      { type: 'friendship', target: 'luna', amount: 30 },
      { type: 'friendship', target: 'old_tom', amount: 20 },
      { type: 'unlock', target: 'star_ruins', amount: 1 },
    ],
    category: 'main',
    nextQuestId: 'q_chapter_two_start',
  },

  // =====================
  // 支线任务链
  // =====================

  // 莉莉支线1: 古文献整理
  q_lily_archive: {
    id: 'q_lily_archive',
    name: '尘封的古文献',
    description: '莉莉需要你帮忙整理那柜丰收使族文献。找到3份丢失的残页，帮助她还原文献全貌。',
    giverNPC: 'lily',
    prerequisites: [
      { type: 'quest', target: 'q_explore_basement' },
    ],
    objectives: [
      { type: 'collect', target: 'archived_page_1', count: 1, current: 0, description: '找到残页一（图书馆角落）' },
      { type: 'collect', target: 'archived_page_2', count: 1, current: 0, description: '找到残页二（教堂地下室——需要塞巴斯蒂安协助）' },
      { type: 'collect', target: 'archived_page_3', count: 1, current: 0, description: '找到残页三（哈娜的旧账本夹页中）' },
    ],
    rewards: [
      { type: 'gold', target: '', amount: 300 },
      { type: 'friendship', target: 'lily', amount: 40 },
      { type: 'unlock', target: 'starpath_revealed', amount: 1 },
    ],
    category: 'side',
  },

  // 莉莉支线2: 星图复原
  q_lily_starpath: {
    id: 'q_lily_starpath',
    name: '星图复原',
    description: '古代文献中藏着通往大地之脉的星图。莉莉需要一些特殊材料来激活显影药水。',
    giverNPC: 'lily',
    prerequisites: [
      { type: 'quest', target: 'q_lily_archive' },
    ],
    objectives: [
      { type: 'collect', target: 'starberry', count: 3, current: 0, description: '收集星辉莓（3个）' },
      { type: 'collect', target: 'stone', count: 10, current: 0, description: '收集月光石粉（石头x10研磨）' },
      { type: 'talk', target: 'luna', count: 1, current: 0, description: '向露娜询问星图标记的含义' },
    ],
    rewards: [
      { type: 'gold', target: '', amount: 500 },
      { type: 'unlock', target: 'starpath_map', amount: 1 },
      { type: 'friendship', target: 'lily', amount: 40 },
    ],
    category: 'side',
  },

  // 汉克支线1: 符文工具
  q_hank_tool: {
    id: 'q_hank_tool',
    name: '沉封的铁匠铺',
    description: '汉克的地下室藏着父亲的符文工具。帮助他打开封存的木箱，理解那些古老工具的真正用途。',
    giverNPC: 'hank',
    prerequisites: [
      { type: 'friendship', target: 'hank', value: 100 },
    ],
    objectives: [
      { type: 'collect', target: 'stone', count: 20, current: 0, description: '收集铁矿石（石头x20）' },
      { type: 'collect', target: 'wood', count: 10, current: 0, description: '收集黑炭木（木材x10）' },
      { type: 'talk', target: 'old_tom', count: 1, current: 0, description: '向老汤姆询问符文工具的来历' },
    ],
    rewards: [
      { type: 'item', target: 'upgraded_hoe', amount: 1 },
      { type: 'friendship', target: 'hank', amount: 40 },
      { type: 'unlock', target: 'rune_forge', amount: 1 },
    ],
    category: 'side',
  },

  // 汉克支线2: 星辉锻造
  q_hank_forge: {
    id: 'q_hank_forge',
    name: '星辉锻造',
    description: '汉克终于愿意尝试用星辉火种点亮符文铁锤。收集特殊材料，完成一次神圣的锻造仪式。',
    giverNPC: 'hank',
    prerequisites: [
      { type: 'quest', target: 'q_hank_tool' },
      { type: 'quest', target: 'q_awaken_leyline' },
    ],
    objectives: [
      { type: 'collect', target: 'starberry', count: 5, current: 0, description: '收集星辉莓（5个）——提取星辉精华' },
      { type: 'collect', target: 'stone', count: 50, current: 0, description: '收集秘银矿石（石头x50熔炼）' },
      { type: 'visit', target: 'leyline_well', count: 1, current: 0, description: '在大地之脉旁点燃星辉火种' },
    ],
    rewards: [
      { type: 'item', target: 'starforged_hammer', amount: 1 },
      { type: 'unlock', target: 'legendary_tools', amount: 1 },
      { type: 'friendship', target: 'hank', amount: 50 },
    ],
    category: 'side',
  },

  // 艾琳支线1: 父亲的真相
  q_erin_father: {
    id: 'q_erin_father',
    name: '坠落的真相',
    description: '艾琳怀疑父亲在隘口的"意外"并非意外。帮助她调查隘口的线索，寻找父亲死亡的原因。',
    giverNPC: 'erin',
    prerequisites: [
      { type: 'friendship', target: 'erin', value: 100 },
    ],
    objectives: [
      { type: 'visit', target: 'valley_pass', count: 1, current: 0, description: '前往山谷隘口调查' },
      { type: 'collect', target: 'cipher_tube', count: 1, current: 0, description: '找到父亲的密码筒' },
      { type: 'talk', target: 'hana', count: 1, current: 0, description: '向哈娜打听信鸽的下落' },
    ],
    rewards: [
      { type: 'gold', target: '', amount: 400 },
      { type: 'friendship', target: 'erin', amount: 40 },
      { type: 'unlock', target: 'valley_pass_access', amount: 1 },
    ],
    category: 'side',
  },

  // 艾琳支线2: 揭露柳明
  q_erin_expose: {
    id: 'q_erin_expose',
    name: '镇长的秘密',
    description: '证据表明柳明与父亲之死和星辉之疫都有关系。收集足够证据，在镇民面前揭露柳明的真相。',
    giverNPC: 'erin',
    prerequisites: [
      { type: 'quest', target: 'q_erin_father' },
      { type: 'quest', target: 'q_sebastian_letter' },
    ],
    objectives: [
      { type: 'collect', target: 'evidence_a', count: 1, current: 0, description: '收集证据A：柳明寄往铁冠城的信件' },
      { type: 'collect', target: 'evidence_b', count: 1, current: 0, description: '收集证据B：哈娜关于柳明的账本记录' },
      { type: 'collect', target: 'evidence_c', count: 1, current: 0, description: '收集证据C：影子的"大地汲取器"调查报告' },
      { type: 'talk', target: 'old_tom', count: 1, current: 0, description: '召集全镇居民到广场' },
    ],
    rewards: [
      { type: 'gold', target: '', amount: 1000 },
      { type: 'friendship', target: 'erin', amount: 50 },
      { type: 'friendship', target: 'sebastian', amount: 30 },
      { type: 'unlock', target: 'town_justice', amount: 1 },
    ],
    category: 'side',
  },

  // 塞巴斯蒂安支线1: 父亲的来信
  q_sebastian_letter: {
    id: 'q_sebastian_letter',
    name: '禁忌的信封',
    description: '塞巴斯蒂安发现了父亲留给柳明的信。但信被撕去了末尾。帮助他找到信的残页，还原真相。',
    giverNPC: 'sebastian',
    prerequisites: [
      { type: 'friendship', target: 'sebastian', value: 100 },
    ],
    objectives: [
      { type: 'talk', target: 'hana', count: 1, current: 0, description: '向哈娜询问当年教堂的文书记录' },
      { type: 'collect', target: 'letter_fragment', count: 1, current: 0, description: '在教堂地下更深层找到被撕下的信尾' },
      { type: 'talk', target: 'lily', count: 1, current: 0, description: '让莉莉帮忙解析信的加密内容' },
    ],
    rewards: [
      { type: 'gold', target: '', amount: 300 },
      { type: 'friendship', target: 'sebastian', amount: 40 },
      { type: 'unlock', target: 'liuming_evidence', amount: 1 },
    ],
    category: 'side',
  },

  // 哈娜支线1: 交给后人的钥匙
  q_hana_key: {
    id: 'q_hana_key',
    name: '侍女与钥匙',
    description: '哈娜保管着安德烈亚斯留给后人的铜钥匙。但她需要确认你是否真的准备好了——用行动证明你对她三十年账本价值的重视。',
    giverNPC: 'hana',
    prerequisites: [
      { type: 'friendship', target: 'hana', value: 100 },
    ],
    objectives: [
      { type: 'collect', target: 'parsnip', count: 10, current: 0, description: '收获防风草（10棵）——证明你的耕种能力' },
      { type: 'collect', target: 'tomato', count: 10, current: 0, description: '收获番茄（10棵）——证明你的坚持' },
      { type: 'collect', target: 'starberry', count: 3, current: 0, description: '收获星辉莓（3棵）——证明你与山谷的联结' },
    ],
    rewards: [
      { type: 'item', target: 'hana_copper_key', amount: 1 },
      { type: 'friendship', target: 'hana', amount: 50 },
      { type: 'unlock', target: 'andrreas_chest', amount: 1 },
    ],
    category: 'side',
  },

  // 影子支线1: 汲取器的源头
  q_shadow_origin: {
    id: 'q_shadow_origin',
    name: '半生追猎',
    description: '影子追踪"大地汲取器"的制作者已经三十年。他需要你帮忙触摸工业城市的脉搏，最终找到幕后主使。',
    giverNPC: 'shadow',
    prerequisites: [
      { type: 'friendship', target: 'shadow', value: 150 },
    ],
    objectives: [
      { type: 'collect', target: 'stone', count: 30, current: 0, description: '收集矿石样品（石头x30）——影子需对比矿脉成分' },
      { type: 'collect', target: 'starberry', count: 5, current: 0, description: '收集星辉莓（5棵）——作为对抗汲取器的能量样品' },
      { type: 'talk', target: 'hank', count: 1, current: 0, description: '请汉克帮忙测定矿石的异常成分' },
    ],
    rewards: [
      { type: 'gold', target: '', amount: 800 },
      { type: 'friendship', target: 'shadow', amount: 40 },
      { type: 'unlock', target: 'origin_trail', amount: 1 },
    ],
    category: 'side',
  },
};
