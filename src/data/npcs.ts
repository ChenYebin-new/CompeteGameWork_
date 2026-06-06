// ============================================================
// 余晖谷 Embervale - NPC完整角色设定（阶段2：世界观剧本）
// ============================================================

import type { NPCData } from '../types';
import { Season } from '../types';

/**
 * NPC 性格/背景档案（供对话系统和叙事引擎读取）
 */
export interface NPCProfile {
  id: string;
  name: string;
  age: number;
  role: string;
  occupation: string;
  personality: string[];
  backstory: string;
  appearance: string;
  dailyGreeting: string;
  likes: string[];       // 喜欢的礼物itemId
  dislikes: string[];    // 讨厌的礼物
  heartEvents: NPCHeartEvent[];
  secrets: string[];     // 可解锁的秘密
  questLines: string[];  // 关联任务线id
}

export interface NPCHeartEvent {
  heartLevel: number;    // 触发所需心数
  location: string;      // 触发地点
  season?: Season;       // 触发季节（可选）
  time?: string;         // 触发时间段
  title: string;         // 事件标题
  description: string;   // 事件描述
}

// ============================================================
// 8位核心NPC完整档案
// ============================================================

export const NPC_PROFILES: Record<string, NPCProfile> = {

  // --- NPC #1: 老汤姆 ---
  old_tom: {
    id: 'old_tom',
    name: '老汤姆',
    age: 70,
    role: '新手引导者 / 祖父旧友',
    occupation: '退休农夫',
    personality: ['慈祥', '固执', '怀旧', '唠叨'],
    backstory: `老汤姆是余晖谷现存最年长的居民，也是唯一亲眼见证过"金色余晖"时代的活人。
三十年前，他是安德烈亚斯（玩家祖父）最信任的帮手，在晨曦农场帮忙打理星辉作物。
秋之契仪式那夜，他负责在农场外围守夜——却什么都没看见，只记得一阵刺眼金光过后，安德烈亚斯消失了。
这件事成为他一生的愧疚。他搬到了农场旁边的小木屋，拒绝离开山谷，固执地相信安德烈亚斯终会归来。
这三十年，他每天清晨都会站在农场门口，朝着山谷隘口的方向眺望，风雨无阻。`,
    appearance: '花白头发，微微驼背，穿褪色的棕色工作服，左手拄一根樱桃木拐杖',
    dailyGreeting: '早啊，孩子。今天的天色……和三十年前那天可真像。',
    likes: ['parsnip', 'potato', 'wood'],
    dislikes: ['starberry'],
    heartEvents: [
      {
        heartLevel: 1,
        location: '晨曦农场',
        title: '晨曦中的守夜人',
        description: '清晨六点，玩家发现老汤姆已经站在农场大门口。他讲起年轻时的农耕趣事，教玩家辨别三种土壤的方法。',
      },
      {
        heartLevel: 3,
        location: '老汤姆的小木屋',
        season: Season.AUTUMN,
        title: '秋之契的前夜',
        description: '秋分之夜前夕，老汤姆拿出压箱底的陈年果酒。酒过三巡，他终于含泪说出了三十年前那个夜晚他所记得的全部细节——包括一道不该出现在山谷中的奇怪影子。',
      },
      {
        heartLevel: 5,
        location: '余晖谷隘口',
        season: Season.AUTUMN,
        title: '最后一封家书',
        description: '老汤姆拿出一封从未寄出的信——安德烈亚斯失踪前三天写给他，信中隐晦提及"大地之脉的封印出现裂痕"，并嘱咐若自己有事，替他守护山谷。',
      },
      {
        heartLevel: 7,
        location: '星辉遗址',
        title: '归来者',
        description: '在星辉遗址深处，老汤姆用手杖敲击特定石砖，打开秘密通道。他承认自己并非普通的农夫——他曾是丰收使族最年轻的外围守护者。',
      },
    ],
    secrets: [
      '他曾是丰收使族外围守护者',
      '安德烈亚斯失踪前三天的信',
      '秋之契那夜他看到了第三个人影',
    ],
    questLines: ['q_old_tom_intro', 'q_old_tom_letter', 'q_old_tom_truth'],
  },

  // --- NPC #2: 莉莉 ---
  lily: {
    id: 'lily',
    name: '莉莉',
    age: 24,
    role: '知识向导 / 潜在恋爱对象',
    occupation: '余晖谷图书馆管理员',
    personality: ['沉静', '聪慧', '内向', '执着'],
    backstory: `莉莉来自铁冠城的学者世家，三年前志愿来到余晖谷管理几乎荒废的镇图书馆。
表面上是出于学术热情，实则是为了逃避家族给她安排的婚姻。
在整理旧藏书时，她发现了一整柜有关"丰收使族"的古代文献——其中不少被人刻意撕去了关键页。
她开始秘密研究这些残卷，越深入，越相信丰收使族的消失并非意外，而是一场阴谋。
她对外人戒备，但在书本的世界里却毫不设防。`,
    appearance: '深棕色长发，圆框眼镜，常穿深蓝色长裙搭配米色开衫，口袋总插着一支羽毛笔',
    dailyGreeting: '啊，是你。我在整理一些……旧东西。你想看看吗？',
    likes: ['starberry', 'tomato', 'fiber'],
    dislikes: ['stone'],
    heartEvents: [
      {
        heartLevel: 1,
        location: '余晖镇图书馆',
        title: '尘封的书柜',
        description: '莉莉展示了她发现的丰收使族文献柜。她兴奋地分享已经破译的内容——包括"星辉之疫"的官方记载与民间口述之间的巨大矛盾。',
      },
      {
        heartLevel: 3,
        location: '余晖镇图书馆',
        season: Season.WINTER,
        title: '被撕去的真相',
        description: '莉莉用特殊药水处理被撕毁的页面，显影出残留字迹。其中提及"封印需要至亲之血"，她担忧地看着玩家。',
      },
      {
        heartLevel: 5,
        location: '幽光森林',
        title: '荧族传说',
        description: '莉莉鼓起勇气跟随玩家进入幽光森林。当露娜出现时，莉莉激动得说不出话——她终于亲眼证实了自己三年的研究。',
      },
      {
        heartLevel: 7,
        location: '余晖谷图书馆',
        time: '深夜',
        title: '星图之下的告白',
        description: '莉莉在图书馆天台上铺开一张她复原的星图。星光映在她脸上，她坦白了自己逃避家族的原因，以及留在余晖谷的真正理由。',
      },
    ],
    secrets: [
      '她是逃婚来到余晖谷的',
      '丰收使族的文献被人为篡改过',
      '她复原了一份完整的星辉仪式流程图',
    ],
    questLines: ['q_lily_archive', 'q_lily_starpath', 'q_lily_truth'],
  },

  // --- NPC #3: 铁锤汉克 ---
  hank: {
    id: 'hank',
    name: '铁锤汉克',
    age: 45,
    role: '工具提供者 / 实用主义视角',
    occupation: '铁匠铺老板',
    personality: ['粗犷', '实在', '沉默', '可靠'],
    backstory: `汉克是余晖谷唯一的铁匠，他的家族为山谷打造农具已有三代。
他不是喜欢说话的人，但他的铁锤声是小镇每个清晨的背景音。
汉克对"传统魔法"和"丰收使族"这些话题不屑一顾——"锤子敲下去就能干活，讲那些虚的没用。"
然而他的铁匠铺地下，藏着一批无法用常规锻造工艺解释的工具——那是他父亲的遗物，每一件都刻着丰收使族的印记。
他不愿面对这些，却也无法丢弃。`,
    appearance: '魁梧身材，光头，络腮胡，永远系着皮围裙，手臂肌肉如铁块',
    dailyGreeting: '要修工具还是买新的？修的话放桌上，三天后取。',
    likes: ['stone', 'pickaxe', 'parsnip'],
    dislikes: ['fiber', 'starberry'],
    heartEvents: [
      {
        heartLevel: 1,
        location: '汉克铁匠铺',
        title: '打铁三下',
        description: '汉克让玩家体验打铁——三锤下去，锻出一把简易锄头。他嘴上说着"笨手笨脚"，眼神里却闪过一丝赞许。',
      },
      {
        heartLevel: 3,
        location: '汉克铁匠铺',
        season: Season.WINTER,
        title: '父亲的遗产',
        description: '寒冬某日，铁匠铺的火炉突然异常发光。汉克挖出地板下的木箱——里面是他父亲留下的、刻满符文的神秘工具。汉克第一次讲述了他的恐惧：他害怕这些"魔法玩意儿"害死了父亲。',
      },
      {
        heartLevel: 5,
        location: '矿洞入口',
        title: '钢铁之心',
        description: '汉克带玩家下矿，展示如何用丰收使族的工具开采特殊矿石。他承认自己一直在暗中学习这些工具的用法。',
      },
      {
        heartLevel: 7,
        location: '汉克铁匠铺',
        title: '新火传承',
        description: '汉克将父亲留下的符文铁锤重新点燃——不是用煤炭，而是用玩家从荧族带来的星辉火种。铁锤发出金色光芒，汉克终于与父亲的遗志和解。',
      },
    ],
    secrets: [
      '他父亲是因丰收使族工具而死的',
      '他私藏了一批符文工具',
      '他能用星辉火种锻造特殊装备',
    ],
    questLines: ['q_hank_tool', 'q_hank_legacy', 'q_hank_forge'],
  },

  // --- NPC #4: 艾琳 ---
  erin: {
    id: 'erin',
    name: '艾琳',
    age: 28,
    role: '情报源 / 支线任务分发者',
    occupation: '旅店"余晖客栈"店主',
    personality: ['开朗', '八卦', '精明', '义气'],
    backstory: `艾琳的旅店是余晖谷的信息中枢。每天傍晚，镇民们会聚在这里喝一杯、聊聊闲天。
艾琳的耳朵比任何人都灵——谁家作物好卖、谁又和谁闹矛盾、山上矿洞里发现了什么新东西……
她表面上是个爱八卦的旅店老板娘，实际上她利用这个身份在暗中保护山谷。
她的父亲曾是柳明镇长的副手，在一次去往铁冠城办事的途中"意外"坠崖身亡。
艾琳从不相信那是意外。她开的旅店，就是她搜集真相的前哨站。`,
    appearance: '红棕色卷发扎成马尾，小麦色皮肤，常穿橘色围裙配白衬衫，笑容永远挂在脸上',
    dailyGreeting: '欢迎光临！今天有新鲜出炉的蜂蜜面包，要不要来一份？哦对了，你听说了吗——',
    likes: ['potato', 'tomato', 'wood'],
    dislikes: ['stone'],
    heartEvents: [
      {
        heartLevel: 1,
        location: '余晖客栈',
        title: '八卦时间',
        description: '艾琳免费请玩家喝一杯苹果酒，同时分享最近的小镇八卦——谁家母鸡下了金蛋（假的）、谁和谁在河边约会、以及"镇长柳明最近往铁冠城寄了很多信"。',
      },
      {
        heartLevel: 3,
        location: '余晖客栈',
        season: Season.SUMMER,
        title: '父亲的故事',
        description: '夏夜打烊后，艾琳拿出父亲的照片。她讲述父亲是柳明的副手、以及那场"意外坠崖"的可疑之处。她请求玩家帮忙留意柳明的动向。',
      },
      {
        heartLevel: 5,
        location: '余晖谷隘口',
        title: '暗处的眼睛',
        description: '艾琳在隘口截住了正往铁冠城送信的信使——发现信使在帮柳明传递加密信件。艾琳让玩家选择：偷看信件内容还是放长线。',
      },
      {
        heartLevel: 7,
        location: '余晖客栈',
        time: '深夜',
        title: '真相之钥',
        description: '艾琳拿出父亲留下的钥匙，打开了旅店地下室最深处的一个保险箱。里面存放着父亲留下的完整调查记录——柳明与星辉之疫之间惊人的关联。',
      },
    ],
    secrets: [
      '她在暗中调查父亲死亡的真相',
      '柳明可能是父亲的凶手',
      '她的旅店地下室有完整的调查档案',
    ],
    questLines: ['q_erin_news', 'q_erin_father', 'q_erin_expose'],
  },

  // --- NPC #5: 神父塞巴斯蒂安 ---
  sebastian: {
    id: 'sebastian',
    name: '神父塞巴斯蒂安',
    age: 26,
    role: '道德困境 / 秘密守护者',
    occupation: '余晖谷教堂神父',
    personality: ['温和', '内疚', '虔诚', '躲闪'],
    backstory: `塞巴斯蒂安是铁冠城神学院最年轻的毕业生，三年前被派到余晖谷教堂任职。
他表面虔诚，内心的信仰却在动摇——因为他接手教堂时，在地下室发现了大量被封存的禁忌文献。
这些文献记录了丰收使族与"大地之脉"的秘密，与教会正统教义严重冲突。
更让他恐惧的是：文献末尾有一封信，署名是他失踪二十年的父亲，而收件人是——柳明。
他不敢把这些文献拿给任何人看，也不敢销毁它们。每个周日布道时，他在讲台上传播自己都不信的教义。
他的信仰、他的恐惧、他的秘密，像三块石头压在他的心上。`,
    appearance: '消瘦，深褐色短发，穿黑色神父袍，眼神总有些躲闪，但笑起来很温暖',
    dailyGreeting: '愿大地赐福于你……呃，我是说，愿光明指引你。你今天过得好吗？',
    likes: ['starberry', 'fiber', 'parsnip'],
    dislikes: ['stone'],
    heartEvents: [
      {
        heartLevel: 1,
        location: '余晖谷教堂',
        title: '追光者的疑惑',
        description: '某次弥撒后，塞巴斯蒂安不经意间说出"大地之脉"这个词，然后慌张改口。玩家追问时，他紧张地岔开话题并匆匆离开。',
      },
      {
        heartLevel: 3,
        location: '余晖谷教堂',
        season: Season.WINTER,
        title: '信仰的裂缝',
        description: '冬日深夜，教堂的钟声无故响起。玩家赶到，发现塞巴斯蒂安独自跪在祭坛前，手中拿着封存的文献，眼中含泪。他坦白了自己的发现和恐惧。',
      },
      {
        heartLevel: 5,
        location: '余晖谷教堂',
        title: '父亲的来信',
        description: '塞巴斯蒂安终于打开了父亲写给柳明的信。信中描述了二十年前星辉之疫的"另一种解释"——不是天灾，是人为激活封印阵的副作用。',
      },
      {
        heartLevel: 7,
        location: '余晖谷教堂',
        title: '新信仰',
        description: '塞巴斯蒂安决定把禁忌文献公之于众，重建对"大地之脉"的信仰——一种更古老、更真实、与丰收使族共存的信仰。他脱下神父袍，将文献交到玩家手中。',
      },
    ],
    secrets: [
      '他持有丰收使族禁忌文献',
      '他的父亲与柳明有关联',
      '星辉之疫可能是人为事故',
    ],
    questLines: ['q_sebastian_doubt', 'q_sebastian_letter', 'q_sebastian_truth'],
  },

  // --- NPC #6: 哈娜大婶 ---
  hana: {
    id: 'hana',
    name: '哈娜大婶',
    age: 55,
    role: '物资供应 / 历史见证者',
    occupation: '杂货店"哈娜的百宝箱"店主',
    personality: ['温暖', '精明', '唠叨', '坚韧'],
    backstory: `哈娜大婶从十六岁起就在丰收使族当侍女，负责照顾安德烈亚斯的起居和仪式筹备。
她亲身参与了生命中每一次"秋之契"仪式的筹备工作——直到最后一次，安德烈亚斯在仪式前夜让她"离开山谷，不要再回来"。
她没有离开。她躲在山谷角落的猎户小屋，见证了那夜的刺眼金光。
三十年来，她守着自己的杂货店，事无巨细地记下了余晖谷的每一天——天气、作物收成、来往旅人。
她的账本，才是余晖谷最完整的历史档案。
她是唯一知道村民全部秘密的人，但她从不主动开口。`,
    appearance: '微胖慈祥，银灰发髻，穿碎花围裙，脖子上挂着一枚旧铜钥匙',
    dailyGreeting: '哟，来了来了！看看今天我进了什么好货——啊对了，你外婆最爱的酸梅酱配方你要不要？',
    likes: ['parsnip', 'potato', 'tomato', 'fiber'],
    dislikes: ['starberry'], // 让她想起痛苦的回忆
    heartEvents: [
      {
        heartLevel: 1,
        location: '哈娜的百宝箱',
        title: '账本第一页',
        description: '哈娜不小心翻出了三十年前的账本第一页。她迅速合上，干笑两声。但玩家瞥见上面写着"秋之契——安德烈亚斯大人收农作物200捆。"',
      },
      {
        heartLevel: 3,
        location: '哈娜的百宝箱',
        season: Season.AUTUMN,
        title: '那夜的口述',
        description: '秋之契纪念日前夕，哈娜关起店门。她给玩家沏了一壶茶，用沙哑的声音讲述那夜她看到的：不止一道金光，还有第二道——从山谷隘口外面射来的暗紫色光柱，两道光碰撞后，安德烈亚斯消失了。',
      },
      {
        heartLevel: 5,
        location: '猎户小屋',
        title: '完整的账本',
        description: '哈娜带玩家到她藏了三十年的猎户小屋，掏出30本完整的账本。每一页都是山谷的历史——还有柳明所有可疑行为的记录。',
      },
      {
        heartLevel: 7,
        location: '哈娜的百宝箱',
        title: '继承',
        description: '哈娜解下脖子上的铜钥匙交给玩家："这是安德烈亚斯大人仪式前夜交给我的。他说……这把钥匙开的东西，只给他的后人。"',
      },
    ],
    secrets: [
      '她曾是丰收使族的侍女',
      '她知道秋之契仪式全部细节',
      '她持有安德烈亚斯的铜钥匙',
      '她有30年的完整账本记录',
    ],
    questLines: ['q_hana_ledger', 'q_hana_key', 'q_hana_witness'],
  },

  // --- NPC #7: 影子 ---
  shadow: {
    id: 'shadow',
    name: '影子',
    age: -1, // 身份不明
    role: '神秘商人 / 稀有物资来源',
    occupation: '流浪商人',
    personality: ['神秘', '犀利', '幽默', '可靠（但对价格绝对不手软）'],
    backstory: `没人知道"影子"的真名、年龄、或从哪里来。他每两周的星期四黄昏准时出现在余晖谷广场的旧水井旁，
支起他的深紫色帐篷，售卖各种"外面世界"的稀奇物品——种子、魔法卷轴、旧书、甚至某些禁药原料。
他只收金币，从不讨价还价。他的声音不男不女、不老不少，像是用烟熏过的丝绸。
但有一件事很奇怪：每当他拿出星辉莓种子时，他手上的一个黑色手环会发出微弱的金色光芒——
和丰收使族的印记一模一样。`,
    appearance: '总是戴兜帽，看不清面容，穿深紫色长袍，左手戴着黑色手环（内侧有丰收使族印记）',
    dailyGreeting: '欢迎，欢迎。看看这次我给你带来了什么好东西……嗯，你的眼神告诉我，你最近在找某样东西。',
    likes: ['starberry', 'stone'],
    dislikes: [],
    heartEvents: [
      {
        heartLevel: 1,
        location: '旧水井旁（他的帐篷）',
        title: '手环的微光',
        description: '玩家走近帐篷时，影子正在整理货物。他的左手手环突然发出金光——和丰收使族徽章的图案完全一致。影子迅速用袖子盖住它。',
      },
      {
        heartLevel: 3,
        location: '旧水井旁',
        season: Season.AUTUMN,
        title: '影子的故事（一）',
        description: '秋分夜，影子的帐篷没有按时出现。玩家在幽光森林边缘找到了他——独自站在一棵枯死的老橡树下。他说："这棵树，是我父亲种下的。"然后就沉默了。',
      },
      {
        heartLevel: 5,
        location: '旧水井旁',
        title: '影子的故事（二）',
        description: '影子终于摘下了兜帽——他看起来约四十岁，但眼睛是浅金色的。"我父亲是安德烈亚斯的兄长。按辈分……我是你的叔叔。但我不能留在山谷里，因为我沾了'外面'的东西。"',
      },
      {
        heartLevel: 7,
        location: '星辉遗址',
        title: '暗紫之光的源头',
        description: '影子带玩家进入星辉遗址最深处，指出了三十年前那夜暗紫色光柱的来源——一个仍在缓慢运转的古老机械装置。这是"外面世界"的东西，有人把它带进了山谷。',
      },
    ],
    secrets: [
      '他是安德烈亚斯兄长的儿子，玩家的叔叔',
      '他的手环是丰收使族的信物',
      '他知道暗紫光柱的来源——一个外来机械装置',
      '他被迫离开山谷，成为了流浪商人',
    ],
    questLines: ['q_shadow_ring', 'q_shadow_origin', 'q_shadow_truth'],
  },

  // --- NPC #8: 露娜 ---
  luna: {
    id: 'luna',
    name: '露娜',
    age: -1, // 外表12岁，实际年龄不可计算
    role: '荧族化身 / 大地之脉的守护灵',
    occupation: '无（精灵）',
    personality: ['天真', '好奇', '古老', '顽皮'],
    backstory: `露娜是"荧族"——大地之脉自然孕育的精灵族——的最后一个幸存者。
在人类语言中，她的名字意为"月光"，但荧族没有月亮的意象——他们生活在永恒的金色黄昏中。
三十年前星辉之疫发作时，荧族全体化作封印阵的能量，封锁了疫病源头。只有最小的露娜因为太年幼，被族人藏在幽光森林最深处的一棵空心橡树中。
三百年来她第一次见到人类时，她并不害怕——因为她能"看见"玩家血脉中的金色光芒。
她不太会说人类语言，但她的心声会直接传入玩家的脑海。
她知道的秘密比任何人都多——但她自己并不知道那些意味着什么。她需要玩家来帮她"翻译"这些记忆。`,
    appearance: '约12岁人类女孩外表，浅金色长发垂到腰际，眼睛是翠绿色的，瞳孔是花朵形状，穿着由发光藤蔓编织的连衣裙，赤脚，脚踝上有淡金色的环形印记',
    dailyGreeting: '（一道清澈的心声传入你脑海）你来了！我今天发现了一只会发光的蜗牛，你要看吗？',
    likes: ['starberry', 'tomato', 'fiber'],
    dislikes: ['stone'],
    heartEvents: [
      {
        heartLevel: 1,
        location: '幽光森林',
        title: '荧族初见',
        description: '玩家第一次在森林深处的空心橡树中看到露娜。她正在和一只萤火虫对话——不，她在教萤火虫说话。发现玩家后，她没有逃跑，而是歪头说了一句心声："你的光……和妈妈一样。"',
      },
      {
        heartLevel: 3,
        location: '幽光森林',
        title: '荧族试炼',
        description: '露娜带玩家进入荧族的"记忆洞窟"——一个充满金色光点的地下溶洞。每个光点是一段荧族记忆。她让玩家触碰三个光点：丰收使族的起源、大地之脉的诞生、以及……封印阵的代价。',
      },
      {
        heartLevel: 5,
        location: '星辉遗址',
        title: '封印的记忆',
        description: '露娜终于鼓起勇气触碰了自己最恐惧的记忆光点——她看到了族人化作封印阵的那一刻。她第一次哭了出来："他们……在叫我的名字。让我好好活着。"',
      },
      {
        heartLevel: 7,
        location: '大地之脉（古井底部）',
        title: '新芽',
        description: '在血脉之力与露娜荧族之力的共同作用下，大地之脉开始微弱复苏。露娜的头发从淡金变为耀眼的金色，她不再是最后一个荧族——大地之脉中有了新的生机。',
      },
    ],
    secrets: [
      '她是荧族最后一员',
      '她的记忆包含丰收使族全部历史',
      '大地之脉的封印阵会反噬施术者',
      '只要大地之脉复苏，荧族可能重生',
    ],
    questLines: ['q_luna_meeting', 'q_luna_trial', 'q_luna_awakening'],
  },
};

