import fm from 'front-matter';
import { marked } from 'marked';

// Import all markdown files from the content directory dynamically
const contentModules = import.meta.glob('/src/content/**/*.md', { eager: false, as: 'raw' });

// -----------------------------
// Path parsing helpers
// -----------------------------
function parsePathForEntry(path) {
  // Recognize different layouts and normalize to a common entry descriptor
  // Returns null for non-entry pages (e.g., indexes) or unrecognized
  // Legacy: /src/content/<type>/<slug>.md
  let m = path.match(/^\/src\/content\/([^\/]+)\/([^\/]+)\.md$/);
  if (m && !['globals', 'works', 'themes'].includes(m[1]) && m[2] !== 'index') {
    const type = m[1];
    const slug = m[2];
    return {
      sourceScope: 'legacy',
      type,
      id: slug,
      routeId: slug, // used by /entry/:type/:id
      category: null,
      filePath: path,
    };
  }

  // Global canonical entries: /src/content/globals/<type>/<slug>.md
  m = path.match(/^\/src\/content\/globals\/([^\/]+)\/([^\/]+)\.md$/);
  if (m) {
    const type = m[1];
    const slug = m[2];
    return {
      sourceScope: 'global',
      type,
      id: slug,
      routeId: `globals/${slug}`,
      category: 'globals',
      filePath: path,
    };
  }

  // Work part entries: /src/content/works/<workId>/parts/<partId>/<type>/<slug>.md
  m = path.match(/^\/src\/content\/works\/([^\/]+)\/parts\/([^\/]+)\/([^\/]+)\/([^\/]+)\.md$/);
  if (m) {
    const workId = m[1];
    const partId = m[2];
    const type = m[3];
    const slug = m[4];
    return {
      sourceScope: 'partEntry',
      type,
      id: slug,
      workId,
      partId,
      routeId: `works/${workId}/parts/${partId}/${slug}`,
      category: `works/${workId}/parts/${partId}`,
      filePath: path,
    };
  }

  // Non-entry recognized files (works and parts indexes)
  if (path.match(/^\/src\/content\/works\/([^\/]+)\/index\.md$/)) {
    const m2 = path.match(/^\/src\/content\/works\/([^\/]+)\/index\.md$/);
    return { sourceScope: 'workIndex', workId: m2[1], filePath: path };
  }
  if (path.match(/^\/src\/content\/works\/([^\/]+)\/parts\/([^\/]+)\/index\.md$/)) {
    const m2 = path.match(/^\/src\/content\/works\/([^\/]+)\/parts\/([^\/]+)\/index\.md$/);
    return { sourceScope: 'partIndex', workId: m2[1], partId: m2[2], filePath: path };
  }

  // Themes
  if (path.match(/^\/src\/content\/themes\/([^\/]+)\.md$/)) {
    const m2 = path.match(/^\/src\/content\/themes\/([^\/]+)\.md$/);
    return { sourceScope: 'theme', themeId: m2[1], filePath: path };
  }

  return null;
}

// -----------------------------
// Index building and caches
// -----------------------------
let allEntriesMetadataCache = null;
let metadataPromise = null;

let contentIndexCache = null;
let contentIndexPromise = null;

