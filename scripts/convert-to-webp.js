/**
 * 一次性图片转 WebP 脚本。
 *
 * 扫描 public/images 下的 png/jpg/jpeg，以质量 80 转 WebP，
 * 输出同名 .webp 到同目录后删除原文件。
 *
 * 排除（保留原格式）：
 *   - no_image.png / characters/no_image.png  —— 前端 fallback 占位图
 *   - amber.jpg                               —— favicon / 社交预览图（格式兼容性）
 *
 * 用法： node scripts/convert-to-webp.js
 */
import { glob, stat, unlink } from 'node:fs/promises';
import sharp from 'sharp';

const QUALITY = 80;
const PUBLIC_DIR = 'public/images';

// 明确排除的文件名（basename 比对）
const EXCLUDE = new Set(['no_image.png', 'amber.jpg']);

const kb = (bytes) => (bytes / 1024).toFixed(1) + 'K';

async function main() {
  const targets = [];
  for await (const file of glob(`${PUBLIC_DIR}/**/*.{png,jpg,jpeg}`)) {
    const base = file.split(/[\\/]/).pop();
    if (EXCLUDE.has(base)) continue;
    targets.push(file);
  }

  if (!targets.length) {
    console.log('没有需要转换的图片。');
    return;
  }

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of targets) {
    const out = file.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    const meta = await sharp(file).metadata();
    await sharp(file).webp({ quality: QUALITY }).toFile(out);

    const { size: bSize } = await stat(file);
    const { size: aSize } = await stat(out);
    totalBefore += bSize;
    totalAfter += aSize;

    console.log(
      `${file}  ${meta.width}x${meta.height}  ${kb(bSize)} -> ${kb(aSize)} webp q${QUALITY}`
    );

    await unlink(file);
  }

  console.log('---');
  console.log(
    `共 ${targets.length} 张  ${kb(totalBefore)} -> ${kb(totalAfter)}  ` +
      `节省 ${Math.round((1 - totalAfter / totalBefore) * 100)}%`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
