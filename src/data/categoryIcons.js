// 粗野主义风格分类图标：粗描边、硬边角、几何感
// 供首页页签与搜索结果共用，保持视觉一致

const brutalistIcon = (paths) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="miter" class="brutal-icon">${paths}</svg>`;

// type -> 行内 SVG 字符串
export const categoryIcons = {
  // 人物
  characters: brutalistIcon(
    '<circle cx="12" cy="7.5" r="3.5"/><path d="M4 21v-1a8 8 0 0 1 16 0v1"/>'
  ),
  // 地点
  locations: brutalistIcon(
    '<path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><rect x="9" y="7" width="6" height="6"/>'
  ),
  // 事件
  events: brutalistIcon(
    '<path d="M13 2 4 14h7l-2 8 9-12h-7l2-8z"/>'
  ),
  // 物品
  items: brutalistIcon(
    '<path d="M12 2 3 7v10l9 5 9-5V7l-9-5z"/><path d="M3 7l9 5 9-5"/><path d="M12 12v10"/>'
  ),
  // 概念
  concepts: brutalistIcon(
    '<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 2a7 7 0 0 0-4 12.6c1 .8 1.5 1.4 1.5 2.4h5c0-1 .5-1.6 1.5-2.4A7 7 0 0 0 12 2z"/>'
  ),
  // 作品
  works: brutalistIcon(
    '<path d="M4 4h7a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z"/><path d="M20 4h-7a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h7z"/>'
  ),
  // 主题
  themes: brutalistIcon(
    '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>'
  ),
};

const fallbackIcon = brutalistIcon(
  '<rect x="4" y="4" width="16" height="16"/>'
);

// 按 type 取图标 SVG 字符串；未知类型返回占位图标
export function getCategoryIcon(type) {
  return categoryIcons[type] || fallbackIcon;
}