async function buildContentIndex() {
  if (contentIndexCache) return contentIndexCache;
  if (contentIndexPromise) return contentIndexPromise;

  const allPaths = Object.keys(contentModules);

  contentIndexPromise = (async () => {
    const canonicalIndex = new Map(); // canonicalId -> { fileInfo, attributes }
    const typeIndex = new Map(); // type -> Map<key, aggregated>
    const workIndex = new Map(); // workId -> { attributes, parts: [] }
    const partIndex = new Map(); // `${workId}/${partId}` -> { attributes, entriesByType }
    const themes = new Map(); // themeId -> { attributes, body }

    // helper to agg in typeIndex
    function upsertTypeIndex(type, key, record) {
      if (!typeIndex.has(type)) typeIndex.set(type, new Map());
      const map = typeIndex.get(type);
      const existing = map.get(key);
      if (!existing) {
        map.set(key, { ...record });
      } else {
        // merge appearances
        if (record.appearances && record.appearances.length) {
          existing.appearances = Array.from(new Set([...(existing.appearances || []), ...record.appearances]));
        }
        // prefer global as primary
        if (record.sourceScope === 'global' && existing.sourceScope !== 'global') {
          map.set(key, { ...record, appearances: existing.appearances });
        }
      }
    }

    await Promise.all(allPaths.map(async (path) => {
      const descriptor = parsePathForEntry(path);
      if (!descriptor) return;

      const loader = contentModules[path];
      if (!loader) return;

      try {
        const raw = await loader();
        const { attributes, body } = fm(raw);

        if (descriptor.sourceScope === 'theme') {
          themes.set(descriptor.themeId, { attributes: attributes || {}, body: body || '' });
          return;
        }

        if (descriptor.sourceScope === 'workIndex') {
          const work = workIndex.get(descriptor.workId) || { attributes: {}, parts: [] };
          work.attributes = { ...work.attributes, ...attributes };
          workIndex.set(descriptor.workId, work);
          return;
        }

        if (descriptor.sourceScope === 'partIndex') {
          const key = `${descriptor.workId}/${descriptor.partId}`;
          const part = partIndex.get(key) || { attributes: {}, entriesByType: new Map() };
          part.attributes = { ...part.attributes, ...attributes };
          partIndex.set(key, part);
          // also ensure the parent work has this part in list
          const work = workIndex.get(descriptor.workId) || { attributes: {}, parts: [] };
          if (!work.parts.find(p => p.partId === descriptor.partId)) {
            work.parts.push({ partId: descriptor.partId, title: attributes?.title || descriptor.partId, order: attributes?.order || 0 });
          }
          workIndex.set(descriptor.workId, work);
          return;
        }

        if (['legacy', 'global', 'partEntry'].includes(descriptor.sourceScope)) {
          const type = descriptor.type;
          const canonicalId = attributes.canonicalId || null;
          const key = canonicalId || `${type}:${descriptor.routeId}`;

          // Appearances
          const appearance = descriptor.sourceScope === 'partEntry' ? `${descriptor.workId}/${descriptor.partId}` : 'global';
          const appearances = [appearance];

          // Record for type index
          const record = {
            key,
            type,
            title: attributes.title || descriptor.id,
            description: attributes.description || (body ? String(body).substring(0, 100) + (body.length > 100 ? '...' : '') : ''),
            tags: attributes.tags || [],
            image: attributes.image,
            createdAt: attributes.createdAt || null,
            updatedAt: attributes.updatedAt || null,
            sourceScope: descriptor.sourceScope,
            routeId: descriptor.routeId,
            category: descriptor.category || null,
            canonicalId: canonicalId,
            appearances,
          };
          upsertTypeIndex(type, key, record);

          // Populate canonical index if this is a global canonical entry
          if (descriptor.sourceScope === 'global' && canonicalId) {
            canonicalIndex.set(canonicalId, { fileInfo: descriptor, attributes, body });
          }

          // Also attach entry list under partIndex if part entry
          if (descriptor.sourceScope === 'partEntry') {
            const partKey = `${descriptor.workId}/${descriptor.partId}`;
            const part = partIndex.get(partKey) || { attributes: {}, entriesByType: new Map() };
            if (!part.entriesByType.has(type)) part.entriesByType.set(type, []);
            part.entriesByType.get(type).push({ ...record });
            partIndex.set(partKey, part);

            // Ensure work has this part listed
            const work = workIndex.get(descriptor.workId) || { attributes: {}, parts: [] };
            if (!work.parts.find(p => p.partId === descriptor.partId)) {
              work.parts.push({ partId: descriptor.partId, title: descriptor.partId, order: 0 });
            }
            workIndex.set(descriptor.workId, work);
          }

          // If no global exists yet for canonical, and this entry has canonicalId but isn't global,
          // we can keep the first seen non-global as a temporary canonical source for full details when needed.
          if (canonicalId && !canonicalIndex.has(canonicalId)) {
            canonicalIndex.set(canonicalId, { fileInfo: descriptor, attributes, body });
          }
        }
      } catch (err) {
        console.error('Failed to load content at', path, err);
      }
    }));

    // Normalize work parts ordering by attributes.order
    workIndex.forEach((work) => {
      work.parts.sort((a, b) => (a.order || 0) - (b.order || 0));
    });

    contentIndexCache = { canonicalIndex, typeIndex, workIndex, partIndex, themes };
    contentIndexPromise = null;
    return contentIndexCache;
  })();

  return contentIndexPromise;
}

