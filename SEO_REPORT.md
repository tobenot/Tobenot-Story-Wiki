# SEO 诊断报告 — Tobenot-Story-Wiki

> 检测样本：`https://wiki.tobenot.top/#/entry/characters/works/beyond-books/parts/silver-moon/joan`
> 检测日期：2026-06-20
> 状态：**仅诊断记录，未做任何改动**

## 一、核心结论（先看这条）

检测工具读到的是 **静态 `index.html` 的站点级默认卡片**，而非「琼（银月篇）」条目级 meta。证据：报告显示 `og:title = "托贝诺特世界观 Wiki"`（12 字符，正是站点默认值），而不是条目标题。

根本原因：
- 站点用 `createWebHashHistory`（`src/router/index.ts`），所有 `/#/...` 路由对外是**同一个 `index.html`**。
- 不执行 JS 的爬虫（Twitter / 微信 / 链接预览机器人）只能读到静态 HTML。
- `usePageMeta`（`src/composables/usePageMeta.js`）里的条目级覆盖**只在执行 JS 的浏览器里生效**，对链接预览不可见。

因此报告里的 6 个问题分两层：**静态默认层**（影响所有页面，可低成本立即修复）与**条目级架构层**（需要预渲染才能让每个条目有独立卡片，成本高）。

## 二、问题清单与归因

| # | 检测项 | 报告值 | 目标 | 归因层 | 根因 |
|---|---|---|---|---|---|
| 1 | og:image 比例 | 451×451（正方） | 1.91:1（1200×630） | 静态默认 | `public/amber.jpg` 是方形图 |
| 2 | og:image 无标题 | 无文字 | 含 headline | 静态默认 | 图上没叠文字 |
| 3 | og:image 无 CTA | 无 | 含 CTA | 静态默认 | 同上 |
| 4 | og:description | 22 字符 | 80–125 | 静态默认 | `index.html` L15 默认文案过短 |
| 5 | title（SERP） | 13 字符 | 50–60 | 静态默认 | `index.html` L7 `<title>` 过短 |
| 6 | meta description | 37 字符 | 120–160 | 静态默认 | `index.html` L8 过短 |
| ✅ | og:title 长度 | 12 字符 | ≤60 | — | 合格 |
| ✅ | og:image 可加载 | 34KB jpg | — | — | 合格 |
| ✅ | twitter:card | summary_large_image | — | — | 合格 |
| ✅ | og:site_name | 已设置 | — | — | 合格 |

**注意：** 报告里 og:description「22 字符」与 `index.html` L15 文案「人物、地点、事件、物品与概念的世界构建百科。」（约 22 字）吻合 —— 再次证明爬虫读的是静态默认值，不是条目 summary。

## 三、两层修复方案

### 第一层：静态默认层（低成本、立即见效、影响全站）

这一层能解决 #1–#6 全部 6 项，但卡片是**站点通用**的，不会随条目变化。

1. **生成 1200×630 OG 图**（项目已装 `sharp`，见 `scripts/build-thumbnails.js` 的用法）
   - 用 `sharp` 把 `public/amber.jpg` 合成一张 1200×630、叠加站点标题文字 + 一句 CTA 的 `public/og-image.jpg`。
   - `index.html` 的 `og:image` / `twitter:image` 指向它。
   - 这一次性解决 #1 / #2 / #3。

2. **改写 `index.html` 默认文案**（解决 #4 / #5 / #6）
   - `<title>`：扩充到 ~55 字符，例如 `托贝诺特世界观 Wiki — 人物、地点、事件、物品与概念的世界构建百科`。
   - `meta name="description"`：扩到 ~130 字符。
   - `og:description` / `twitter:description`：同步扩到 80–125 字符。
   - `usePageMeta.js` 的 `DEFAULT_DESCRIPTION` 同步更新（保持一致）。

### 第二层：条目级架构层（高成本、才能让每个条目有独立卡片）

如果目标是「琼（银月篇）」这类条目页在微信/Twitter 分享时显示自己的标题、摘要、配图，仅改静态默认值不够 —— 必须让爬虫读到**每个路由各自的静态 HTML**。两条路：

- **A. 切到 `createWebHistory` + 构建期预渲染**：为每个条目路由生成独立静态 HTML（注入条目级 og:title/og:description/og:image）。代价：现有 `/#/...` 分享链接全部失效，需要做重定向。
- **B. 维持 hash 路由 + 外部分享代理**：用一个云函数/中间页按 query 参数动态吐 meta。代价：多一层基础设施。

**建议：** 先做第一层（立刻拿下 6 项、零架构风险），第二层按实际分享需求再决定是否投入。

## 四、关键文件索引

| 文件 | 作用 |
|---|---|
| `index.html` L7–L24 | 静态默认 title/description/og/twitter meta（爬虫实际读到的就是这里） |
| `src/composables/usePageMeta.js` | 运行时条目级 meta 覆盖（仅 JS 环境可见） |
| `src/views/EntryPage.vue` L273–L285 | 调用 `usePageMeta`，传 `title/summary/image` |
| `src/router/index.ts` | `createWebHashHistory` —— 第二层架构的症结 |
| `public/amber.jpg` | 当前 og:image（451×451 方形，34KB） |
| `scripts/build-thumbnails.js` | `sharp` 用法参考，可复用其模式生成 OG 图 |

## 五、待办（未执行，仅记录）

- [ ] 第一层-1：用 `sharp` 生成 1200×630 `public/og-image.jpg`（叠标题+CTA）
- [ ] 第一层-2：更新 `index.html` 的 title/description/og:image 到新图与新文案
- [ ] 第一层-3：同步 `usePageMeta.js` 的 `DEFAULT_DESCRIPTION`
- [ ] （可选）第二层：评估 `createWebHistory` + 预渲染的迁移成本与旧链接兼容
