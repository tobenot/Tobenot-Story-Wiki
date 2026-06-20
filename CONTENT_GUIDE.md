# 内容编辑实操指南（CONTENT_GUIDE）

> 本文件是给**动手写条目的人**（编辑者、后来者、AI 协作者）的实操经验沉淀。
> 它与另外三份文档互补：
> - [CLAUDE.md](./CLAUDE.md) 讲代码架构与命令；
> - [CONTENT_SPEC.md](./CONTENT_SPEC.md) 讲内容质量标准与评级；
> - [README.md](./README.md) 讲字段定义与路径结构。
>
> 本文件讲**「动手写时怎么不踩坑」**——来自一次性补完银月篇 35+ 条目的实战经验。

---

## 0. 写之前：先读两样东西

1. **标杆页**：`src/content/globals/characters/robert.md` 与其篇章页 `works/beyond-books/parts/silver-moon/characters/robert.md`。这两页是 B 级范例，照它的骨架填即可，不要自创结构。
2. **原始素材**：先把小说正文通读一遍（如 `story/story-bb-silvermoon-director-cut.md`）。wiki 的可信度建立在可溯源上，没读原文就写会退化成臆测。

---

## 1. 两页分工（最容易搞混，先记死）

跨篇章复用的实体要建**两页**，职责严格不重叠：

| | 全局页 `globals/<type>/<slug>.md` | 篇章页 `works/<workId>/parts/<partId>/<type>/<slug>.md` |
|---|---|---|
| **写什么** | 不变的东西：身份、外貌、性格、异能机制、稳定关系网 | 这一篇发生了什么：经历、揭示、本篇关系动态 |
| **剧透密度** | 低（设定真源） | 高（核心转折在 `:::spoiler` 里，其余可读叙述留明面） |
| **Lead 视角** | 现实视角：「X 是《…》中的角色」 | 现实视角：「X 是《…：银月篇》中的角色」 |
| **互链** | 「登场作品」链篇章页 | 「出处」链全局页 |

**铁律**：全局页 Lead 用**公开身份**（如珂茵=银月寺保安），真实身份/反转（卧底、被重创、选中者）一律进 `:::spoiler`。身份层（Lead/身份卡）默认无剧透——这是规范 §5.1 的硬要求。

**反例**：别把单篇剧情塞进全局页，也别把跨篇章设定复制进每个篇章页。这是 CONTENT_SPEC §7 第 4 条明令禁止的反模式。

---

## 2. 篇章页的「本篇定位」节（非剧透过渡层）

篇章页从「身份卡」直接跳进全是 spoiler 的「经历」会让未读读者两层间什么也得不到。在两者之间加一节**「本篇定位」**：

- 写这个角色/实体在本篇**结构里扮演什么**、牵动哪条线——不剧透结果。
- 全局页的安全层是「性格/能力」（不变的设定）；篇章页的安全层是「本篇定位」（本篇的角色功能与行动脉络）。两者不重叠，正好补上中间空档。

参考罗伯特（银月篇）页的「本篇定位」：点明明线（守卫折射）与暗线（追查异常），但不写谁失去异能、谁被重创。

---

## 3. 剧透分层实操

| 层 | 位置 | 怎么写 |
|---|---|---|
| **卡片层** | `summary`/`description`/`role` | 绝对无剧透；`summary` **纯文本无 Markdown**、一句话。注意：`summary` 会出现在卡片/列表/搜索预览，读者点开页面前就看得到——别塞「首次 XX」「主导 XX 大事件」这类暗示门槛级转折的措辞。 |
| **身份层** | Lead、身份卡、小节标题 | 默认无剧透；不设「状态/生死」字段（见下）。**小节标题要去转折化**——别叫「补述穿越者来历」，叫「茶水间谈话」。标题是块外可见的，破梗等同正文破梗。 |
| **正文层** | 经历/经过/揭晓 | **门槛级转折进 `:::spoiler`，其余可读叙述留明面**（见下「分层线」）。`source` 必填。 |

### 分层线（最重要的一条）

