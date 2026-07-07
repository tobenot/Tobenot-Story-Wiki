# Tobenot-Story-Wiki 项目资源文档

> 面向无技术背景的读者与项目 Review 人员。  
> 在线站点：<https://wiki.tobenot.top/>  
> 代码仓库：<https://github.com/tobenot/Tobenot-Story-Wiki>

---

## 1. 这是什么

**Tobenot-Story-Wiki**（托贝诺特世界观 Wiki）是一个静态网站，用于整理、展示作者 Tobenot 多部原创小说/互动叙事作品的世界观设定。

它不是小说的在线阅读器，而是**百科式知识库**：

- 按人物、地点、事件、物品、概念等类型组织条目
- 按作品与篇章分层浏览
- 支持全文搜索
- 对剧情揭示提供剧透保护

内容以 Markdown 文件形式存放在仓库中，由前端在浏览器内加载并渲染。站点部署在 GitHub Pages，通过自定义域名 `wiki.tobenot.top` 访问。

---

## 2. 服务对象

| 读者类型 | 用途 |
|----------|------|
| 追更读者 | 查某角色是谁、什么能力、上次在哪出现 |
| 新读者 | 在不剧透的前提下了解设定骨架，判断是否入坑 |
| 作者本人 | 查设定、防矛盾、管伏笔与时间线 |
| 协作者 / Review 人员 | 评估内容完整度、结构合理性、技术实现 |

---

## 3. 内容宇宙（当前收录）

### 3.1 作品

| workId | 标题 | 状态 | 说明 |
|--------|------|------|------|
| `beyond-books` | 不止于纸上的故事 | 连载中 | 异能者保留地体系下的多篇章叙事 |
| `heartworld` | 心界录 | 连载中 | 围绕心界的长篇叙事，按六部分篇组织 |

### 3.2 篇章示例

**不止于纸上的故事** 当前有：

- **银月篇**（`silver-moon`）——内容最完整，含人物、事件、专题页（时间线、伏笔、多视角对比等）
- **规律篇**（`rule`）——建设中，含人物、事件、地点与专题页

**心界录** 按六部分篇划分（黑暗篇、圣地篇、风帆篇、星辉落篇、车辙篇、星辉篇），各篇多为骨架，正文持续建设中。

### 3.3 条目类型

| type | 中文 | 示例 |
|------|------|------|
| `characters` | 人物 | 罗伯特、银月 |
| `locations` | 地点 | 银月寺、心界边缘 |
| `events` | 事件 | 破晓行动、清扫行动 |
| `items` | 物品 | 折射、星链 |
| `concepts` | 概念 | 异能者、反模因 |
| `features` | 专题 | 篇章概览、时间线、伏笔索引 |

### 3.4 规模（约）

- Markdown 内容文件：约 130 个
- 全局权威条目（`globals/`）：人物 18、概念 9、地点 8、物品 4 等
- 图片资源：`public/images/`（角色立绘、作品封面等，WebP 格式）
- 主题聚合：1 个（异能者主题 `psionic`）

---

## 4. 信息架构

站点提供两种互补的浏览方式：

```
                    ┌─────────────┐
                    │   首页搜索   │
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌────────────┐  ┌────────────┐  ┌────────────┐
    │  作品/篇章  │  │  按类型聚合 │  │  主题面板  │
    │  （默认）   │  │ characters │  │  by-tags   │
    │            │  │ locations  │  │  / manual  │
    └────────────┘  └────────────┘  └────────────┘
```

### 4.1 作品/篇章（默认入口）

```
作品 (work)
 └── 篇章 (part)
      └── 条目 (entry)：人物 / 地点 / 事件 / …
```

示例路径：`#/works/beyond-books/parts/silver-moon`

### 4.2 全局权威 + 篇章页（双页模型）

跨篇章复用的实体（如罗伯特）有两套独立页面：

| 页面 | 路径示例 | 写什么 |
|------|----------|--------|
| 全局权威页 | `globals/characters/robert` | 跨篇章不变的设定：身份、外貌、异能机制、稳定关系网；剧透密度低 |
| 篇章页 | `works/beyond-books/parts/silver-moon/characters/robert` | 该实体在本篇的经历与揭示；自包含完整页；剧透块隔离转折 |

两页通过「全局权威 / 作品·篇章」标签互链，**不存在内容叠加**——各自渲染各自文件的 Markdown 正文。

### 4.3 外部原作链接策略

外部原作 URL **只**写在作品/篇章的 `index.md` 的 `links:` 字段中，页面上渲染为出站按钮。条目正文内引用原作时，链接到站内篇章页（如 `#/works/beyond-books/parts/silver-moon`），不硬编码外部 URL。原作换域名时只需改一处。

