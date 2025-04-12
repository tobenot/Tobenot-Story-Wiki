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
      type: attributes.type || metadata.type, // Use type from attributes or infer from path
      image: attributes.image // Add image field
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
        image: attributes.image, // Add image field
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
  
  // 自定义渲染器 (Keep the basic renderer)
  const renderer = new marked.Renderer();
  
  // Parse the content with the standard renderer
  return marked(content, { renderer });
}

// Example: Add function to get source links (can be expanded)
const spoilerLinksConfig = {
  '《心界录》': '/works/xin-jie-lu', // Example
  '《创世纪》': '/works/genesis-chapter-1', // From previous EntryPage code
  // Add more links here
};

export function getSpoilerLink(source) {
  if (!source) return null;
  const match = source.match(/《(.+?)》/);
  const bookTitle = match ? `《${match[1]}》` : null;
  return bookTitle ? spoilerLinksConfig[bookTitle] : null;
}
