# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

# 索引bug修复
方案1：直接修改 lunr.zh.js 文件（快速但不推荐的解决方法）
这种方法不是工程实践的最佳方式，但可以快速解决问题：

修改 node_modules/lunr-languages/lunr.zh.js 文件：
找到文件中加载 @node-rs/jieba 的行（大约在第33行）

将 require('@node-rs/jieba') 改为 require('nodejieba')
保存文件后再次尝试构建索引

# json编辑
https://jsoneditoronline.org/#left=local.gijoyi

## 内容结构与配置指南

本项目采用“按作品/篇章为主 + 全局权威条目 + 主题聚合”的信息架构，同时保留按类型（人物/地点/事件/物品/概念）的聚合与检索。

### 目录结构
- 全局权威条目（跨作品复用的唯一真源）
  - `src/content/globals/{characters,locations,events,items,concepts}/<slug>.md`
- 作品与篇章
  - `src/content/works/<workId>/index.md`（作品元信息）
  - `src/content/works/<workId>/parts/<partId>/index.md`（篇章元信息）
  - `src/content/works/<workId>/parts/<partId>/{characters,locations,events,items,concepts}/<slug>.md`（篇章上下文条目）
- 主题聚合面板
  - `src/content/themes/<themeId>.md`

注意：仍兼容 legacy 结构 `src/content/<type>/<id>.md`，但推荐向上面的新结构迁移。

### frontmatter 规范
- 全局权威条目（globals/...）
  - 必填：`title`, `type`（`characters|locations|events|items|concepts`）, `canonicalId`（如 `character.robert`）
  - 选填：`summary`, `aliases`, `tags`, `image`, `related`（`canonicalId` 列表）
- 作品与篇章元信息
  - 作品 `works/<workId>/index.md`
    - `workId`, `title`, `description?`, `status?`, `order?`, `year?`, `tags?`, `links?`
  - 篇章 `works/<workId>/parts/<partId>/index.md`
    - `workId`, `partId`, `title`, `description?`, `order?`, `timeline?`, `tags?`, `links?`
- 篇章内条目
  - 必填：`title`, `type`, `canonicalId?`（若有对应全局权威则填写）
  - 选填：`localNotes`, `tags`, `role?`, `firstSeenAt?`, `lastSeenAt?`, `chapters?`, `image?`
  - 建议：正文尽量精简；页面展示时优先渲染 `canonicalId` 的全局权威正文，再叠加 `localNotes` 等篇章差异。
- 主题 `themes/<themeId>.md`
  - 必填：`title`, `description?`, `strategy`（`by-tags` | `manual`）
  - `by-tags`：`include: { types?: string[], tags?: string[] }`
  - `manual`：`items: string[]`（支持 `canonicalId` 或 `workId/partId/type/slug` 路径）

### 路由与页面
- 按类型聚合：`/category/:type`
- 条目详情（兼容新旧结构）：`/entry/:type/:id`
  - 新结构的 `id` 可为：`globals/<slug>` 或 `works/<workId>/parts/<partId>/<slug>`
- 作品视图：
  - 作品索引：`/works`
  - 作品详情：`/works/:workId`
  - 篇章详情：`/works/:workId/parts/:partId`
- 主题视图：
  - 主题索引：`/themes`
  - 主题详情：`/theme/:themeId`

### 索引与去重
- 系统构建统一索引：
  - `canonicalIndex`：`canonicalId -> 权威条目`
  - `typeIndex`：按类型聚合，去重优先显示全局权威；同时统计 `appearances`（出现于哪些作品/篇章）
  - `workIndex`、`partIndex`：作品/篇章元信息与条目清单
  - `themes`：主题配置与正文
- 详情页渲染规则：优先渲染全局权威正文；若从篇章入口进入，附加该篇章的 `localNotes/role/...` 差异。

### 命名与规范建议
- `workId`、`partId`、`slug` 使用 kebab-case（英文/拼音）
- `canonicalId` 使用点分式：如 `character.robert`、`location.silver-temple`
- 常驻实体应在 `globals/*` 建权威条目；篇章内以 `canonicalId` 引用并填写 `localNotes`

### 搜索
- 构建时生成 `public/search-index.json` 与 `public/search-map.json`（Lunr + 中文支持）
- 已适配新结构：支持搜索到 globals 与 works/parts 下的条目

### 迁移建议
- 将“作品概览/时间线”迁移到 `works/<workId>/index.md` 与 `parts/<partId>/index.md`
- 将复用实体迁移/新增到 `globals/*`，篇章内创建引用条目（附 `canonicalId`）
- 仅此篇章的实体可先只存在于篇章内；后续复用时再抽取到 `globals` 并填 `canonicalId`

以上为核心结构与使用说明。如需批量迁移与校验脚本（检查重复 `canonicalId`、断链等），可继续补充。

## 心界录配置示例（Works/Parts + Globals 引用）

- **作品**：`src/content/works/heartworld/index.md`
  - `workId: "heartworld"`, `title: "心界录"`
- **篇章**：
  - `src/content/works/heartworld/parts/holy-land-lavender/index.md`
    - `partId: "holy-land-lavender"`, `title: "圣地篇·薰衣草"`, `order: 1`
  - `src/content/works/heartworld/parts/sails/index.md`
    - `partId: "sails"`, `title: "风帆篇"`, `order: 2`
- **篇章内引用条目（示例）**：
  - `src/content/works/heartworld/parts/holy-land-lavender/characters/golden.md`
    - `type: "characters"`, `canonicalId: "character.golden"`, `role`, `localNotes`
  - `src/content/works/heartworld/parts/sails/characters/golden.md`
  - `src/content/works/heartworld/parts/sails/characters/luobei.md`

页面：
- 作品详情：`/works/heartworld`
- 篇章详情：`/works/heartworld/parts/holy-land-lavender`、`/works/heartworld/parts/sails`