// ============================================================
// NPC基础运行时数据
// ============================================================

export const NPCS: Record<string, NPCData> = {
  old_tom: {
    id: 'old_tom', name: '老汤姆', role: '新手引导者',
    spriteKey: 'old_tom', portraitKey: 'portrait_old_tom',
    schedule: {}, birthday: { season: Season.AUTUMN, day: 15 },
  },
  lily: {
    id: 'lily', name: '莉莉', role: '图书管理员',
    spriteKey: 'lily', portraitKey: 'portrait_lily',
    schedule: {}, birthday: { season: Season.WINTER, day: 3 },
  },
  hank: {
    id: 'hank', name: '铁锤汉克', role: '铁匠',
    spriteKey: 'hank', portraitKey: 'portrait_hank',
    schedule: {}, birthday: { season: Season.SUMMER, day: 22 },
  },
  erin: {
    id: 'erin', name: '艾琳', role: '旅店店主',
    spriteKey: 'erin', portraitKey: 'portrait_erin',
    schedule: {}, birthday: { season: Season.SPRING, day: 8 },
  },
  sebastian: {
    id: 'sebastian', name: '神父塞巴斯蒂安', role: '教堂神父',
    spriteKey: 'sebastian', portraitKey: 'portrait_sebastian',
    schedule: {}, birthday: { season: Season.WINTER, day: 24 },
  },
  hana: {
    id: 'hana', name: '哈娜大婶', role: '杂货店主',
    spriteKey: 'hana', portraitKey: 'portrait_hana',
    schedule: {}, birthday: { season: Season.SPRING, day: 20 },
  },
  shadow: {
    id: 'shadow', name: '影子', role: '神秘商人',
    spriteKey: 'shadow', portraitKey: 'portrait_shadow',
    schedule: {}, birthday: { season: Season.AUTUMN, day: 28 },
  },
  luna: {
    id: 'luna', name: '露娜', role: '荧族化身',
    spriteKey: 'luna', portraitKey: 'portrait_luna',
    schedule: {}, birthday: { season: Season.SUMMER, day: 13 },
  },
};