剧透保护不是「正文全进黑块」——那是上一版的铁律，已废。那样读者点进来看到一片折叠区，对未读读者不友好，对已读读者全是复述没增量。

正确的分层线是：**凡「某事件启动后发生的转折性结果」进块，块外只留「他是谁、做什么岗位、非转折的经过」。**

判定一句该不该进块，问一个问题：「读者读到此处，是否被夺走了一个本该在原文里等到的转折？」是→进块。

- 进块的：实验中止、出现穿越者、自愈/来自未来、改变过去、误入规律机构、角色死亡/重创/反转。
- 留明面的：身份岗位、外貌、迎新、递地图睡午休、论文出处问答、稳定的性格与关系模式。

### 防雷：别「外重内轻」倒置

最常见的翻车：明面段落把转折全说了，spoiler 块里只剩一句次要设定——块形同虚设。写完逐块检查：**块外有没有把块内藏的内容提前说完？** 有，就把那部分移进块，或把明面句改成中性。

配套两招：
- **引导句中性化**：块前一句只引到「谈起当天的事」，不提「转述了穿越者来历」。
- **本篇定位当过渡层，不当概述**：写角色在本篇的功能与行动脉络（「主导实验、信息中转」），结果性转折用「详见下文剧透块」收尾，不点破。

### spoiler 语法

```markdown
:::spoiler source="《不止于纸上的故事：银月篇》破晓行动"
剧透内容……
:::
```

`source` 写作品·篇章·（可选）章节/场景。臆测标注 `（推测）`，不得与事实混排。

### 元数据层的轻微暗示（可容忍）

`summary`、`related`、`firstSeenAt`/`chapters` 这些元数据会在 spoiler 未展开时露出，可能轻微暗示转折（如 `related` 列出「穿越者」就暗示二者有关联）。这是 wiki 的通病——关联本身就是元信息。**多数项目选择容忍**；若你的读者群对卡片预览/关联列表也敏感，再单独收 `summary` 措辞或给 related 剧透项折叠。现状下不强制处理。

### 「状态」字段别写

旧 stub 里有 `状态：存活` 这种字段——它踩了规范自己的雷：身份层写生死即剧透（对会死的角色你只能写「死亡」，更剧透）。**直接删掉**，命运转折留给正文 spoiler。CONTENT_SPEC §4.1 已据此移除该字段。

---

## 4. frontmatter 必查项

每写完一条，对照检查：

- `type`：**英文枚举**（`characters|locations|events|items|concepts`）。写成中文（`"事件"`）会坏 typeIndex。
- `canonicalId`：点分式，前缀按类型：`character.`/`location.`/`event.`/`item.`/`concept.`。全局页必填，篇章页也填（指向全局设定页建互链）。
- `related`：**canonicalId 列表**，不要写中文名（断链）。
- `summary`：纯文本、无 Markdown、无剧透、一句话。
- 篇章页字段：`role`/`firstSeenAt`/`chapters`/`order`（事件用）。`localNotes` 前端不读，需要展示的内容写正文。
- `image`：`/images/<type>/<sub>/<slug>.webp`。无图用 `/images/no_image.png`。

---

## 5. 新建类型目录无需改代码

`contentService.js` 的 `parsePathForEntry` 和 `scripts/build-search-index.js` 的 `deriveTypeAndFullId` 都是**类型无关**的——`<type>` 是任意目录名。所以新建 `locations/`、`events/`、`concepts/`、`items/` 目录直接放文件即可，路由与索引自动解析：

- 全局：`globals/<type>/<slug>.md` → 路由 `#/entry/<type>/globals/<slug>`
- 篇章：`works/<workId>/parts/<partId>/<type>/<slug>.md` → 路由 `#/entry/<type>/works/.../parts/.../<slug>`

**唯一例外**：若引入全新的内容布局约定（不止是新 type 目录），才需要同步改这两个文件的路径解析，且二者必须一致（CLAUDE.md 有强调）。

---

## 6. 重命名 canonicalId 的正确流程

改 slug/canonicalId（如 `jerry` → `jerris`）时，要同步改三处，否则断链：

