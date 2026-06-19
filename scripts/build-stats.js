#!/usr/bin/env node
// 构建站点统计：扫描 src/content/**/*.md，产出 public/site-stats.json。
// 统计口径：
//   - 字数：正文（去掉 frontmatter 后）中的 CJK 汉字数。Markdown 语法符号多为 ASCII，
//     不影响 CJK 计数，因此不再额外 strip-markdown，与搜索索引流水线解耦、更快。
//   - 条目数：按 canonicalId（无则按 type:routeId）去重后的"实体"数；同时记录物理文件数。
//   - 分类：characters / locations / events / items / concepts 五类，分别给出去重实体数与字数。
//   - 作品/篇章/主题：分别计数。
// 路径派生与 contentService.js / build-search-index.js 保持一致——三者必须对齐。
import fs from 'fs';
import path from 'path';
import * as glob from 'glob';
import matter from 'gray-matter';

const contentDir = path.resolve(process.cwd(), 'src', 'content');
const publicDir = path.resolve(process.cwd(), 'public');
const outFilePath = path.join(publicDir, 'site-stats.json');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 与 build-search-index.js 的 deriveTypeAndFullId 同构。
// 返回 { kind, type?, fullId? }；kind ∈ entry | workIndex | partIndex | theme | unknown
function classify(fileRelativePath) {
  const parts = fileRelativePath.split(path.sep);

  // globals/<type>/<slug>.md
  if (parts[0] === 'globals' && parts.length >= 3) {
    return { kind: 'entry', type: parts[1], fullId: ['globals', ...parts.slice(2)].join('/').replace(/\.md$/, '') };
  }
  // works/<workId>/parts/<partId>/<type>/<slug>.md  (length 6)
  if (parts[0] === 'works' && parts.length >= 6 && parts[2] === 'parts') {
    const type = parts[4];
    const slug = parts[5].replace(/\.md$/, '');
    return { kind: 'entry', type, fullId: `works/${parts[1]}/parts/${parts[3]}/${slug}` };
  }
  // works/<workId>/index.md  -> ['works','<workId>','index.md']
  if (parts[0] === 'works' && parts.length === 3 && parts[2] === 'index.md') {
    return { kind: 'workIndex', workId: parts[1] };
  }
  // works/<workId>/parts/<partId>/index.md -> ['works','<workId>','parts','<partId>','index.md']
  if (parts[0] === 'works' && parts.length === 5 && parts[2] === 'parts' && parts[4] === 'index.md') {
    return { kind: 'partIndex', workId: parts[1], partId: parts[3] };
  }
  // themes/<themeId>.md
  if (parts[0] === 'themes' && parts.length === 2 && parts[1] !== 'index.md') {
    return { kind: 'theme', themeId: parts[1].replace(/\.md$/, '') };
  }
  // legacy: <type>/<slug>.md（排除 works/globals/themes）
  if (!['works', 'globals', 'themes'].includes(parts[0]) && parts.length >= 2) {
    const type = parts[0];
    const fullId = parts.slice(1).join('/').replace(/\.md$/, '');
    return { kind: 'entry', type, fullId };
  }

  return { kind: 'unknown' };
}

const TYPE_LABELS = {
  characters: '人物',
  locations: '地点',
  events: '事件',
  items: '物品',
  concepts: '概念',
};
const TYPE_ORDER = ['characters', 'locations', 'events', 'items', 'concepts'];

function countCJK(text) {
  const m = text.match(/[一-鿿]/g);
  return m ? m.length : 0;
}

function buildStats() {
  const files = glob.sync('**/*.md', { cwd: contentDir });
  console.log(`[stats] 扫描 ${files.length} 个 markdown 文件。`);

  const perTypeChars = {};      // type -> 累计字数（含全部物理文件）
  const perTypeEntities = {};   // type -> Set<entityKey>（去重）
  let totalChars = 0;
  let entryFileCount = 0;
  const workIds = new Set();
  const partKeys = new Set();
  let themeCount = 0;
  let lastUpdated = null;

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data: fm, content: body } = matter(raw);
    const info = classify(file);

    if (info.kind === 'entry') {
      entryFileCount++;
      const chars = countCJK(body);
      totalChars += chars;
      perTypeChars[info.type] = (perTypeChars[info.type] || 0) + chars;
      if (!perTypeEntities[info.type]) perTypeEntities[info.type] = new Set();
      const entityKey = fm.canonicalId || `${info.type}:${info.fullId}`;
      perTypeEntities[info.type].add(entityKey);

      if (fm.updatedAt) {
        const t = typeof fm.updatedAt === 'string' ? fm.updatedAt : new Date(fm.updatedAt).toISOString();
        if (t && (!lastUpdated || t > lastUpdated)) lastUpdated = t;
      }
    } else if (info.kind === 'workIndex') {
      workIds.add(info.workId);
    } else if (info.kind === 'partIndex') {
      partKeys.add(`${info.workId}/${info.partId}`);
      workIds.add(info.workId);
    } else if (info.kind === 'theme') {
      themeCount++;
      totalChars += countCJK(body);
    }
  }

  // 合计去重实体数
  let totalEntries = 0;
  const byType = TYPE_ORDER
    .filter((t) => perTypeEntities[t] || perTypeChars[t])
    .map((t) => {
      const count = perTypeEntities[t] ? perTypeEntities[t].size : 0;
      totalEntries += count;
      return {
        type: t,
        label: TYPE_LABELS[t] || t,
        count,
        chars: perTypeChars[t] || 0,
      };
    });

  // 兜底：works/parts 计数以物理 index.md 为准（缺 index 的作品不计入）。
  const stats = {
    generatedAt: new Date().toISOString(),
    totalChars,
    totalEntries,
    entryFiles: entryFileCount,
    works: workIds.size,
    parts: partKeys.size,
    themes: themeCount,
    byType,
    lastUpdated,
  };

  fs.writeFileSync(outFilePath, JSON.stringify(stats, null, 2));
  console.log(`[stats] 写入 ${outFilePath}`);
  console.log(`[stats] 字数 ${totalChars} / 实体 ${totalEntries} / 文件 ${entryFileCount} / 作品 ${workIds.size} / 篇章 ${partKeys.size} / 主题 ${themeCount}`);
}

try {
  buildStats();
} catch (err) {
  console.error('[stats] 构建失败：', err);
  process.exit(1);
}
