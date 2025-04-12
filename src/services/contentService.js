import fm from 'front-matter';
import { marked } from 'marked';

// Import all markdown files from the content directory
const contentModules = import.meta.glob('/src/content/**/*.md', { as: 'raw' });

// Predefined content type mapping (if still needed, otherwise remove or adjust)
const contentFiles = {
  characters: Object.keys(contentModules).filter(path => path.startsWith('/src/content/characters/')),
  locations: Object.keys(contentModules).filter(path => path.startsWith('/src/content/locations/')),
  events: Object.keys(contentModules).filter(path => path.startsWith('/src/content/events/')),
  items: Object.keys(contentModules).filter(path => path.startsWith('/src/content/items/')),
  concepts: Object.keys(contentModules).filter(path => path.startsWith('/src/content/concepts/')),
};

// Function to extract metadata from a path
function extractMetadataFromPath(path) {
  const match = path.match(/\/src\/content\/([^/]+)\/([^/]+)\.md$/);
  if (match) {
    return { type: match[1], id: match[2] };
  }
  return null;
}

// Load content list
export async function loadContentList(type, { tag } = {}) {
  const entries = [];
  const pathsToLoad = type ? contentFiles[type] : Object.keys(contentModules);

  for (const path of pathsToLoad) {
    const rawContent = await contentModules[path](); // Await the promise returned by the glob import
    const { attributes, body } = fm(rawContent);
    const metadata = extractMetadataFromPath(path);

    if (!metadata) continue; // Skip if path doesn't match expected format

    // Filter by tag if provided
    if (tag && (!attributes.tags || !attributes.tags.includes(tag))) {
      continue;
    }

    // Limit description length
    const description = attributes.description || body.substring(0, 100) + (body.length > 100 ? '...' : '');

    entries.push({
      id: metadata.id,
      title: attributes.title,
      description,
      tags: attributes.tags || [],
      type: attributes.type || metadata.type // Use type from attributes or infer from path
    });
  }

  return entries;
}

// Load single content entry
export async function loadContentEntry(type, id) {
  const path = `/src/content/${type}/${id}.md`;
  if (contentModules[path]) {
    try {
      const rawContent = await contentModules[path](); // Await the promise
      const { attributes, body } = fm(rawContent);
      return {
        ...attributes,
        content: renderContent(body), // Assuming renderContent exists elsewhere
        id
      };
    } catch (error) {
      console.error(`Failed to load content entry for ${type}/${id}:`, error);
      return null;
    }
  } else {
    console.error(`Content entry not found for path: ${path}`);
    return null; // Entry not found in the glob results
  }
}

// Render Markdown content
export function renderContent(content, showAllSpoilers = false) {
  if (!content) {
    return '';
  }
  // 配置 marked
  marked.use({
    gfm: true,
    breaks: true,
    mangle: false,
    headerIds: false
  });
  
  // 自定义渲染器
  const renderer = new marked.Renderer();
  
  // 处理剧透块
  content = content.replace(
    /<div class="spoiler"([^>]*)>([\s\S]*?)<\/div>/g,
    (match, attrs, innerContent) => {
      if (showAllSpoilers) {
        return `<div class="spoiler revealed"${attrs}>${innerContent}</div>`;
      }
      return match;
    }
  );
  
  return marked(content, { renderer });
}