---

## 5. 核心功能

### 5.1 剧透保护

Markdown 正文中用 `:::spoiler` 块标记剧透段落：

```markdown
:::spoiler source="《不止于纸上的故事：银月篇》破晓行动"
剧透内容……
:::
```

- 默认磨砂遮罩，点击「查看剧透」后展开
- 悬停/展示 `source` 出处
- 页面级「我不怕剧透」开关可一次性展开当前页全部剧透
- 卡片层（`summary` / `role`）与 Lead 段要求无剧透

### 5.2 搜索

- 构建时生成 Lunr 全文索引（含中文分词）
- 产物：`public/search-index.json`、`public/search-map.json`
- 首页与顶栏提供全局搜索

### 5.3 主题聚合

`src/content/themes/<themeId>.md` 定义跨条目的主题面板：

- `strategy: by-tags` — 按标签自动聚合
- `strategy: manual` — 手动指定条目列表

### 5.4 站点统计

构建时扫描内容产出 `public/site-stats.json`，首页展示条目数、字数等统计。

### 5.5 图片

- 封面与角色图放在 `public/images/`
- 构建时生成缩略图（`scripts/build-thumbnails.js`）
- 正文内通过 `MarkdownImage` 组件加载，支持 `BASE_URL` 前缀

---

## 6. 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Vue 3 + TypeScript |
| 构建 | Vite 6 |
| 路由 | vue-router（Hash 模式，适配 GitHub Pages 静态部署） |
| 样式 | Tailwind CSS + `@tailwindcss/typography` |
| 内容格式 | Markdown + YAML frontmatter |
| Markdown 解析 | `marked`（运行时）、`remark`（构建时去标记） |
| 搜索 | Lunr + lunr-languages（中文分词，经 patch-package 修复） |
| 部署 | GitHub Actions → GitHub Pages |
| 域名 | `wiki.tobenot.top`（`public/CNAME`） |

无后端、无数据库。所有内容在构建/运行时从 Markdown 文件加载。

---

## 7. 仓库结构

```
Tobenot-Story-Wiki/
├── docs/                    # 项目文档（本目录）
├── design/                  # 初期策划案
├── public/                  # 静态资源（图片、搜索索引、统计、CNAME）
├── scripts/                 # 构建脚本（搜索索引、统计、缩略图）
├── patches/                 # lunr-languages 中文分词补丁
├── src/
│   ├── content/             # ★ 所有 Wiki 内容（Markdown）
│   │   ├── globals/         # 全局权威条目
│   │   ├── works/           # 作品与篇章
│   │   ├── themes/          # 主题定义
│   │   └── <type>/          # Legacy 结构（兼容，建议迁移）
│   ├── views/               # 页面组件（8 个）
│   ├── components/          # UI 与布局组件
│   ├── services/            # contentService.js（内容加载与索引）
│   ├── composables/         # useSearch.js 等
│   └── router/              # 路由定义
├── CONTENT_SPEC.md          # 内容质量标准
├── CONTENT_GUIDE.md         # 编辑实操指南
├── CLAUDE.md                # 开发者/AI 指引
└── README.md                # 结构与字段说明
```

---

## 8. 内容流水线

内容被两条路径消费，路径解析规则必须在两处保持一致：

| 阶段 | 文件 | 作用 |
|------|------|------|
| 运行时 | `src/services/contentService.js` | `import.meta.glob` 加载全部 `.md`，解析 frontmatter，构建内存索引，渲染页面 |
| 构建时 | `scripts/build-search-index.js` | 遍历内容，生成 Lunr 搜索索引 |
| 构建时 | `scripts/build-stats.js` | 生成站点统计 |
| 构建时 | `scripts/build-thumbnails.js` | 生成图片缩略图 |

`contentService.js` 构建的内存索引包含：

- `canonicalIndex` — `canonicalId` → 全局权威条目
- `typeIndex` — 按类型聚合，去重优先全局，记录 `appearances`
- `workIndex` / `partIndex` — 作品/篇章元信息与条目清单
- `themes` — 主题配置

---

## 9. 路由一览

| 路径 | 页面 |
|------|------|
| `/` | 首页（搜索、统计、分类入口） |
| `/works` | 作品列表 |
| `/works/:workId` | 作品详情 |
| `/works/:workId/parts/:partId` | 篇章详情 |
| `/category/:type` | 按类型聚合（characters / locations / …） |
| `/entry/:type/:id` | 条目详情（支持 `globals/...` 或 `works/.../parts/.../...`） |
| `/themes` | 主题列表 |
| `/theme/:themeId` | 主题详情 |