// -----------------------------
// Public APIs
// -----------------------------

// Backward-compatible: list entries by type, aggregated and de-duplicated by canonicalId when available
export async function loadContentList(type, { tag } = {}) {
  const index = await buildContentIndex();
  const map = index.typeIndex.get(type) || new Map();
  let entries = Array.from(map.values());

  if (tag) {
    entries = entries.filter(e => e.tags && e.tags.includes(tag));
  }

  // Prefer global entry per canonical key for display, but keep routeId of the preferred record
  const byCanonical = new Map();
  for (const e of entries) {
    const key = e.canonicalId || e.key || `${e.type}:${e.routeId}`;
    const existing = byCanonical.get(key);
    if (!existing) {
      byCanonical.set(key, e);
    } else {
      // if one is global, prefer it
      if (e.sourceScope === 'global' && existing.sourceScope !== 'global') {
        byCanonical.set(key, e);
      }
    }
  }

  // Map to legacy shape expected by CategoryPage
  const result = Array.from(byCanonical.values()).map(e => ({
    id: e.routeId, // compatible with /entry/:type/:id
    baseId: e.routeId.split('/').pop(),
    category: e.category || null,
    title: e.title,
    description: e.description,
    tags: e.tags || [],
    type: type,
    image: e.image,
    createdAt: e.createdAt || null,
    updatedAt: e.updatedAt || null,
  }));

  return result;
}

// Flexible single entry loader that resolves new paths
export async function loadContentEntry(type, id) {
  // Construct candidate physical paths
  const candidatePaths = [];

  // 1) New globals id pattern: id starts with 'globals/...'
  if (id && id.startsWith('globals/')) {
    const slug = id.split('/')[1];
    candidatePaths.push(`/src/content/globals/${type}/${slug}.md`);
  }

  // 2) New works pattern: id starts with 'works/<workId>/parts/<partId>/<slug>'
  if (id && id.startsWith('works/')) {
    const m = id.match(/^works\/([^\/]+)\/parts\/([^\/]+)\/([^\/]+)$/);
    if (m) {
      const workId = m[1];
      const partId = m[2];
      const slug = m[3];
      candidatePaths.push(`/src/content/works/${workId}/parts/${partId}/${type}/${slug}.md`);
    }
  }

  // 3) Legacy direct path: /src/content/<type>/<id>.md
  if (id) {
    candidatePaths.push(`/src/content/${type}/${id}.md`);
  }

  // Try all candidates in order
  for (const path of candidatePaths) {
    const loader = contentModules[path];
    if (!loader) continue;
    try {
      const raw = await loader();
      const { attributes, body } = fm(raw);

      // determine category
      let category = null;
      if (path.includes('/globals/')) category = 'globals';
      const mWork = path.match(/\/works\/([^\/]+)\/parts\/([^\/]+)/);
      if (mWork) category = `works/${mWork[1]}/parts/${mWork[2]}`;

      return {
        ...attributes,
        image: attributes.image,
        createdAt: attributes.createdAt || null,
        updatedAt: attributes.updatedAt || null,
        content: body,
        id,
        category,
      };
    } catch (e) {
      console.error(`Failed to load content entry for ${type}/${id} at ${path}:`, e);
    }
  }

  console.error(`Content entry not found for type=${type}, id=${id}`);
  return null;
}

// All entries minimal metadata for related-link resolution
export async function getAllEntriesMetadata() {
  if (allEntriesMetadataCache) return allEntriesMetadataCache;
  if (metadataPromise) return metadataPromise;

  metadataPromise = (async () => {
    const allPaths = Object.keys(contentModules);
    const results = [];

    await Promise.all(allPaths.map(async (path) => {
      const descriptor = parsePathForEntry(path);
      if (!descriptor) return;
      if (!['legacy', 'global', 'partEntry'].includes(descriptor.sourceScope)) return;

      const loader = contentModules[path];
      if (!loader) return;

      try {
        const raw = await loader();
        const { attributes } = fm(raw);
        if (!attributes.title) return;
        results.push({
          id: descriptor.routeId,
          type: descriptor.type,
          title: attributes.title,
        });
      } catch (err) {
        console.error(`Failed to load metadata for path ${path}:`, err);
      }
    }));

    allEntriesMetadataCache = results;
    metadataPromise = null;
    return allEntriesMetadataCache;
  })();

  return metadataPromise;
}

