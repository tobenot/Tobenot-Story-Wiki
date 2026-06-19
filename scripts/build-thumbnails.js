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

for (const rel of sourceFiles) {
  if (path.basename(rel).toLowerCase() === PLACEHOLDER) {
    skipped++;
    continue;
  }

  const srcAbs = path.join(imagesDir, rel);
  const parsed = path.parse(rel);
  const thumbRel = path.join(parsed.dir, `${parsed.name}.webp`);
  const thumbAbs = path.join(thumbsDir, thumbRel);

  // 增量：源未变且缩略图存在则跳过
  try {
    const [srcStat, thumbStat] = await Promise.all([
      fs.promises.stat(srcAbs),
      fs.promises.stat(thumbAbs).catch(() => null),
    ]);
    if (thumbStat && thumbStat.mtimeMs >= srcStat.mtimeMs) {
      skipped++;
      continue;
    }
  } catch {
    // stat 失败则继续尝试转换
  }

  await fs.promises.mkdir(path.dirname(thumbAbs), { recursive: true }).catch(() => {});

  try {
    await sharp(srcAbs)
      .resize(SIZE, SIZE, { fit: 'cover', position: 'centre' })
      .webp({ quality: 75 })
      .toFile(thumbAbs);
    made++;
  } catch (err) {
    console.error(`[thumbs] 转换失败 ${rel}:`, err.message);
    failed++;
  }
}

console.log(`[thumbs] 生成 ${made}，跳过 ${skipped}，失败 ${failed}。`);
