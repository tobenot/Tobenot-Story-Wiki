#!/usr/bin/env node
// 一次性工具：把 AI 生成的注水/剧透条目正文替换为占位说明，并写入 placeholder: true。
// 保留 frontmatter（title/canonicalId/role/chapters/related 等索引数据）。
// 不影响 index.md、globals、themes 与心界录。
import fs from 'fs';
import path from 'path';
import * as glob from 'glob';
import matter from 'gray-matter';

const PART_DIRS = [
  'src/content/works/beyond-books/parts/silver-moon',
  'src/content/works/beyond-books/parts/rule',
];

// 根目录 legacy 布局的 AI 生成条目（无 canonicalId，与 globals 重复的低质量版）
const LEGACY_FILES = [
  'src/content/events/beyond-books-silver-moon.md',
  'src/content/events/beyond-books-timeline.md',
  'src/content/events/silvermoon/clean-up-action.md',
  'src/content/events/silvermoon/dawn-action.md',
  'src/content/concepts/abnormal-powers.md',
  'src/content/concepts/bailisi.md',
  'src/content/concepts/evil-hunter.md',
  'src/content/concepts/reservation.md',
  'src/content/concepts/spirit-shield.md',
  'src/content/items/reflection.md',
  'src/content/items/starlink.md',
  'src/content/locations/penetrating-autumn-water.md',
  'src/content/locations/silver-moon-temple.md',
];

const PLACEHOLDER_BODY = '> 占位：正文待作者手写。\n';

function collect() {
  const files = [];
  for (const dir of PART_DIRS) {
    for (const f of glob.sync('**/*.md', { cwd: dir })) {
      if (f.endsWith('index.md')) continue;
      files.push(path.join(dir, f));
    }
  }
  files.push(...LEGACY_FILES);
  return files;
}

let changed = 0;
let skipped = 0;
for (const file of collect()) {
  const raw = fs.readFileSync(file, 'utf-8');
  const { data, content } = matter(raw);
  const body = content.trim();
  if (data.placeholder === true && body === PLACEHOLDER_BODY.trim()) {
    skipped++;
    continue;
  }
  data.placeholder = true;
  fs.writeFileSync(file, matter.stringify(PLACEHOLDER_BODY, data));
  console.log(`strip ${file}  (${body.split('\n').length} 行正文 → 占位)`);
  changed++;
}
console.log(`\n共 strip ${changed} 个，已占位跳过 ${skipped} 个。`);