1. 文件名（`.md`）——用 `git mv` 保留历史。
2. 图片文件（`.webp`）——同样 `git mv`，并更新 frontmatter 的 `image` 路径。
3. frontmatter 的 `canonicalId` 值。
4. 全局 grep 该旧 slug，更新所有 `related` 引用与 `[[old-id|...]]` 双链。

改完跑断链校验脚本（见 §9）确认无遗留。

---

## 7. 各类型条目的章节骨架

### 人物 characters
Lead → 身份卡 → 外貌 → 性格 → 能力与异能（每个异能一个 `###`：名称/机制/战术应用/限制与代价/武器配合）→ 经历（篇章页，门槛级转折入 spoiler、其余明面叙述，见 §3）→ 人际关系（每个关系一个 `###`，标关系类型，链 canonicalId）→ 登场作品/出处。

> Lead + 身份卡 + 外貌 + 性格 + 能力 + 经历 是人物 B 级最低章节集。

### 地点 locations
Lead → 身份卡（类别/位置/归属/重要性）→ 地理与设施 → 历史 → 居民与势力（链接）→ 战略与剧情意义（spoiler）→ 出处。

### 事件 events
Lead（**只交代背景与性质，不剧透结果**）→ 身份卡（时间/地点/双方/性质）→ 起因 → 经过（全进 spoiler，可按场景分子节）→ 结果与影响（spoiler）→ 关联事件（因果链互链）→ 出处。用 `order` 字段标时间线顺序。

### 物品 items
Lead → 身份卡（类别/来源/当前持有者）→ 属性与能力 → 已知持有者（链接）→ 剧情作用（spoiler）→ 出处。

### 概念 concepts
Lead → 定义 → 机制 → 世界内规则/社会影响 → 实例列举（链接）→ 出处。概念页是**设定词典**，保持中立无剧透，具体角色剧情只链接不展开。

---

## 8. 语体（百科化）

- 第三人称；设定现在时（「罗伯特是银月寺保安」），已发生剧情过去时。
- Lead 与「轶事」节用现实视角（「X 是……中的角色」）；设定正文用世界观内视角。
- 克制不夸饰：「超强异能」→「可停止时间的异能」；「帅气击败」→「在时停中制服」。
- 禁第一人称/读者称呼（「我们」「你」「小编」）。
- 散文优先，bullet 仅用于并列条目（能力清单、出场表、身份卡字段）。

---

## 9. 收尾必做：校验

### 重建搜索索引
```bash
npm run build:index   # dev/build 会自动触发，手动改完也可单独跑
```

### 断链校验脚本
`related` 引用的 canonicalId 必须有对应定义。一键校验：

```bash
node -e '
const fs=require("fs"),path=require("path");
const files=[];
(function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith(".md"))files.push(p);}})("src/content");
const fm=s=>{const m=s.match(/^---\n([\s\S]*?)\n---/);return m?m[1]:"";};
const get=(fmd,k)=>{const m=fmd.match(new RegExp("^"+k+":\\s*(.+)$","m"));return m?m[1].trim():null;};
const defined=new Set(),refs=[];
for(const fp of files){const s=fs.readFileSync(fp,"utf8");const cid=get(fm(s),"canonicalId");if(cid)defined.add(cid.replace(/^["\x27]|["\x27]$/g,""));}
for(const fp of files){const fmd=fm(fs.readFileSync(fp,"utf8"));const rm=fmd.match(/^related:\s*\n([\s\S]*?)(?=\n\S|\n---|$)/m);if(rm)for(const line of rm[1].split("\n")){const mm=line.match(/^\s*-\s*"([^"]+)"/);if(mm)refs.push(mm[1]);}}
const dangling=refs.filter(r=>!defined.has(r));
console.log("defined:",defined.size,"refs:",refs.length);
dangling.length?console.log("DANGLING:",dangling):console.log("No dangling related links ✓");
'
```

> 建议把这段沉淀成 `scripts/check-links.js` 并接进 `npm run build`（CONTENT_SPEC §8 末尾的 TODO 即此）。在那之前，手动跑即可。

