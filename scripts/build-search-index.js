#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import * as glob from 'glob';
import matter from 'gray-matter';
import lunr from 'lunr';
import lunrStemmerSupport from 'lunr-languages/lunr.stemmer.support.js';
import lunrZh from 'lunr-languages/lunr.zh.js';
import { remark } from 'remark';
import strip from 'strip-markdown';

const contentDir = path.resolve(process.cwd(), 'src', 'content');
const publicDir = path.resolve(process.cwd(), 'public');
const indexFilePath = path.join(publicDir, 'search-index.json');
const mapFilePath = path.join(publicDir, 'search-map.json');

// Make sure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Initialize lunr with Chinese support
lunrStemmerSupport(lunr);
lunrZh(lunr);

// Function to convert markdown to plain text
async function markdownToPlainText(markdownContent) {
  try {
    const file = await remark().use(strip).process(markdownContent);
    return file.toString();
  } catch (error) {
    console.error("Error processing markdown:", error);
    return ''; // Return empty string on error
  }
}

function deriveTypeAndFullId(fileRelativePath) {
  // Normalize separators
  const pathParts = fileRelativePath.split(path.sep);
  // Handle structures:
  // 1) legacy: <type>/<slug>.md => type=parts[0], fullId=parts.slice(1).join('/') without .md
  // 2) globals: globals/<type>/<slug>.md => type=parts[1], fullId=`globals/${parts.slice(1).slice(1).join('/')}`
  // 3) works part entry: works/<workId>/parts/<partId>/<type>/<slug>.md => type=parts[4], fullId=`works/${workId}/parts/${partId}/${slug}`
  if (pathParts[0] === 'globals' && pathParts.length >= 3) {
    const type = pathParts[1];
    const fullId = ['globals', ...pathParts.slice(2)].join('/').replace(/\.md$/, '');
    return { type, fullId };
  }
  if (pathParts[0] === 'works' && pathParts.length >= 6) {
    const type = pathParts[4];
    const slug = pathParts[5].replace(/\.md$/, '');
    const workId = pathParts[1];
    const partId = pathParts[3];
    const fullId = `works/${workId}/parts/${partId}/${slug}`;
    return { type, fullId };
  }
  // fallback legacy
  const type = pathParts[0];
  const fullId = pathParts.slice(1).join('/').replace(/\.md$/, '');
  return { type, fullId };
}

async function buildIndex() {
  console.log('Starting search index build...');
  const documents = [];
  const documentMap = {};

  // Find all markdown files in the content directory
  const files = glob.sync('**/*.md', { cwd: contentDir });
  console.log(`Found ${files.length} markdown files.`);

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content: markdownContent } = matter(fileContent);

    const { type, fullId } = deriveTypeAndFullId(file);

    if (!frontmatter.title) {
      console.warn(`Skipping ${file}: Missing title in frontmatter.`);
      continue;
    }

    // Use a unique ID combining type and the full relative ID
    const uniqueRef = `${type}/${fullId}`;

    // Convert markdown content to plain text
    const plainTextContent = await markdownToPlainText(markdownContent);

    const doc = {
      id: uniqueRef,
      title: frontmatter.title,
      tags: frontmatter.tags ? frontmatter.tags.join(' ') : '',
      content: plainTextContent,
      type: type
    };

    documents.push(doc);
    documentMap[uniqueRef] = {
      title: frontmatter.title,
      type: type,
      fullId: fullId,
      description: frontmatter.description || '',
      image: frontmatter.image || null
    };
  }

  console.log(`Processed ${documents.length} documents for indexing.`);

  // Build the lunr index with Chinese support
  const idx = lunr(function () {
    this.use(lunr.zh);
    this.ref('id');
    this.field('title', { boost: 10 });
    this.field('tags', { boost: 5 });
    this.field('content');
    this.metadataWhitelist = ['position'];

    documents.forEach(function (doc) {
      this.add(doc);
    }, this);
  });

  // Save the index and map
  try {
    fs.writeFileSync(indexFilePath, JSON.stringify(idx));
    console.log(`Search index saved to ${indexFilePath}`);

    fs.writeFileSync(mapFilePath, JSON.stringify(documentMap));
    console.log(`Document map saved to ${mapFilePath}`);
  } catch (err) {
    console.error('Error writing index or map file:', err);
  }

  console.log('Search index build finished.');
}

buildIndex().catch(err => {
  console.error('Error during index build process:', err);
  process.exit(1);
}); 