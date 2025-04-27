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

    // Determine type and full relative ID from file path
    // file might be 'characters/silvermoon/caspar.md'
    const pathParts = file.split(path.sep);
    const type = pathParts[0];
    // Construct the full ID including subfolders, removing the type and .md extension
    const fullId = pathParts.slice(1).join('/').replace(/\.md$/, ''); // Should result in 'silvermoon/caspar'

    if (!frontmatter.title) {
      console.warn(`Skipping ${file}: Missing title in frontmatter.`);
      continue;
    }

    // Use a unique ID combining type and the full relative ID
    const uniqueRef = `${type}/${fullId}`; // Example: 'characters/silvermoon/caspar'

    // Convert markdown content to plain text
    const plainTextContent = await markdownToPlainText(markdownContent);

    const doc = {
      id: uniqueRef, // Use the new unique reference for Lunr
      title: frontmatter.title,
      tags: frontmatter.tags ? frontmatter.tags.join(' ') : '',
      content: plainTextContent,
      // We don't strictly need 'type' field here anymore if ref contains it,
      // but keeping it doesn't hurt and might be useful.
      type: type
    };

    documents.push(doc);
    // Use the same uniqueRef as the key for the map
    documentMap[uniqueRef] = {
      title: frontmatter.title,
      type: type,
      fullId: fullId, // Store the full ID separately if needed, though ref has it
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
    // Add 'type' to metadata so we can retrieve it from search results if needed,
    // but it's not directly searchable unless added as a field.
    // We already store it in the documentMap, which is more efficient.
    this.metadataWhitelist = ['position']; // Default, keep it

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