// Works APIs
export async function getWorks() {
  const index = await buildContentIndex();
  const works = [];
  index.workIndex.forEach((data, workId) => {
    works.push({ workId, ...(data.attributes || {}), parts: data.parts || [] });
  });
  // sort by order if present
  works.sort((a, b) => (a.order || 0) - (b.order || 0));
  return works;
}

export async function getWork(workId) {
  const index = await buildContentIndex();
  const data = index.workIndex.get(workId);
  if (!data) return null;
  return { workId, ...(data.attributes || {}), parts: data.parts || [] };
}

export async function getPart(workId, partId) {
  const index = await buildContentIndex();
  const key = `${workId}/${partId}`;
  const part = index.partIndex.get(key);
  if (!part) return null;
  // materialize entriesByType maps
  const entries = {};
  part.entriesByType.forEach((arr, type) => {
    entries[type] = arr.map(e => ({
      id: e.routeId,
      title: e.title,
      description: e.description,
      tags: e.tags,
      image: e.image,
      category: e.category,
    }));
  });
  return { workId, partId, ...(part.attributes || {}), entriesByType: entries };
}

// Themes APIs (basic)
export async function getThemes() {
  const index = await buildContentIndex();
  const list = [];
  index.themes.forEach((data, id) => list.push({ themeId: id, ...(data.attributes || {}) }));
  return list;
}

export async function getTheme(themeId) {
  const index = await buildContentIndex();
  const data = index.themes.get(themeId);
  if (!data) return null;
  return { themeId, ...(data.attributes || {}), body: data.body || '' };
}

// -----------------------------
// Variants for an entry (disambiguation-style)
// -----------------------------
export async function getEntryVariants(type, id) {
  const index = await buildContentIndex();
  const typeMap = index.typeIndex.get(type) || new Map();

  let key = null;
  for (const rec of typeMap.values()) {
    if (rec.routeId === id) {
      key = rec.key;
      break;
    }
  }
  if (!key) {
    key = `${type}:${id}`;
  }

  const variants = [];

  for (const rec of typeMap.values()) {
    if (rec.key !== key) continue;
    if (rec.sourceScope === 'global') {
      variants.push({
        routeId: rec.routeId,
        scope: 'global',
      });
    }
  }

  index.partIndex.forEach((part, keyPart) => {
    const [workId, partId] = keyPart.split('/');
    const arr = part.entriesByType.get(type);
    if (!arr) return;
    arr.forEach(e => {
      if (e.key !== key) return;
      variants.push({
        routeId: e.routeId,
        scope: 'part',
        workId,
        partId,
      });
    });
  });

  const unique = new Map();
  variants.forEach(v => {
    unique.set(v.routeId, v);
  });

  const materialized = Array.from(unique.values()).map(v => {
    let label = '';
    if (v.scope === 'global') {
      label = '全局权威';
    } else {
      const work = index.workIndex.get(v.workId);
      const part = index.partIndex.get(`${v.workId}/${v.partId}`);
      const workTitle = work?.attributes?.title || v.workId;
      const partTitle = part?.attributes?.title || v.partId;
      label = `${workTitle} · ${partTitle}`;
    }
    return {
      routeId: v.routeId,
      to: `/entry/${type}/${v.routeId}`,
      label,
      isGlobal: v.scope === 'global',
      workId: v.workId || null,
      partId: v.partId || null,
    };
  });

  materialized.sort((a, b) => {
    if (a.isGlobal && !b.isGlobal) return -1;
    if (!a.isGlobal && b.isGlobal) return 1;
    return a.label.localeCompare(b.label, 'zh-CN');
  });

  return materialized;
}

