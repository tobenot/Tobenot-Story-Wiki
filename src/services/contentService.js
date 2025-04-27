import fm from 'front-matter';
import { marked } from 'marked';

// Import all markdown files from the content directory eagerly
const contentModules = import.meta.glob('/src/content/**/*.md', { eager: true, as: 'raw' });

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
  // 支持子文件夹的新正则表达式
  const match = path.match(/\/src\/content\/([^/]+)\/(.+)\.md$/);
  if (match) {
    const type = match[1];
    let id = match[2];
    
    // 检查ID是否包含子文件夹路径
    const containsSubfolder = id.includes('/');
    
    // 如果需要，可以在这里处理子文件夹信息
    const category = containsSubfolder ? id.split('/').slice(0, -1).join('/') : null;
    const baseId = containsSubfolder ? id.split('/').pop() : id;
    
    return { 
      type, 
      id,           // 完整ID，包含子文件夹路径
      baseId,       // 不含路径的基本ID
      category,     // 子文件夹路径作为分类
      hasSubfolder: containsSubfolder
    };
  }
  return null;
}

// Load content list (Now synchronous as content is preloaded)
export function loadContentList(type, { tag } = {}) {
  const entries = [];
  // Determine paths based on type - contentFiles needs to be defined using Object.keys(contentModules)
  const allPaths = Object.keys(contentModules);
  const contentFilesForType = type 
    ? allPaths.filter(path => path.startsWith(`/src/content/${type}/`)) 
    : allPaths;

  for (const path of contentFilesForType) {
    const rawContent = contentModules[path]; // Access preloaded content directly
    // No await needed here
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
      baseId: metadata.baseId,
      category: metadata.category, // 新增字段，表示子文件夹分类
      title: attributes.title,
      description,
      tags: attributes.tags || [],
      type: attributes.type || metadata.type, // Use type from attributes or infer from path
      image: attributes.image // Add image field
    });
  }

  // Sort entries? (Optional, e.g., by title)
  // entries.sort((a, b) => a.title.localeCompare(b.title));

  return entries;
}

// Load single content entry (Now largely synchronous for fetching)
export function loadContentEntry(type, id) {
  // 处理子文件夹路径
  const path = `/src/content/${type}/${id}.md`;
  
  if (contentModules[path]) {
    try {
      const rawContent = contentModules[path]; // Access preloaded content directly
      // No await needed here
      const { attributes, body } = fm(rawContent);
      const metadata = extractMetadataFromPath(path);
      
      return {
        ...attributes,
        image: attributes.image, // Add image field
        content: renderContent(body), // renderContent itself might have async parts if plugins were used, but base marked is sync
        id,
        category: metadata?.category // 添加分类信息
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
  '《不止于纸上的故事：银月篇》': 'https://tobenot.itch.io/beyond-books', // Example
  '《在回家之前到家》': 'https://tobenot.top/2024/06/28/Story-Arrive-Before-Go-Home/',
  // Add more links here
};

export function getSpoilerLink(source) {
  if (!source) return null;
  const match = source.match(/《(.+?)》/);
  const bookTitle = match ? `《${match[1]}》` : null;
  return bookTitle ? spoilerLinksConfig[bookTitle] : null;
}
