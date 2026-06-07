# 余晖谷 (Embervale)

> ◇ 一场关于归乡与传承的田园诗篇 ◇

基于 **Phaser.js 3.80 + TypeScript 5 + Vite 5** 开发的像素风农场经营 RPG 游戏。

---

## 🎮 游戏简介

在遥远的余晖谷，继承祖父留下的荒废农场。通过耕种作物、结交村民、探索森林与山谷，揭开这片土地背后隐藏的故事。

### 核心特性

- 🌾 **农场经营** — 耕地、播种、浇水、收获，体验四季轮转的农耕乐趣
- 🗺️ **三张地图** — 农场、城镇、森林，每张地图都有独特的地形与NPC
- 💬 **对话叙事** — 8位村民+分支对话系统，好感度与剧情推进
- ⏰ **时间系统** — 实时日月流转、四季更替、天气变化
- 🎒 **背包系统** — 24槽背包、物品管理、排序整理
- 💾 **存档系统** — 3槽位本地存档（localStorage），支持保存/读取/删除
- 🎨 **行走动画** — 四方向像素风角色动态行走

---

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0
- **npm** >= 9.0

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/ChenYebin/CompeteGameWork.git
cd CompeteGameWork

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

开发服务器默认运行在 `http://localhost:5173`

---

## 🎯 操作指南

| 按键 | 功能 |
|------|------|
| `W A S D` | 移动角色 |
| `E` | 交互 / 对话推进 / 播种 |
| `1` | 切换锄头 |
| `2` | 切换水壶 |
| `3` | 切换镰刀 |
| `4` | 种植模式（自动选择背包种子） |
| `Tab` | 打开/关闭背包 |
| `Esc` | 暂停菜单 |

### 游戏流程

1. **主菜单** → 开始新游戏 / 读取存档 / 游戏设定
2. **农场地图** → 使用锄头耕田 → 种植种子 → 浇水 → 等待作物成熟 → 用镰刀收获
3. **城镇地图** → 与NPC对话、触发剧情
4. **森林地图** → 探索空心橡树（荧族领地）
5. **凌晨2点** → 自动结束一天，体力恢复

---

## 📁 项目结构

```
CompeteGameWork_/
├── index.html                  # 入口HTML
├── package.json                # 依赖配置
├── tsconfig.json               # TypeScript配置
├── vite.config.ts              # Vite构建配置
├── assets/                     # AI生成素材
│   ├── characters/             # 玩家/NPC角色图
│   ├── tilesets/               # 地面/建筑瓦片
│   ├── ui/                     # UI/标题素材
│   └── items/                  # 物品/作物图标
└── src/
    ├── main.ts                 # 游戏入口
    ├── config/game.ts          # 全局常量配置
    ├── types/index.ts          # TypeScript类型定义
    ├── scenes/
    │   ├── BootScene.ts        # 资源加载 + 程序化精灵生成
    │   ├── MenuScene.ts        # 主菜单（含存档/设定面板）
    │   └── GameScene.ts        # 核心游戏主场景
    ├── entities/
    │   └── Player.ts           # 玩家实体（Sprite + 行走动画）
    ├── systems/
    │   ├── MapManager.ts       # 地图渲染与管理
    │   ├── TimeSystem.ts       # 时间/季节/天气
    │   ├── WeatherSystem.ts    # 天气视觉效果
    │   ├── CropSystem.ts       # 种植/收获系统
    │   ├── SaveSystem.ts       # 本地存档读写
    │   ├── PlayerController.ts # 键盘输入控制
    │   ├── DialogueSystem.ts   # 对话状态机
    │   ├── QuestSystem.ts      # 任务管理系统
    │   └── ...
    ├── ui/
    │   ├── InventoryUI.ts      # 背包界面
    │   └── PauseMenu.ts        # 暂停菜单
    ├── narrative/
    │   ├── NarrativeTree.ts    # 叙事总控
    │   ├── FlagManager.ts      # 剧情标志
    │   └── RelationshipManager.ts
    ├── maps/
    │   ├── FarmMap.ts          # 农场地图数据
    │   ├── TownMap.ts          # 城镇地图数据
    │   └── ForestMap.ts        # 森林地图数据
    └── data/
        ├── items.ts            # 物品数据库
        └── crops.ts            # 作物数据库
```

---

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| **Phaser.js 3.80** | 2D 游戏引擎 |
| **TypeScript 5** | 类型安全开发 |
| **Vite 5** | 构建工具与开发服务器 |
| **HTML5 Canvas** | 游戏渲染 |
| **localStorage** | 存档持久化 |

### 画面规格
- 分辨率：1920×1080 (1080p)
- 瓦片尺寸：48×48px
- 渲染方式：RenderTexture 离屏合成 + 静态纹理缓存

---

## 📝 开发日志

### v0.3.0 (当前)
- ✅ 修复返回标题蓝屏崩溃（重构场景生命周期为单Phaser shutdown流程）
- ✅ 修复无法播种问题（E键自动识别种子种植+4键种子袋工具）
- ✅ 防重入安全锁（isShuttingDown + events.once 防止二次销毁）
- ✅ 全面稳定性加固（子系统统一destroy、MenuScene静态变量实例化、建筑纹理确定性渲染）
- ✅ TimeSystem hour 边界保护
- ✅ PlayerController 添加 destroy 方法
- ✅ UI全面升级：HUD体力渐变进度条、背包内发光边框、对话面板NPC头像区、主菜单脉冲呼吸动画
- ✅ 美术品质提升：作物程序化渐变渲染、耕地随机纹理细节、水塘动态波纹、NPC待机呼吸动画
- ✅ 工具系统扩展：新增种子袋（SEED_BAG），自动选择背包种子

### v0.2.0
- ✅ 行走动画系统（四方向×4帧动态行走）
- ✅ 主菜单存档选择界面（3槽位可视化）
- ✅ 主菜单游戏设定面板
- ✅ 暂停菜单真实保存功能（含覆盖/删除）
- ✅ 返回标题安全资源清理（防止内存泄漏）
- ✅ 背包物品图标渲染 + 金币实时刷新
- ✅ 地图纹理冲突修复 + AI建筑素材接入
- ✅ 修复 STAMINA_REGEN_PER_HOUR 编译错误

### v0.1.0
- 基础农场经营玩法
- 三张地图 + 碰撞检测
- 8位NPC + 对话系统
- 时间/季节/天气系统
- AI生成像素风素材

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可

本项目用于比赛展示，保留所有权利。

---

*"谷中的余晖，照亮归乡的路。"*