export async function getEntryParents(type, id) {
  if (!id || !id.startsWith('works/')) return [];
  const m = id.match(/^works\/([^\/]+)\/parts\/([^\/]+)\//);
  if (!m) return [];
  const workId = m[1];
  const partId = m[2];
  const index = await buildContentIndex();
  const work = index.workIndex.get(workId);
  const part = index.partIndex.get(`${workId}/${partId}`);
  const workTitle = (work && work.attributes && work.attributes.title) ? work.attributes.title : workId;
  const partTitle = (part && part.attributes && part.attributes.title) ? part.attributes.title : partId;
  return [
    { to: `/works/${workId}`, label: workTitle, level: 'work' },
    { to: `/works/${workId}/parts/${partId}`, label: partTitle, level: 'part' }
  ];
}

// -----------------------------
// Markdown rendering with spoilers and images
// -----------------------------
export function renderContent(content) {
  if (!content) {
    return [];
  }

  const spoilers = [];
  const images = [];
  let processedContent = content;

  const spoilerPlaceholderPrefix = '{{SPOILER_';
  const spoilerPlaceholderSuffix = '}}';
  const spoilerRegex = /::spoiler source=\"([^\\n\"]+)\"\s*\n([\s\S]*?):::/g;
  processedContent = processedContent.replace(spoilerRegex, (match, source, innerContent) => {
    const placeholder = `${spoilerPlaceholderPrefix}${spoilers.length}${spoilerPlaceholderSuffix}`;
    spoilers.push({ source, rawContent: innerContent.trim() });
    return placeholder;
  });

  const imagePlaceholderPrefix = '{{IMAGE_';
  const imagePlaceholderSuffix = '}}';
  const imageRegex = /!\\\[(.*?)\\\]\\((.*?)\\)/g;
  processedContent = processedContent.replace(imageRegex, (match, alt, src) => {
    if (spoilers.some(s => s.rawContent.includes(match))) return match;
    const placeholder = `${imagePlaceholderPrefix}${images.length}${imagePlaceholderSuffix}`;
    images.push({ alt, src });
    return placeholder;
  });

  marked.use({
    gfm: true,
    breaks: true,
    mangle: false,
    headerIds: false
  });
  const renderer = new marked.Renderer();
  const htmlWithPlaceholders = marked(processedContent, { renderer });

  const result = [];
  const splitRegex = /(\{\{SPOILER_\d+\}\}|\{\{IMAGE_\d+\}\})/g;
  const parts = htmlWithPlaceholders.split(splitRegex);

  parts.forEach((part) => {
    if (!part) return;

    const spoilerMatch = part.match(/^\{\{SPOILER_(\d+)\}\}$/);
    const imageMatch = part.match(/^\{\{IMAGE_(\d+)\}\}$/);

    if (spoilerMatch) {
      const index = parseInt(spoilerMatch[1], 10);
      const spoilerData = spoilers[index];
      if (spoilerData) {
        const innerHtml = marked(spoilerData.rawContent, { renderer });
        result.push({ type: 'spoiler', source: spoilerData.source, content: innerHtml });
      }
    } else if (imageMatch) {
      const index = parseInt(imageMatch[1], 10);
      const imageData = images[index];
      if (imageData) {
        result.push({ type: 'image', src: imageData.src, alt: imageData.alt });
      }
    } else {
      if (part.trim()) {
        result.push({ type: 'html', content: part });
      }
    }
  });

  for (let i = 0; i < result.length; i++) {
    const item = result[i];
    if (item.type === 'html') {
      item.content = item.content.replace(/<p>\s*:?\s*$/i, '');
      item.content = item.content.replace(/^\s*<\/p>/i, '');
      if (!item.content.trim()) {
        result.splice(i, 1);
        i--;
      }
    }
  }

  return result;
}

// Example: Add function to get source links (can be expanded)
const spoilerLinksConfig = {
  '《不止于纸上的故事：银月篇》': 'https://tobenot.itch.io/beyond-books', // Example
  '《在回家之前到家》': 'https://tobenot.top/2024/06/28/Story-Arrive-Before-Go-Home/',
};

export function getSpoilerLink(source) {
  if (!source) return null;
  const match = source.match(/《(.+?)》/);
  const bookTitle = match ? `《${match[1]}》` : null;
  return bookTitle ? spoilerLinksConfig[bookTitle] : null;
}
