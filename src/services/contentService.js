import fm from 'front-matter';
import { marked } from 'marked';

// Import all markdown files from the content directory dynamically
const contentModules = import.meta.glob('/src/content/**/*.md', { eager: false, as: 'raw' });

// Predefined content type mapping (if still needed, otherwise remove or adjust)
// Note: This might become less useful or need adjustment with dynamic loading
// const contentFiles = { ... } // Consider removing or adapting this

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

// Load content list (Now asynchronous)
export async function loadContentList(type, { tag } = {}) { // Make async
  const entries = [];
  const allPaths = Object.keys(contentModules);
  const contentFilesForType = type
    ? allPaths.filter(path => path.startsWith(`/src/content/${type}/`))
    : allPaths;

  // Process paths concurrently for potentially faster loading
  await Promise.all(contentFilesForType.map(async (path) => { // Use Promise.all
    const loadModule = contentModules[path]; // Get the async function
    if (!loadModule) return; // Skip if module loader not found

    try {
      const rawContent = await loadModule(); // Await the dynamic import
      const { attributes, body } = fm(rawContent);
      const metadata = extractMetadataFromPath(path);

      if (!metadata) return; // Skip if path doesn't match expected format

      // Filter by tag if provided
      if (tag && (!attributes.tags || !attributes.tags.includes(tag))) {
        return;
      }

      // Limit description length
      const description = attributes.description || body.substring(0, 100) + (body.length > 100 ? '...' : '');

      entries.push({
        id: metadata.id,
        baseId: metadata.baseId,
        category: metadata.category,
        title: attributes.title,
        description,
        tags: attributes.tags || [],
        type: attributes.type || metadata.type,
        image: attributes.image // Add image field
      });
    } catch (error) {
        console.error(`Failed to load or parse content for path ${path}:`, error);
    }
  })); // End Promise.all

  // Sort entries? (Optional, e.g., by title)
  // entries.sort((a, b) => a.title.localeCompare(b.title));

  return entries;
}

// Load single content entry (Now asynchronous)
export async function loadContentEntry(type, id) { // Make async
  const path = `/src/content/${type}/${id}.md`;
  const loadModule = contentModules[path]; // Get the async function

  if (loadModule) {
    try {
      const rawContent = await loadModule(); // Await the dynamic import
      const { attributes, body } = fm(rawContent);
      const metadata = extractMetadataFromPath(path);

      return {
        ...attributes,
        image: attributes.image,
        // Return the raw markdown body, not the processed content
        content: body,
        id,
        category: metadata?.category
      };
    } catch (error) {
      console.error(`Failed to load content entry for ${type}/${id}:`, error);
      return null;
    }
  } else {
    console.error(`Content entry not found for path: ${path}`);
    return null; // Entry not found
  }
}

// Render Markdown content - NOW PREPROCESSES FOR VUE COMPONENTS
export function renderContent(content) {
  if (!content) {
    return []; // Return empty array for no content
  }

  const spoilers = [];
  const images = [];
  let processedContent = content;

  // 1. Extract Spoilers (using :::spoiler source=\"...\" ... ::: syntax)
  const spoilerPlaceholderPrefix = '{{SPOILER_';
  const spoilerPlaceholderSuffix = '}}';
  const spoilerRegex = /::spoiler source=\"([^\\n\"]+)\"\s*\n([\s\S]*?):::/g;
  processedContent = processedContent.replace(spoilerRegex, (match, source, innerContent) => {
    const placeholder = `${spoilerPlaceholderPrefix}${spoilers.length}${spoilerPlaceholderSuffix}`;
    spoilers.push({ source, rawContent: innerContent.trim() });
    return placeholder;
  });

  // 2. Extract Images
  const imagePlaceholderPrefix = '{{IMAGE_';
  const imagePlaceholderSuffix = '}}';
  const imageRegex = /!\\\[(.*?)\\]\\((.*?)\\)/g;
  processedContent = processedContent.replace(imageRegex, (match, alt, src) => {
    if (spoilers.some(s => s.rawContent.includes(match))) return match;
    const placeholder = `${imagePlaceholderPrefix}${images.length}${imagePlaceholderSuffix}`;
    images.push({ alt, src });
    return placeholder;
  });

  // 3. Configure and run marked on the processed content
  marked.use({
    gfm: true,
    breaks: true,
    mangle: false,
    headerIds: false
  });
  const renderer = new marked.Renderer();
  const htmlWithPlaceholders = marked(processedContent, { renderer });

  // 4. Split HTML and Reconstruct Structure using new placeholders
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

  // Post-process the result array to fix incomplete tags from splitting
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
  // Add more links here
};

export function getSpoilerLink(source) {
  if (!source) return null;
  const match = source.match(/《(.+?)》/);
  const bookTitle = match ? `《${match[1]}》` : null;
  return bookTitle ? spoilerLinksConfig[bookTitle] : null;
}
