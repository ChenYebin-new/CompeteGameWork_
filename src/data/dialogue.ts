// ============================================================
// 余晖谷 Embervale - 第一章"归途"完整对话树
// 50+对话节点，含分支/条件/选项
// ============================================================

import type { DialogueNode } from '../types';

export const DIALOGUE_TREE: Record<string, DialogueNode> = {

  // =====================
  // 序章：抵达余晖谷
  // =====================

  'intro_train': {
    id: 'intro_train',
    speakerId: 'narrator',
    text: '（铁冠城开往余晖谷的末班列车在暮色中缓缓进站。莱拉紧握手中泛黄的信封——那是她与过去唯一的联系。）\n\n列车广播响起：前方到站，余晖谷。请下车的乘客做好准备……',
    nextNodeId: 'intro_arrival',
  },

  'intro_arrival': {
    id: 'intro_arrival',
    speakerId: 'narrator',
    text: '（列车停靠在余晖谷小站。月台上空无一人。黄昏的余晖穿过山谷隘口，在远方的农场废墟上投下一道金色的光。）\n\n一个苍老的声音从身后传来——',
    nextNodeId: 'meet_old_tom',
  },

  'meet_old_tom': {
    id: 'meet_old_tom',
    speakerId: 'old_tom',
    text: '你是……莱拉吧？安德烈亚斯的外孙女。我说不上来哪里……但你的眼睛，像极了他。\n\n我叫汤姆，你叫我老汤姆就行。三十年前，是你外祖父最信任的帮手。',
    choices: [
      {
        text: '"您能告诉我关于我外祖父的事吗？"',
        nextNodeId: 'tom_about_andreas_1',
        actions: [{ type: 'addFriendship', target: 'old_tom', value: 10 }],
      },
      {
        text: '"这里看起来……比信中描述的要荒凉"',
        nextNodeId: 'tom_valley_today',
        actions: [{ type: 'setFlag', target: 'noticed_decay', value: 1 }],
      },
    ],
  },

  'tom_about_andreas_1': {
    id: 'tom_about_andreas_1',
    speakerId: 'old_tom',
    text: '安德烈亚斯他……（老汤姆沉默了一会儿，目光投向远方的山谷隘口）\n\n他是个了不起的人。整个山谷的人都说他是老天赐给这块土地的。但有一些事……不急，你先安顿下来。',
    choices: [
      {
        text: '"不急，我先看看农场"',
        nextNodeId: 'tom_guide_farm',
        actions: [{ type: 'setFlag', target: 'tom_first_meeting_done', value: 1 }],
      },
    ],
  },

  'tom_valley_today': {
    id: 'tom_valley_today',
    speakerId: 'old_tom',
    text: '是啊，三十年……三十年足够让最好的农场变成荒地。但土地还在，孩子。土地不会死——它只是在等你回来。\n\n来，我先带你看看晨曦农场。',
    nextNodeId: 'tom_guide_farm',
    onExit: [{ type: 'setFlag', target: 'tom_first_meeting_done', value: 1 }],
  },

  'tom_guide_farm': {
    id: 'tom_guide_farm',
    speakerId: 'old_tom',
    text: '（老汤姆推开斑驳的木门，荒草丛生的农场展现在眼前，但正中央的旧井旁一块石板完好如新。）\n\n这就是他留给你的全部了。不过别泄气——孩子，我把旁边的工具棚整理了，里面有些还能用的东西。你先熟悉一下，明天开始我教你种地。',
    choices: [
      {
        text: '"谢谢您，汤姆爷爷。"',
        nextNodeId: 'tom_end_first_day',
        actions: [
          { type: 'addFriendship', target: 'old_tom', value: 20 },
          { type: 'setFlag', target: 'met_old_tom', value: 1 },
          { type: 'setFlag', target: 'first_day_start', value: 1 },
        ],
      },
    ],
  },

  'tom_end_first_day': {
    id: 'tom_end_first_day',
    speakerId: 'old_tom',
    text: '叫我老汤姆就行，"爷爷"太生分了，哈哈！去吧，看看你的土地。我在旁边的小木屋里，随时来找我。还有——（他压低声音）——农场地下有个地下室入口，在你外祖父的旧床底下。等你准备好了，去看看。',
    nextNodeId: 'end_dialogue',
    onExit: [{ type: 'setFlag', target: 'tom_mentioned_basement', value: 1 }],
  },

  // =====================
  // 老汤姆农耕教学
  // =====================

  'tom_farming_lesson_1': {
    id: 'tom_farming_lesson_1',
    speakerId: 'old_tom',
    text: '早啊，孩子！今天天气不错，正适合教你种地。\n\n第一步，锄头松土。看到那片杂草了吗？先把它锄掉，然后拿锄头把土翻松——看到松软的深色土壤了吗？那就是可以播种的地方。去吧，试试看。',
    conditions: [
      { type: 'questStatus', key: 'q_tutorial_farming', operator: 'eq', value: 'active' },
      { type: 'flag', key: 'met_old_tom', operator: 'eq', value: 1 },
    ],
    onExit: [{ type: 'setFlag', target: 'farm_tutorial_started', value: 1 }],
  },

  'tom_after_hoeing': {
    id: 'tom_after_hoeing',
    speakerId: 'old_tom',
    text: '很好！翻得不错。现在把手头的防风草种子撒在松过的土地上——不用太密，每块土地撒一粒就行。',
    conditions: [
      { type: 'flag', key: 'hoed_first_tile', operator: 'eq', value: 1 },
    ],
    onExit: [{ type: 'setFlag', target: 'seed_tutorial_given', value: 1 }],
  },

  'tom_after_planting': {
    id: 'tom_after_planting',
    speakerId: 'old_tom',
    text: '种得好！最后一步——也是最关键的一步：浇水。拿出水壶，去门口的旧水井打水，然后对着种子浇下去。没有水就没有芽。记住了？\n\n你的外祖父以前总是说："每一滴水都是一句许诺。"',
    conditions: [
      { type: 'flag', key: 'planted_first_seed', operator: 'eq', value: 1 },
    ],
    onExit: [
      { type: 'setFlag', target: 'farm_tutorial_done', value: 1 },
      { type: 'addFriendship', target: 'old_tom', value: 10 },
    ],
  },

  'tom_tutorial_complete': {
    id: 'tom_tutorial_complete',
    speakerId: 'old_tom',
    text: '很好，莱拉。你比你外祖父学得快（他年轻时笨手笨脚的，别跟别人说我说过这话）。\n\n现在你已经是个合格的农夫了！去镇上转转吧，认识认识人。对了——你临走前记得去地下室看看，那是你外祖父留给你的。',
    conditions: [
      { type: 'flag', key: 'farm_tutorial_done', operator: 'eq', value: 1 },
    ],
    choices: [
      {
        text: '"我会去的。谢谢您教我这一切。"',
        nextNodeId: 'end_dialogue',
        actions: [
          { type: 'addFriendship', target: 'old_tom', value: 15 },
          { type: 'setFlag', target: 'tutorial_all_done', value: 1 },
        ],
      },
    ],
  },

  // =====================
  // 地下室发现
  // =====================

  'basement_discovery': {
    id: 'basement_discovery',
    speakerId: 'narrator',
    text: '（莱拉掀开外祖父旧床下的地板，露出通往地下室的石阶。地下室不大，但堆满了旧物品：封存的种子袋、褪色的照片、以及——一个精致的木盒子，上面雕刻着她曾在信上见过的丰收使族徽章：一株在光环中生长的麦穗。）',
    choices: [
      {
        text: '打开木盒子',
        nextNodeId: 'basement_emblem',
        actions: [{ type: 'setFlag', target: 'found_family_emblem', value: 1 }],
      },
    ],
  },

  'basement_emblem': {
    id: 'basement_emblem',
    speakerId: 'narrator',
    text: '木盒打开，里面是一枚沉甸甸的铜质徽章，正面是丰收使族的族徽，背面刻着一行字：\n\n"当大地之脉重新苏醒，我将归来。——安德烈亚斯"',
    choices: [
      {
        text: '收好徽章，去找老汤姆',
        nextNodeId: 'tom_emblem_reaction',
        actions: [{ type: 'setFlag', target: 'has_emblem', value: 1 }],
      },
    ],
  },

  'tom_emblem_reaction': {
    id: 'tom_emblem_reaction',
    speakerId: 'old_tom',
    text: '（老汤姆看到徽章，双手发抖，眼眶微红）\n\n这是他失踪前戴的……那夜他走进仪式圈前，把徽章交给了你母亲。你母亲说弄丢了，原来一直在他床下……\n\n莱拉，这徽章不仅是遗物。它能感应大地之脉。如果有一天它发光了——你就去幽光森林，往最深处走。',
    onExit: [
      { type: 'setFlag', target: 'emblem_explained', value: 1 },
      { type: 'addFriendship', target: 'old_tom', value: 25 },
    ],
  },

  // =====================
  // 莉莉 - 图书馆相遇
  // =====================

  'lily_first_meet': {
    id: 'lily_first_meet',
    speakerId: 'lily',
    text: '（坐在堆满旧书的桌子后面，抬头看到来人）\n\n你是那个继承农场的人？我叫莉莉。这里的图书馆管理员——也是唯一的访客，说实话。\n\n（她推了推眼镜）\n\n如果你想找关于农作的书，左手第三排。如果你想找……别的，可能得告诉我你在找什么。',
    conditions: [
      { type: 'flag', key: 'has_emblem', operator: 'eq', value: 1 },
    ],
    choices: [
      {
        text: '"你对丰收使族了解多少？"',
        nextNodeId: 'lily_harvest_kin',
        actions: [{ type: 'addFriendship', target: 'lily', value: 15 }],
      },
      {
        text: '"我只是来看看有什么书"',
        nextNodeId: 'lily_neutral',
        actions: [{ type: 'addFriendship', target: 'lily', value: 5 }],
      },
    ],
  },

  'lily_neutral': {
    id: 'lily_neutral',
    speakerId: 'lily',
    text: '哦，随便看吧。不过提醒你——有些书架的书年代太久远了，小心别碰坏了。',
    nextNodeId: 'end_dialogue',
    conditions: [
      { type: 'flag', key: 'noticed_decay', operator: 'eq', value: 1 },
    ],
    onExit: [{ type: 'addFriendship', target: 'lily', value: 5 }],
  },

  'lily_harvest_kin': {
    id: 'lily_harvest_kin',
    speakerId: 'lily',
    text: '（她猛地站起来，眼镜差点掉下来）\n\n你为什么问这个？不——我是说，你怎么会对丰收使族感兴趣？\n\n（她压低声）\n\n我……我在这里研究了三年。有一个整柜的古文献——但很多关键页被人撕掉了。如果你和丰收使族有关联，你应该看看这些。',
    choices: [
      {
        text: '"我外祖父是丰收使族最后一代族长。"',
        nextNodeId: 'lily_shock',
        actions: [
          { type: 'addFriendship', target: 'lily', value: 30 },
          { type: 'setFlag', target: 'lily_knows_identity', value: 1 },
        ],
      },
      {
        text: '"我只是好奇。能让我看看那些文献吗？"',
        nextNodeId: 'lily_show_archive',
        actions: [{ type: 'addFriendship', target: 'lily', value: 10 }],
      },
    ],
  },

  'lily_shock': {
    id: 'lily_shock',
    speakerId: 'lily',
    text: '你……什么？安德烈亚斯的血亲？站在这里？你等一下——（她手忙脚乱地翻出一本笔记）——这些文献里反复提到一个"族裔归来"的预言。我一直以为那只是古老传说！\n\n如果你愿意帮我解开这些文献的秘密，我……我可以把我这几年的研究全都分享给你。',
    choices: [
      {
        text: '"好，一起解开这些秘密。"',
        nextNodeId: 'lily_agree',
        actions: [
          { type: 'addFriendship', target: 'lily', value: 20 },
          { type: 'startQuest', target: 'q_lily_archive' },
        ],
      },
    ],
  },

  'lily_show_archive': {
    id: 'lily_show_archive',
    speakerId: 'lily',
    text: '（她犹豫了一下，但眼神里透露出兴奋）\n\n……算了，告诉你吧。这是我三年来的研究。你看到那面墙了吗？一整柜都是丰收使族的古文献。\n\n如果你能帮我完成研究，我会告诉你我都发现了什么。',
    choices: [
      {
        text: '"好，我来帮你。"',
        nextNodeId: 'lily_agree',
        actions: [
          { type: 'addFriendship', target: 'lily', value: 15 },
          { type: 'startQuest', target: 'q_lily_archive' },
        ],
      },
    ],
  },

  'lily_agree': {
    id: 'lily_agree',
    speakerId: 'lily',
    text: '太好了！你去外面搜集材料的同时，能不能帮我留意一下任何和"星辉仪式"相关的记载？特别是——关于大地之脉的封印解除方法的？\n\n这很重要。我觉得你外祖父的消失，和解除封印有关。',
    onExit: [
      { type: 'setFlag', target: 'lily_archive_started', value: 1 },
      { type: 'addFriendship', target: 'lily', value: 20 },
    ],
  },

  // =====================
  // 汉克 - 铁匠铺首遇
  // =====================

  'hank_first_meet': {
    id: 'hank_first_meet',
    speakerId: 'hank',
    text: '（铁锤敲打声停下，抬起汗津津的光头看着你）\n\n你就是安德烈亚斯的后人？看不出来。要修工具还是买新的？',
    choices: [
      {
        text: '"我是莱拉。需要一把好用的锄头。"',
        nextNodeId: 'hank_first_hoe',
        actions: [{ type: 'addFriendship', target: 'hank', value: 5 }],
      },
      {
        text: '"关于丰收使族的工具，你知道些什么？"',
        nextNodeId: 'hank_defensive',
        actions: [{ type: 'addFriendship', target: 'hank', value: -2 }],
      },
    ],
  },

  'hank_defensive': {
    id: 'hank_defensive',
    speakerId: 'hank',
    text: '（他的表情沉下来）\n\n丰收使族的工具？我不知道你在说什么。我这打出来的都是普通铁器。要就买，不要就出去。',
    nextNodeId: 'end_dialogue',
    onExit: [{ type: 'setFlag', target: 'hank_guarded', value: 1 }],
  },

  'hank_first_hoe': {
    id: 'hank_first_hoe',
    speakerId: 'hank',
    text: '我给你打一把新手用的。来，你站炉子这边来——对，左手拿铁锤，右手握钳子。\n\n（他站在你身后，声音突然变得比打铁还低沉）\n\n记住：三锤。第一锤找形状，第二锤找硬度，第三锤找心。你的外祖父每次来打工具都会说这句话。',
    choices: [
      {
        text: '照他说的，打三锤',
        nextNodeId: 'hank_three_hits',
        actions: [{ type: 'addFriendship', target: 'hank', value: 15 }],
      },
    ],
  },

  'hank_three_hits': {
    id: 'hank_three_hits',
    speakerId: 'hank',
    text: '（他检查了你的成品，沉默很久）\n\n……勉强能用。拿去吧，不收你钱。就当是还你外祖父的旧账。\n\n（他把锄头递给你时，铁匠铺地面下方的某处发出一声低沉的嗡响）\n\n走吧。我还有别的活要干。',
    onExit: [
      { type: 'addFriendship', target: 'hank', value: 15 },
      { type: 'setFlag', target: 'hank_gave_hoe', value: 1 },
      { type: 'giveItem', target: 'hoe', value: 1 },
    ],
  },

  // =====================
  // 艾琳 - 客栈首遇
  // =====================

  'erin_first_meet': {
    id: 'erin_first_meet',
    speakerId: 'erin',
    text: '哎呀！你就是老汤姆整天念叨的新农场主吧？我叫艾琳，余晖客栈的老板。\n\n来来来，新来的人第一杯我请——苹果酒，自己酿的。\n\n（她飞快地倒了杯酒推到吧台上）\n\n所以，你在铁冠城长大？那个地方现在怎么样了？是不是还是那么——怎么说——死气沉沉？',
    choices: [
      {
        text: '"谢谢你的酒。铁冠城确实没什么变化。"',
        nextNodeId: 'erin_gossip',
        actions: [{ type: 'addFriendship', target: 'erin', value: 10 }],
      },
      {
        text: '"你似乎对铁冠城很了解？"',
        nextNodeId: 'erin_father_hint',
        actions: [{ type: 'addFriendship', target: 'erin', value: 15 }],
      },
    ],
  },

  'erin_gossip': {
    id: 'erin_gossip',
    speakerId: 'erin',
    text: '是啊，这地方偏僻得很，但消息可灵通着！\n\n说到消息——你听说了吗？镇长柳明最近频繁往铁冠城寄信。我有种预感，外面的人可能对山谷有想法。\n\n（她眨了眨眼）\n\n总之，如果有什么新鲜事发生，记得来告诉我。我这店门永远为你开着。',
    onExit: [
      { type: 'addFriendship', target: 'erin', value: 10 },
      { type: 'setFlag', target: 'erin_gossip_shared', value: 1 },
    ],
  },

  'erin_father_hint': {
    id: 'erin_father_hint',
    speakerId: 'erin',
    text: '（她的笑容顿了一下）\n\n我父亲以前是镇长的副手。他经常去铁冠城……后来发生了一些事。\n\n（她迅速恢复了笑容）\n\n算了，不提旧事！总之，如果你在这山谷里需要任何情报——来我这就对了。',
    onExit: [
      { type: 'addFriendship', target: 'erin', value: 15 },
      { type: 'setFlag', target: 'erin_mentioned_father', value: 1 },
    ],
  },

  // =====================
  // 塞巴斯蒂安 - 教堂首遇
  // =====================

  'sebastian_first_meet': {
    id: 'sebastian_first_meet',
    speakerId: 'sebastian',
    text: '（教堂长椅上，一个年轻的神父正在擦拭烛台。看到你进来，他闪过一丝慌乱）\n\n啊——欢迎光临。你是……农场继承人吧？老汤姆跟我提过你。\n\n我是塞巴斯蒂安，这座教堂的神父。如果你需要祈祷……或者只是想找个安静的地方坐坐，这里随时欢迎你。',
    choices: [
      {
        text: '"谢谢你。这座教堂看起来很古老。"',
        nextNodeId: 'sebastian_church_history',
        actions: [{ type: 'addFriendship', target: 'sebastian', value: 5 }],
      },
      {
        text: '"你好像有点不安？一切都好吗？"',
        nextNodeId: 'sebastian_dodge',
        actions: [{ type: 'addFriendship', target: 'sebastian', value: 10 }],
      },
    ],
  },

  'sebastian_church_history': {
    id: 'sebastian_church_history',
    speakerId: 'sebastian',
    text: '是的，这座教堂比余晖谷大多数建筑都老。有人说它的地基比丰收使族还早……\n\n（他突然顿住，仿佛意识到自己说漏了嘴）\n\n呃——我的意思是，如果你对山谷历史感兴趣的话。但我对这方面了解不多。真的不多。',
    nextNodeId: 'end_dialogue',
    onExit: [
      { type: 'setFlag', target: 'sebastian_slipped', value: 1 },
      { type: 'addFriendship', target: 'sebastian', value: 5 },
    ],
  },

  'sebastian_dodge': {
    id: 'sebastian_dodge',
    speakerId: 'sebastian',
    text: '不——没有，我很好。只是最近……睡不太好。\n\n（他深深看了你一眼，然后又移开目光）\n\n如果你以后想找书看——教堂有一些、呃，比较古老的收藏。但不是现在。等合适的时候。',
    nextNodeId: 'end_dialogue',
    onExit: [
      { type: 'setFlag', target: 'sebastian_secret_library', value: 1 },
      { type: 'addFriendship', target: 'sebastian', value: 10 },
    ],
  },

  // =====================
  // 哈娜 - 杂货店偶遇
  // =====================

  'hana_first_meet': {
    id: 'hana_first_meet',
    speakerId: 'hana',
    text: '（一个银发老妇人正在整理货架上的种子袋。听到门铃转身，她愣了一瞬——仿佛认识你的脸。）\n\n……我终于见到你了。莱拉。\n\n（她轻快地拍了拍围裙）\n\n我叫哈娜，大家都叫我哈娜大婶。我这店里什么都有——种子、工具、日用杂货。以后有什么需要尽管来找我！',
    choices: [
      {
        text: '"你好像认识我？"',
        nextNodeId: 'hana_knows',
        actions: [{ type: 'addFriendship', target: 'hana', value: 25 }],
      },
      {
        text: '"我需要些种子和日用品。"',
        nextNodeId: 'hana_shop',
        actions: [{ type: 'addFriendship', target: 'hana', value: 5 }],
      },
    ],
  },

  'hana_knows': {
    id: 'hana_knows',
    speakerId: 'hana',
    text: '认识？孩子，我从你母亲在你这么大年纪时就认识她了。不过别急——有些话不能在这儿说。墙上挂着耳朵。\n\n（她压低声音把脸凑近）\n\n改天晚上来，关了店门之后。我有东西给你——你外祖父留给你的。',
    onExit: [
      { type: 'addFriendship', target: 'hana', value: 25 },
      { type: 'setFlag', target: 'hana_secret_items', value: 1 },
    ],
  },

  'hana_shop': {
    id: 'hana_shop',
    speakerId: 'hana',
    text: '来，看看！春天适合种防风草和马铃薯。防风草收得快，马铃薯卖得贵——选哪个你自己斟酌。对了，新来的客人第一单打八折，这是老规矩。',
    nextNodeId: 'end_dialogue',
    onExit: [
      { type: 'addFriendship', target: 'hana', value: 10 },
      { type: 'setFlag', target: 'hana_shop_visited', value: 1 },
    ],
  },

  // =====================
  // 影子 - 集市偶遇
  // =====================

  'shadow_first_meet': {
    id: 'shadow_first_meet',
    speakerId: 'shadow',
    text: '（旧水井旁的深紫色帐篷前，一个人影背对你整理货物）\n\n啊——来了位新面孔。让我猜猜……你是安德烈亚斯家的孩子吧？\n\n（他转过身，兜帽下的阴影中透出一丝浅金色的目光）\n\n我叫影子。每两周来一次这山谷，卖点——特殊的东西。你可能会用得上的东西。',
    conditions: [
      { type: 'flag', key: 'has_emblem', operator: 'eq', value: 1 },
    ],
    choices: [
      {
        text: '"你怎么知道我姓安德里亚斯？"',
        nextNodeId: 'shadow_name',
        actions: [{ type: 'addFriendship', target: 'shadow', value: 10 }],
      },
      {
        text: '"你有什么特殊的东西？"',
        nextNodeId: 'shadow_wares',
        actions: [{ type: 'addFriendship', target: 'shadow', value: 5 }],
      },
    ],
  },

  'shadow_name': {
    id: 'shadow_name',
    speakerId: 'shadow',
    text: '（他轻笑了一声，像风吹过的枯叶）\n\n我认识这山谷的每一寸土地。你身上有丰收使族徽章的微光——只有我能看见。\n\n别怕，孩子。我是你这边的。但有些话我现在不能说……等你找到森林里的那个"小家伙"之后，回来找我。',
    onExit: [
      { type: 'addFriendship', target: 'shadow', value: 10 },
      { type: 'setFlag', target: 'shadow_recognized_emblem', value: 1 },
      { type: 'setFlag', target: 'shadow_hint_luna', value: 1 },
    ],
  },

  'shadow_wares': {
    id: 'shadow_wares',
    speakerId: 'shadow',
    text: '星辉莓种子——只有秋天能种，但结出的果实比黄金还值钱。元素石碎片——用来升级你的工具。还有一些……不方便公开说的东西。\n\n（他压低声）\n\n比如，从星辉遗址深处捡回来的某种旧物。对你来说可能比对我重要。等你有钱了再来。',
    nextNodeId: 'end_dialogue',
    onExit: [
      { type: 'addFriendship', target: 'shadow', value: 5 },
      { type: 'setFlag', target: 'shadow_shop_opened', value: 1 },
    ],
  },

  // =====================
  // 露娜 - 幽光森林邂逅
  // =====================

  'luna_first_meet': {
    id: 'luna_first_meet',
    speakerId: 'luna',
    text: '（森林深处，一棵巨大的空心橡树中，一个小女孩正在和萤火虫低声交谈。她察觉到你，转过身来——不是害怕，是好奇。）\n\n（一道清澈的心声直接传入你的脑海）\n\n"你是……那个金色的人。"',
    conditions: [
      { type: 'flag', key: 'has_emblem', operator: 'eq', value: 1 },
    ],
    choices: [
      {
        text: '"你能在我脑海里说话？你是谁？"',
        nextNodeId: 'luna_introduce',
        actions: [{ type: 'addFriendship', target: 'luna', value: 15 }],
      },
      {
        text: '"金色的人？你指什么？"',
        nextNodeId: 'luna_see_emblem',
        actions: [{ type: 'addFriendship', target: 'luna', value: 10 }],
      },
    ],
  },

  'luna_introduce': {
    id: 'luna_introduce',
    speakerId: 'luna',
    text: '"我叫露娜。荧族的。我也只有我了——其他人都变成光了。\n\n我不会说你们的话，但我的"心意"可以传给你。因为你的身体里有金色的东西。和妈妈一样的金色东西。"',
    choices: [
      {
        text: '"我身体里有金色的东西？你是指丰收使族的血脉？"',
        nextNodeId: 'luna_confirm_kin',
        actions: [{ type: 'addFriendship', target: 'luna', value: 15 }],
      },
    ],
  },

  'luna_see_emblem': {
    id: 'luna_see_emblem',
    speakerId: 'luna',
    text: '"那个——（她用小手指向你的背包，正是那枚丰收使族徽章所在的位置）——它在发光。对我来说很亮很亮。\n\n你的身体里也有这种光。和妈妈一样。妈妈是丰收使族的人。你也是丰收使族的人。"',
    choices: [
      {
        text: '"你妈妈是丰收使族？你可以告诉我更多吗？"',
        nextNodeId: 'luna_confirm_kin',
        actions: [{ type: 'addFriendship', target: 'luna', value: 15 }],
      },
    ],
  },

  'luna_confirm_kin': {
    id: 'luna_confirm_kin',
    speakerId: 'luna',
    text: '"是的！丰收使族是我们荧族最好的朋友。你的祖先每天黄昏和我们一起唱歌，大地之脉会回唱。\n\n后来有天晚上——很吵很吵，很多紫色的光，妈妈和别的丰收使族的人做了什么事，然后他们就都走了。\n\n（她的眼睛蒙上一层水雾）\n\n但我能感觉到有人在回来的路上。那个人是不是你？"',
    choices: [
      {
        text: '"我会帮你的。告诉我怎么做才能让大地之脉苏醒。"',
        nextNodeId: 'luna_trial_promise',
        actions: [
          { type: 'addFriendship', target: 'luna', value: 25 },
          { type: 'setFlag', target: 'met_luna', value: 1 },
        ],
      },
    ],
  },

  'luna_trial_promise': {
    id: 'luna_trial_promise',
    speakerId: 'luna',
    text: '"（她的脸上绽开一个只有荧族才会拥有的、像花朵开放一样的笑容）\n\n好！那你需要接受荧族试炼。其实就是——你看那些金色的光点了吗？每个光点是我族人的一段记忆。你去碰三个。\n\n这是我们的方式——让人了解我们，信任我们。然后我们一起，去唤醒大地爷爷。"',
    onExit: [
      { type: 'setFlag', target: 'luna_trial_ready', value: 1 },
      { type: 'startQuest', target: 'q_luna_trial' },
    ],
  },

  // =====================
  // 荧族试炼 - 记忆光点1：丰收使族起源
  // =====================

  'trial_memory_1': {
    id: 'trial_memory_1',
    speakerId: 'narrator',
    text: '（第一个光点：远古时代。第一批人类穿越山谷隘口来到这里，发现大地之脉——一眼金色涌泉。）\n\n荧族长老的心声："他们来了。他们和其他人类不同——他们跪下倾听泉涌的声音，而不是试图抓住它、改变它。我们决定接纳他们。"\n\n荧族教会人类第一个仪式：用歌声与大地共鸣。这便是丰收使族的起源。',
    onExit: [
      { type: 'setFlag', target: 'trial_memory_1_seen', value: 1 },
    ],
  },

  // =====================
  // 荧族试炼 - 记忆光点2：大地之脉诞生
  // =====================

  'trial_memory_2': {
    id: 'trial_memory_2',
    speakerId: 'narrator',
    text: '（第二个光点：更早更早。一颗流星坠入山谷，砸出巨坑。流星的碎片融入地下水，形成了大地之脉——一道永恒的金色泉涌。）\n\n"这颗星星是活着的。它选择了这片山谷，需要有人守护它。于是，第一个荧族从泉涌中诞生了。\n\n守护大地之脉的代价是：守护者永远不能离开这山谷。但只要大地之脉在流动，守护者就不会消亡。"',
    onExit: [
      { type: 'setFlag', target: 'trial_memory_2_seen', value: 1 },
    ],
  },

  // =====================
  // 荧族试炼 - 记忆光点3：封印阵的代价
  // =====================

  'trial_memory_3': {
    id: 'trial_memory_3',
    speakerId: 'narrator',
    text: '（第三个光点：三十年前的秋之契之夜。暗紫色的光柱从山谷外射来，侵蚀大地之脉。安德烈亚斯与荧族全员站在泉涌周围。）\n\n"安德烈亚斯喊道：启动封印！所有荧族把手放在大地上——他们的身体开始化作金色光芒，像水流一样汇入泉涌。\n\n安德烈亚斯站在阵眼中，将自己的血脉之力注入。紫光被逼退——但封印阵需要"锚"，一个永远固定在阵中的人。\n\n最后一个荧族长老的心声：安德烈亚斯成为锚了。他留在了封印阵的最深处。他没有死——他也不能死，因为封印需要他永远活着。"',
    onExit: [
      { type: 'setFlag', target: 'trial_memory_3_seen', value: 1 },
      { type: 'setFlag', target: 'trial_all_complete', value: 1 },
    ],
  },

  // =====================
  // 荧族试炼完成
  // =====================

  'luna_trial_complete': {
    id: 'luna_trial_complete',
    speakerId: 'luna',
    text: '"（露娜静静地站在三个光点之间，眼中闪烁翠绿色的光芒）\n\n你看到了吗？那个叫安德烈亚斯的人——他是锚。他还在封印阵里面。他没有死。\n\n你要打开封印，让他出来。但打开封印需要两样东西：\n\n第一——你的血，因为你是他的后人。第二——我的泪，因为荧族也是封印的一部分。\n\n准备好在古井见面。我们一起去唤醒大地爷爷。"',
    conditions: [
      { type: 'flag', key: 'trial_all_complete', operator: 'eq', value: 1 },
    ],
    onExit: [
      { type: 'setFlag', target: 'trial_done', value: 1 },
      { type: 'completeQuest', target: 'q_luna_trial' },
      { type: 'startQuest', target: 'q_awaken_leyline' },
      { type: 'addFriendship', target: 'luna', value: 30 },
    ],
  },

  // =====================
  // 大地之脉苏醒
  // =====================

  'awakening_leyline': {
    id: 'awakening_leyline',
    speakerId: 'narrator',
    text: '（古井旁。玩家割破指尖，一滴血落入井中。露娜站在井边，一滴银色的泪珠从她翠绿色的眼中滑落，坠入井水。）\n\n（片刻的死寂后——）\n\n一道金色的光芒从古井深处升起，照亮了整座农场。井水开始重新涌出，澄澈透明，闪烁着淡淡的金光。\n\n大地之脉，苏醒了。\n\n远方，星辉遗址深处，传来了封印阵解开的声音——沉闷的嗡响。',
    conditions: [
      { type: 'flag', key: 'trial_done', operator: 'eq', value: 1 },
    ],
    choices: [
      {
        text: '"成功了……大地之脉回来了。"',
        nextNodeId: 'chapter_one_ending',
        actions: [
          { type: 'setFlag', target: 'leyline_awakened', value: 1 },
          { type: 'completeQuest', target: 'q_awaken_leyline' },
        ],
      },
    ],
  },

  // =====================
  // 第一章尾声
  // =====================

  'chapter_one_ending': {
    id: 'chapter_one_ending',
    speakerId: 'narrator',
    text: '古井涌出清泉的消息，一夜之间传遍了余晖谷的所有角落。\n\n老汤姆站在农场门口，老泪纵横——三十年了，他终于再次闻到了那种湿润的、带着淡淡甜味的空气。\n\n莉莉开始在图书馆整理更多丰收使族文献，所有的残卷都有了新的意义。\n\n铁匠铺里，汉克盯着发光的符文工具，终于露出了一丝微笑。\n\n客栈里，艾琳对着父亲的照片轻声说："爸，山谷在醒过来了。"\n\n教堂里，塞巴斯蒂安跪在禁忌文献前，做出了他的决定。\n\n哈娜大婶从旧铜钥匙中取出了一个小小的封印丝带——它正在发着微光。\n\n旧水井旁，影子摘下了兜帽，第一次在余晖谷的暮光中露出了脸。\n\n幽光森林深处，露娜的手心里，一个小小的金光点——一个新的荧族——正在萌芽。\n\n而远方的星辉遗址，封印阵深处，一个昏迷了三十年的人睁开了眼睛。\n\n——第一章·归途 <完>——',
    onExit: [
      { type: 'setFlag', target: 'chapter_one_done', value: 1 },
    ],
  },

  // =====================
  // 系统对话
  // =====================

  'end_dialogue': {
    id: 'end_dialogue',
    speakerId: 'system',
    text: '',
    nextNodeId: '',
  },

  // =====================
  // 艾琳深层剧情对话
  // =====================

  'erin_deep_talk': {
    id: 'erin_deep_talk',
    speakerId: 'erin',
    text: '……我父亲。他是一个好人。太好的一个人。\n\n镇长柳明派我父亲去铁冠城送一份"和平贸易协定"。但他在隘口被推下去的——不是意外。\n\n我需要你帮我去隘口找人问线索。父亲的遗物里有一个放信鸽的密码筒——如果能找到那只信鸽，也许能解密那封"协议"。',
    conditions: [
      { type: 'flag', key: 'erin_mentioned_father', operator: 'eq', value: 1 },
      { type: 'friendship', key: 'erin', operator: 'gte', value: 100 },
    ],
    choices: [
      {
        text: '"我会帮你的，这事不能就这么算了。"',
        nextNodeId: 'erin_accept_quest',
        actions: [
          { type: 'addFriendship', target: 'erin', value: 20 },
          { type: 'startQuest', target: 'q_erin_father' },
        ],
      },
    ],
  },

  'erin_accept_quest': {
    id: 'erin_accept_quest',
    speakerId: 'erin',
    text: '（她用力握住玩家的手）\n\n谢谢你。从现在起你就是我的人了——哦不，我是说，我们就是自己人了。\n\n小心柳明。如果他在隘口设了耳目，就先去哈娜那里打探风声。哈娜知道这山谷里每个人的秘密。',
    nextNodeId: 'end_dialogue',
  },

  // =====================
  // 塞巴斯蒂安深层剧情对话
  // =====================

  'sebastian_trust': {
    id: 'sebastian_trust',
    speakerId: 'sebastian',
    text: '（深夜，教堂地下室。烛光摇曳。）\n\n我不知道是否应该给你看这些……但如果还有谁能读懂它们，那就是你了。\n\n（他打开一个锁着的木箱，里面是泛黄的卷轴）\n\n这是丰收使族封印阵的原理手册。按照上面所说——安德烈亚斯大人他……他不是死了，他是把自己关进了封印阵里面。\n\n更可怕的是：这些卷轴上有一个名字一直出现——柳明。二十年前，柳明是丰收使族外围的人。',
    conditions: [
      { type: 'flag', key: 'sebastian_secret_library', operator: 'eq', value: 1 },
      { type: 'friendship', key: 'sebastian', operator: 'gte', value: 100 },
    ],
    choices: [
      {
        text: '"柳明和星辉之疫有关？"',
        nextNodeId: 'sebastian_reveal',
        actions: [
          { type: 'addFriendship', target: 'sebastian', value: 25 },
          { type: 'setFlag', target: 'liu_ming_suspect', value: 1 },
        ],
      },
    ],
  },

  'sebastian_reveal': {
    id: 'sebastian_reveal',
    speakerId: 'sebastian',
    text: '我父亲留下了一封信——他当时是柳明的文书。他写道："柳明带回来一批外来工匠，在山谷隘口建了一个东西。我不知道那是什么，但它发出的声音让大地之脉颤动——"\n\n然后信没了。被撕去了末尾。\n\n（他双手发抖）\n\n我现在怀疑——星辉之疫，就是那个外来装置激活时造成的。而柳明知道这一点。',
    nextNodeId: 'end_dialogue',
  },

  // =====================
  // 哈娜深夜交心
  // =====================

  'hana_night_visit': {
    id: 'hana_night_visit',
    speakerId: 'hana',
    text: '（夜。杂货店后屋。哈娜沏了一壶浓茶。）\n\n坐吧，孩子。想问什么就问。这面墙一关，没人听得见。\n\n我这三十年，每天都在账本上记下山谷的大小事——谁的作物收了、谁和谁吵了架、谁偷偷摸摸往铁冠城方向去了……\n\n这不仅仅是账本。这是余晖谷的"命簿"。',
    conditions: [
      { type: 'flag', key: 'hana_secret_items', operator: 'eq', value: 1 },
      { type: 'friendship', key: 'hana', operator: 'gte', value: 100 },
    ],
    choices: [
      {
        text: '"你知道柳明的事吗？"',
        nextNodeId: 'hana_about_liuming',
        actions: [{ type: 'addFriendship', target: 'hana', value: 15 }],
      },
      {
        text: '"关于秋之契那夜，你能告诉我更多吗？"',
        nextNodeId: 'hana_night_detail',
        actions: [{ type: 'addFriendship', target: 'hana', value: 20 }],
      },
    ],
  },

  'hana_about_liuming': {
    id: 'hana_about_liuming',
    speakerId: 'hana',
    text: '（她翻到账本其中一页，密密麻麻写满字）\n\n柳明。二十年前就当上了镇长。但有意思的在这——在那之前，他只是丰收使族外围的一个收购商人。\n\n就是说——他曾经是你外祖父的人。\n\n三十年前秋之契那夜，本该在隘口值守的人就是他。但第二天早上他声称自己"被迷晕了"，所有人信了他。我没信。',
    onExit: [
      { type: 'setFlag', target: 'liu_ming_confirmed', value: 1 },
    ],
  },

  'hana_night_detail': {
    id: 'hana_night_detail',
    speakerId: 'hana',
    text: '（她从围裙口袋里掏出一个小笔记本）\n\n我躲在猎户小屋里，透过窗户，看到了两道光。\n\n第一道是金色的——是仪式圈里的，正常的秋之契。第二道是暗紫色，从隘口外面射进来的。\n\n金色和紫色撞在一起——然后爆炸了。或者说，不是爆炸——是封口。金色的光把紫色的光包住了，缩成了针尖大小，然后消失了。\n\n安德烈亚斯、所有荧族、紫光——一起被吞了进去。只剩下这个。\n\n（她展开手掌——掌心是一小块发暗的水晶碎片）',
    nextNodeId: 'end_dialogue',
  },

  // =====================
  // 影子坦白
  // =====================

  'shadow_reveal': {
    id: 'shadow_reveal',
    speakerId: 'shadow',
    text: '（他摘下兜帽。看起来约四十岁，眼角有细纹，但眼睛是浅金色的——和露娜描述的"金色东西"一样。）\n\n我叫塞巴斯蒂安·维克托·安德烈亚斯——开个玩笑。但姓安德里亚斯是真的。\n\n你外祖父安德烈亚斯有个兄长，在铁冠城做贸易，很久以前就不被允许回山谷。那个兄长就是我父亲。\n\n所以按辈分——我是你叔叔。',
    conditions: [
      { type: 'flag', key: 'shadow_recognized_emblem', operator: 'eq', value: 1 },
      { type: 'friendship', key: 'shadow', operator: 'gte', value: 150 },
    ],
    choices: [
      {
        text: '"为什么你一直不回来？"',
        nextNodeId: 'shadow_why_away',
        actions: [{ type: 'addFriendship', target: 'shadow', value: 20 }],
      },
    ],
  },

  'shadow_why_away': {
    id: 'shadow_why_away',
    speakerId: 'shadow',
    text: '因为我在外面追查那个装置。那个暗紫色光柱的来源。\n\n那不是什么魔法——那是铁冠城某个工业家族研发的"大地汲取器"。他们想抽取大地之脉的能量来运作工厂。\n\n柳明收了他们的钱，在秋之契之夜打开了隘口，让汲取器启动。\n\n我用了三十年找到了那台汲取器的原主人，拿到了证据。但只有我一个人没用——我需要族人，我需要你。',
    choices: [
      {
        text: '"我们一起。为祖父、为山谷、为荧族。"',
        nextNodeId: 'end_dialogue',
        actions: [
          { type: 'setFlag', target: 'shadow_joined', value: 1 },
          { type: 'addFriendship', target: 'shadow', value: 30 },
        ],
      },
    ],
  },
};

// ============================================================
// 对话类型定义（引用）
// ============================================================

export type { DialogueNode } from '../types';
