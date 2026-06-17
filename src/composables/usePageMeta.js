import { watch, unref } from 'vue';

const SITE_NAME = '托贝诺特世界观 Wiki';
const DEFAULT_IMAGE = 'https://wiki.tobenot.top/amber.jpg';
const DEFAULT_DESCRIPTION = '人物、地点、事件、物品与概念的世界构建百科。';

/**
 * 读取或创建一个 meta 标签并写入内容。
 */
function setMeta(attr, key, content) {
  if (content == null || content === '') return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * 解析成绝对 URL（用于 og:url / og:image）。
 */
function toAbsolute(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const origin = window.location.origin;
  if (path.startsWith('/')) return `${origin}${path}`;
  return `${origin}/${path}`;
}

/**
 * 设置页面级 meta：document.title + og:title / og:description / og:url / og:image。
 *
 * SPA + 静态部署下，不执行 JS 的爬虫（微信/Twitter link preview）只能读到 index.html 的默认卡片；
 * 但执行 JS 的环境（浏览器标签页、部分爬虫、未来的预渲染）会拿到正确的条目级 meta。
 * 传入的参数可以是 ref 或裸值，会在变化时自动更新。
 *
 * @param {object} opts
 * @param {import('vue').Ref<string>|string} opts.title
 * @param {import('vue').Ref<string>|string} [opts.description]
 * @param {import('vue').Ref<string>|string} [opts.image]  站点相对路径或绝对 URL
 */
export function usePageMeta(opts = {}) {
  const resolve = (v) => {
    const val = unref(v);
    return typeof val === 'string' ? val : (val != null ? String(val) : '');
  };

  const apply = () => {
    const title = resolve(opts.title);
    const description = resolve(opts.description) || DEFAULT_DESCRIPTION;
    const image = resolve(opts.image);

    const fullTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
    document.title = fullTitle;

    setMeta('property', 'og:title', title || SITE_NAME);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', window.location.href);
    setMeta('property', 'og:site_name', SITE_NAME);
    if (image) setMeta('property', 'og:image', toAbsolute(image));
    else setMeta('property', 'og:image', DEFAULT_IMAGE);

    setMeta('name', 'twitter:title', title || SITE_NAME);
    setMeta('name', 'twitter:description', description);
    if (image) setMeta('name', 'twitter:image', toAbsolute(image));
    else setMeta('name', 'twitter:image', DEFAULT_IMAGE);

    setMeta('name', 'description', description);
  };

  // 初始应用 + 响应式跟踪
  watch(
    () => [resolve(opts.title), resolve(opts.description), resolve(opts.image), window.location.href],
    apply,
    { immediate: true }
  );
}