URL 使用 Hash 模式（`#/works/...`），无需服务器端路由配置。

---

## 10. 开发与部署

### 10.1 常用命令

```bash
npm install          # 安装依赖（postinstall 自动打补丁）
npm run dev          # 构建索引/统计/缩略图，启动开发服务器
npm run build        # 完整生产构建（含 vue-tsc 类型检查）
npm run preview      # 预览生产构建
npm run deploy       # 构建后 force-push dist/ 到 gh-pages 分支
npm run build:index  # 仅重建搜索索引
```

### 10.2 部署方式

1. **GitHub Actions**（推荐）：推送到 `main`/`master` 分支自动构建并部署到 GitHub Pages
2. **本地脚本**：`npm run deploy` 或 Windows 批处理 `commit-and-deploy.bat`

生产站点：<https://wiki.tobenot.top/>

### 10.3 质量检查

- 类型检查：`npm run build` 中的 `vue-tsc -b`
- 无独立测试框架与 linter
- 内容断链检查：见 `CONTENT_GUIDE.md` 中的校验脚本说明

---

## 11. 内容规范体系

| 文档 | 定位 |
|------|------|
| [README.md](../README.md) | 目录结构、frontmatter 字段、路由规则 |
| [CONTENT_SPEC.md](../CONTENT_SPEC.md) | 百科语体、条目评级（B 级准入线）、剧透分层 |
| [CONTENT_GUIDE.md](../CONTENT_GUIDE.md) | 双页分工、spoiler 分层线、标杆页、踩坑记录 |
| [CLAUDE.md](../CLAUDE.md) | 代码架构与开发约定 |

标杆条目：`globals/characters/robert.md` + `works/beyond-books/parts/silver-moon/characters/robert.md`

---

## 12. Review 清单

供无背景 Review 人员快速评估项目。

### 12.1 产品与内容

- [ ] 首页能否通过搜索或「作品分类」找到主要入口？
- [ ] 银月篇条目是否达到可读的百科水准（Lead、身份卡、剧透分层）？
- [ ] 全局页与篇章页分工是否清晰、无重复堆砌？
- [ ] 卡片摘要（`summary`）是否无剧透？
- [ ] 外部原作链接是否集中在 `index.md` 的 `links:`，正文无硬编码外链？
- [ ] 心界录等建设中篇章是否有明确标注？

### 12.2 功能

- [ ] 搜索能否找到主要角色与事件（含中文）？
- [ ] 剧透块默认遮挡，可单块展开，全局开关有效？
- [ ] 条目页的「全局权威 / 作品·篇章」互链是否正确？
- [ ] 图片是否正常加载（含封面缩略图）？
- [ ] 移动端布局是否可用？

### 12.3 技术

- [ ] `npm run build` 是否通过（含类型检查）？
- [ ] GitHub Actions 部署是否成功？
- [ ] 修改内容后搜索索引是否随 `dev`/`build` 自动更新？
- [ ] `patches/lunr-languages+1.14.0.patch` 是否存在（中文搜索依赖）？

### 12.4 文档

- [ ] 新协作者能否通过 `docs/` + `CONTENT_GUIDE.md` 上手写条目？
- [ ] 开发者能否通过 `CLAUDE.md` 理解架构？

---

## 13. 已知限制与待办

| 项 | 说明 |
|----|------|
| Legacy 内容 | `src/content/<type>/` 旧结构仍兼容，建议迁移到 `globals/` 或 `works/...` |
| `localNotes` 字段 | frontmatter 中存在但前端未读取，内容需写在正文里 |
| 心界录 | 多数篇章为骨架，内容持续建设中 |
| 测试 | 无自动化测试，依赖构建时类型检查与人工 Review |
| 中文分词 | 依赖 `patch-package` 修复 lunr-languages，勿删除 `patches/` |

---

## 14. 历史

项目起源于作者希望用 Vue 搭建世界观 Wiki 并部署到 GitHub Pages 的需求。初期策划见 [design/design.md](../design/design.md)，其中规划的剧透功能、Markdown 内容管理、分类浏览等均已实现；搜索、作品/篇章分层、主题聚合、双页模型等为后续演进加入。

---

## 15. 快速链接

| 资源 | 地址 |
|------|------|
| 在线 Wiki | <https://wiki.tobenot.top/> |
| GitHub 仓库 | <https://github.com/tobenot/Tobenot-Story-Wiki> |
| 银月篇原作（示例） | <https://tobenot.top/p/story-bb-silvermoon-director-cut/> |
