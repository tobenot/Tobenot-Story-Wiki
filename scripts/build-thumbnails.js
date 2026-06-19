#!/usr/bin/env node
// 为站内链接缩略图生成 48px 方形 webp 缩略图。
// 输入：public/images/**/*.{webp,png,jpg,jpeg,gif}
// 输出：public/images/thumbs/<相同相对路径>.webp（扩展名统一为 .webp）
// 增量：缩略图已存在且 mtime 不早于源图时跳过。
// 占位图 no_image.png 不生成（前端按规则回退到类型图标）。
import fs from 'fs';
import path from 'path';
import * as glob from 'glob';
import sharp from 'sharp';

const imagesDir = path.resolve(process.cwd(), 'public', 'images');
const publicDir = path.resolve(process.cwd(), 'public');
const thumbsDir = path.join(imagesDir, 'thumbs');
const PLACEHOLDER = 'no_image.png';

const SIZE = 48;

if (!fs.existsSync(imagesDir)) {
  console.log('[thumbs] public/images 不存在，跳过。');
  process.exit(0);
}
if (!fs.existsSync(thumbsDir)) {
  fs.mkdirSync(thumbsDir, { recursive: true });
}

const sourceFiles = await glob.glob('**/*.{webp,png,jpg,jpeg,gif}', {
  cwd: imagesDir,
  nodir: true,
  ignore: ['thumbs/**'],
});

let made = 0;
let skipped = 0;
let failed = 0;

// image 原始路径 -> 内联 base64 data URI（供 wikilink 缩略图零请求渲染）
const linkThumbsMap = {};

for (const rel of sourceFiles) {
  if (path.basename(rel).toLowerCase() === PLACEHOLDER) {
    skipped++;
    continue;
  }

  const srcAbs = path.join(imagesDir, rel);
  const parsed = path.parse(rel);
  const thumbRel = path.join(parsed.dir, `${parsed.name}.webp`);
  const thumbAbs = path.join(thumbsDir, thumbRel);

  // 增量：源未变且缩略图存在则跳过重新生成（但下面仍需读取其 buffer 用于内联表）
  let needsRegen = true;
  try {
    const [srcStat, thumbStat] = await Promise.all([
      fs.promises.stat(srcAbs),
      fs.promises.stat(thumbAbs).catch(() => null),
    ]);
    if (thumbStat && thumbStat.mtimeMs >= srcStat.mtimeMs) {
      needsRegen = false;
    }
  } catch {
    // stat 失败则继续尝试转换
  }

  await fs.promises.mkdir(path.dirname(thumbAbs), { recursive: true }).catch(() => {});

  try {
    let buffer;
    if (needsRegen) {
      buffer = await sharp(srcAbs)
        .resize(SIZE, SIZE, { fit: 'cover', position: 'centre' })
        .webp({ quality: 75 })
        .toBuffer();
      await fs.promises.writeFile(thumbAbs, buffer);
      made++;
    } else {
      buffer = await fs.promises.readFile(thumbAbs);
      skipped++;
    }
    // 以原始 image 路径为键，便于运行时按条目 image 直接查表
    linkThumbsMap[`/images/${rel.replace(/\\/g, '/')}`] =
      `data:image/webp;base64,${buffer.toString('base64')}`;
  } catch (err) {
    console.error(`[thumbs] 转换失败 ${rel}:`, err.message);
    failed++;
  }
}

// 写出内联缩略图映射表（派生产物，由前端按需 fetch）
const linkThumbsPath = path.join(publicDir, 'link-thumbs.json');
await fs.promises.writeFile(linkThumbsPath, JSON.stringify(linkThumbsMap));

const mapKb = Math.round(Buffer.byteLength(JSON.stringify(linkThumbsMap)) / 1024);
console.log(`[thumbs] 生成 ${made}，跳过 ${skipped}，失败 ${failed}。内联表 link-thumbs.json 约 ${mapKb}KB。`);