### 自评清单（CONTENT_SPEC §8）
逐条过：有独立 Lead、身份卡齐全、type 英文、related 无断链、summary 无剧透、spoiler 有 source、全局/篇章职责不混、语体百科化、复用实体已建 globals/*、自评 ≥ B。

---

## 10. 实战经验（一次性补完银月篇的踩坑记录）

- **先 harvest 再批量写**：旧 stub 里常有作者已设定的外貌/性别/异能名等（如琼的【冰雪风暴】、艾琳的【鲸歌海铭】、克莱门特【衔羽展翼】长锤）。动手前把所有相关 stub 一次读全，整合进新页，别覆盖丢弃原作者设定。
- **跨篇章反转角色的 Lead 用公开身份**：珂茵（卧底）、杰瑞斯（罪恶猎手里的异能者）、田中连（被重创）——Lead 都写「表面身份」，真相进 spoiler。这是本篇最大的剧透雷区。
- **真品/赝品机制要写清**：本篇有【折射】（真品去向成谜）、【贪婪】（杰瑞斯调包、田中连拿赝品）两条「假货」线，物品条目里必须明确区分真品与赝品的归属，否则读者会混乱。
- **事件互链成因果链**：事件页之间用 `[[event.xxx|...]]` 互链（破晓→森林追击→望穿秋水会战→清扫），形成可顺读的因果链，比孤立事件页价值大得多。
- **未单独建条目的事件别留断链**：若某事件与另一条目重叠、决定不单建（如「贝利斯使者来索要折射」并入破晓行动起因），务必清掉所有对它的 `[[...]]` 引用，改为主条目内自述。断链校验脚本会抓住。
- **图片文件名与 slug 一致**：部分旧图用下划线（`tanaka_ren.webp`），frontmatter `image` 路径要照搬，别想当然改连字符。
- **「状态」字段全网删过一次**：旧 stub 普遍有 `状态：存活`，迁移时统一删除，规范同步移除该字段要求。新写条目不要再加回来。
- **golden.md / luobei.md 是其他篇章 stub**：非本篇范围，未动。处理新篇章时再补。

---

## 11. 可做未做（留给后来者）

- **链接策略**：站内链接原窗口、站外链接新窗口。需改 `contentService.js` 的 marked 渲染器，给 `http(s)://` 外链加 `target="_blank" rel="noopener"`，站内 `#/...` 不动。这是通用 wiki 惯例。
- **校验脚本入库**：把 §9 的断链脚本沉淀为 `scripts/check-links.js` 并接进 `npm run build`。
- **工具型页面**：篇章概览、时间线、伏笔与悬念追踪、多视角事件对照四页已落地于银月篇，统一用新建的 `features` 类型承载（见下）。异能图鉴、势力关系图等暂未做，按需取用。

#### 工具型页面与 `features` 类型

工具/专题页（时间线、伏笔追踪、多视角对照、篇章概览等）不是某个实体的设定页，而是**分析型长文**，剧透密度高、需 `:::spoiler` 与 `[[wikilink]]`。因此它们不进 `concepts`（概念页是中立无剧透的设定词典），而是用独立的 `features` 类型承载：

- 路径：`works/<workId>/parts/<partId>/features/<slug>.md`（篇章级专题），或 `globals/features/<slug>.md`（跨篇章专题）。
- `type: "features"`、`canonicalId` 前缀 `feature.`（如 `feature.silver-moon-timeline`），以便互相 `[[wikilink]]`。
- 渲染走现成的 `EntryPage` 管线（spoiler/wikilink/TOC/related 全可用），**无需改 contentService 或 router**——`<type>` 是任意目录名（见 §5）。
- 发现性：篇章页（`PartDetailPage`）会自动按类型列出「专题」分节；篇章概览页作为门面，链向其余工具页。`EntryPage` 面包屑与 `PartDetailPage` 分节标题已加 `features → 专题` 显示名映射；其余视图对未知类型回退为「内容」/原 slug，可按需补映射。
- 银月篇四页位于 `works/beyond-books/parts/silver-moon/features/`：`silver-moon-overview`（门面）、`silver-moon-timeline`、`silver-moon-foreshadowing`、`silver-moon-perspective-comparison`，互链成网。
