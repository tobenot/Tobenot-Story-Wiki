<template>
  <div>
    <main class="wiki-container">
      <div v-if="loading" class="flex justify-center items-center py-20">
        <svg class="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="ml-3 text-slate-600 dark:text-slate-400">加载中...</span>
      </div>

      <div v-else-if="!entry" class="text-center py-20">
        <div class="mb-4 text-slate-400 dark:text-slate-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-medium text-slate-700 dark:text-slate-300 mb-4">未找到该条目信息</h3>
        <router-link to="/" class="btn btn-primary">返回首页</router-link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="md:col-span-3">
          <!-- 面包屑导航 -->
          <nav class="flex text-sm mb-6 items-center">
            <router-link to="/" class="text-starlight-600 hover:text-starlight-100 transition-colors">首页</router-link>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mx-2 text-cosmic-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <router-link :to="`/category/${categoryType}`" class="text-starlight-600 hover:text-starlight-100 transition-colors">
              {{ categoryTitle }}
            </router-link>
            <!-- 如果有分类，显示分类路径 -->
            <template v-if="entry.category">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mx-2 text-cosmic-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              <router-link
                :to="categoryBreadcrumbLink"
                class="text-starlight-600 hover:text-starlight-100 transition-colors"
              >
                {{ categoryDisplayName }}
              </router-link>
            </template>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mx-2 text-cosmic-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <span class="text-starlight-500 font-medium">{{ entry.title }}</span>
          </nav>

          <!-- 顶部父级与变体/分支提示 -->
          <div class="mb-4 space-y-2">
            <div v-if="parents.length" class="p-3 border-brutal bg-cosmic-800/60 backdrop-blur-sm text-starlight-200">
              <div class="text-sm mb-2">所属：</div>
              <div class="flex flex-wrap gap-2">
                <router-link
                  v-for="p in parents"
                  :key="p.to"
                  :to="p.to"
                  class="px-2 py-1 border-brutal hover:bg-cosmic-700/60 transition-colors text-starlight-100"
                >
                  {{ p.label }}
                </router-link>
              </div>
            </div>

            <div v-if="variants.length > 1" class="p-3 border-brutal bg-cosmic-800/60 backdrop-blur-sm text-starlight-200">
              <div class="text-sm mb-2">该条目在不同上下文有多种版本：</div>
              <div class="flex flex-wrap gap-2">
                <router-link
                  v-for="v in variants"
                  :key="v.routeId"
                  :to="v.to"
                  class="px-2 py-1 border-brutal hover:bg-cosmic-700/60 transition-colors"
                  :class="v.routeId === entry.id ? 'bg-starlight-600 text-white' : 'text-starlight-100'"
                >
                  {{ v.label }}
                </router-link>
              </div>
            </div>
          </div>

          <!-- 条目内容卡片 -->
          <article class="wiki-card mb-8 overflow-visible border-brutal shadow-brutal">
            <!-- 装饰线 -->
            <div class="absolute -top-4 left-0 right-0 h-3 bg-starlight-500"></div>
            
            <!-- Display Main Entry Image using ImageLoader -->
            <div class="relative">
              <ImageLoader
                v-if="entry.image"
                :src="entry.image"
                :alt="`${entry.title} primary image`"
                class="w-full h-auto max-h-[400px] object-cover"
              />
            </div>

            <div class="p-5 md:p-8">
              <h1 class="text-3xl md:text-4xl font-bold mb-4 text-starlight-500">{{ entry.title }}</h1>

              <div class="flex flex-wrap gap-2 mb-6" v-if="entry.tags && entry.tags.length > 0">
                <Tag
                  v-for="tag in entry.tags"
                  :key="tag"
                  :text="tag"
                  color="starlight"
                  :clickable="true"
                  @click="handleTagClick(tag)"
                />
              </div>

              <!-- 剧透控制 -->
              <div class="mb-8 flex justify-end">
                <button @click="showAllSpoilers = !showAllSpoilers"
                  class="btn border-brutal"
                  :class="showAllSpoilers ? 'btn-hide-spoilers' : 'btn-show-spoilers'"
                >
                  {{ showAllSpoilers ? '隐藏所有剧透' : '我不怕剧透' }}
                </button>
              </div>

              <!-- 星系装饰 -->
              <div class="absolute opacity-30 top-1/2 right-8 w-32 h-32 border border-starlight-400 pointer-events-none"></div>

              <!-- 条目主体内容 -->
              <div ref="contentArea" class="prose prose-starlight dark:prose-invert max-w-none relative">
                <!-- Structured Content Loop -->
                <template v-for="(part, index) in structuredContent" :key="index">
                  <div v-if="part.type === 'html'" v-html="part.content"></div>
                  <MarkdownImage
                    v-else-if="part.type === 'image'"
                    :src="part.src"
                    :alt="part.alt"
                  />
                  <SpoilerBlock
                    v-else-if="part.type === 'spoiler'"
                    :source="part.source"
                    :initial-content-html="part.content"
                    :is-globally-revealed="showAllSpoilers"
                    :resolve-asset-path="resolveAssetPath"
                  />
                </template>
              </div>

              <!-- 相关条目 -->
              <div class="mt-10 pt-6 border-t border-cosmic-600/40" v-if="resolvedRelatedItems.length > 0">
                <h3 class="text-lg font-bold mb-5 text-starlight-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-starlight-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  相关条目
                </h3>
                <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <li v-for="item in resolvedRelatedItems" :key="item.title" class="flex items-center">
                    <span class="mr-2 text-starlight-400">•</span>
                    <!-- Use router-link if path exists, otherwise display text -->
                    <router-link v-if="item.path" :to="item.path" class="text-starlight-500 hover:text-starlight-100 transition-colors">
                      {{ item.title }}
                    </router-link>
                    <span v-else class="text-starlight-300">{{ item.title }}</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <!-- 装饰线 -->
            <div class="absolute -bottom-4 left-0 right-0 h-3 bg-starlight-500"></div>
          </article>

          <!-- 底部导航 -->
          <div class="mt-10">
            <router-link :to="`/category/${categoryType}`" class="btn btn-secondary group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回{{ categoryTitle }}列表
            </router-link>
          </div>
        </div>

        <!-- TOC Sidebar Area -->
        <div class="md:col-span-1 hidden md:block">
          <div class="sticky top-20 bg-cosmic-900/90 backdrop-blur-md border-brutal shadow-brutal p-4 overflow-hidden">
            <h4 class="text-starlight-300 font-semibold mb-4 pb-2 border-b border-cosmic-700/60 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              目录
            </h4>
            <TableOfContents :headings="tocHeadings" class="toc-sidebar" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { loadContentEntry, renderContent, getAllEntriesMetadata } from '../services/contentService';
import Tag from '../components/ui/Tag.vue';
import ImageLoader from '../components/ui/ImageLoader.vue';
import SpoilerBlock from '../components/ui/SpoilerBlock.vue';
import MarkdownImage from '../components/ui/MarkdownImage.vue';
import TableOfContents from '../components/TableOfContents.vue';
import { usePageMeta } from '../composables/usePageMeta';
import { slugify } from 'transliteration';
import { getEntryVariants, getEntryParents, getCategoryDisplayName } from '../services/contentService';

const route = useRoute();
const router = useRouter();
const BASE_URL = import.meta.env.BASE_URL;
const loading = ref(true);
const showAllSpoilers = ref(false);
const entry = ref(null);
const allMetadata = ref([]);
const contentArea = ref(null);
const tocHeadings = ref([]);
const variants = ref([]);
const parents = ref([]);
const categoryDisplayName = ref('');

// 处理标签点击
const handleTagClick = (tag) => {
  router.push({
    path: `/category/${categoryType.value}`,
    query: { tag }
  });
};

// 类型和ID计算属性
const categoryType = computed(() => route.params.type);
const entryId = computed(() => route.params.id);

const categoryTitle = computed(() => {
  switch(categoryType.value) {
    case 'characters': return '人物';
    case 'locations': return '地点';
    case 'events': return '事件';
    case 'items': return '物品';
    case 'concepts': return '概念';
    default: return '未知分类';
  }
});

const categoryBreadcrumbLink = computed(() => {
  const category = entry.value?.category;
  if (!category) return `/category/${categoryType.value}`;
  const m = category.match(/^works\/([^\/]+)\/parts\/([^\/]+)$/);
  if (m) return `/works/${m[1]}/parts/${m[2]}`;
  return `/category/${categoryType.value}?folder=${category}`;
});

// 页面标题
const pageTitle = computed(() => {
  if (entry.value) {
    return `${entry.value.type}: ${entry.value.title} - Tobenot Story Wiki`;
  }
  return 'Tobenot Story Wiki';
});

// 更新页面标题 & OG/分享 meta
usePageMeta({
  title: computed(() => entry.value?.title || ''),
  description: computed(() => entry.value?.summary || entry.value?.description || ''),
  image: computed(() => entry.value?.image ? resolveAssetPath(entry.value.image) : ''),
});

// NEW: Computed property to resolve related item links
const resolvedRelatedItems = computed(() => {
  if (!entry.value || !entry.value.related || !allMetadata.value.length) {
    return [];
  }
  return entry.value.related.map(relatedTitle => {
    // Find the entry in the metadata list by title
    const relatedEntry = allMetadata.value.find(meta => meta.title === relatedTitle);
    if (relatedEntry) {
      return {
        title: relatedTitle,
        path: `/entry/${relatedEntry.type}/${relatedEntry.id}` // Construct the path
      };
    } else {
      // Return the title as plain text if not found
      console.warn(`Related entry with title "${relatedTitle}" not found in metadata.`);
      return { title: relatedTitle, path: null };
    }
  }).filter(item => item !== null);
});

// NEW: Compute structured content (no change needed here for related links)
const structuredContent = computed(() => {
  if (!entry.value || !entry.value.content) {
    return [];
  }
  const result = renderContent(entry.value.content);
  return result;
});

// Modify loadData function
const loadData = async () => {
  loading.value = true;
  entry.value = null;
  categoryDisplayName.value = '';
  try {
    // Load metadata first (or concurrently) - it's cached after the first time
    const metaPromise = getAllEntriesMetadata(); // Start fetching metadata
    const entryPromise = loadContentEntry(categoryType.value, entryId.value); // Start fetching entry

    // Await both promises
    allMetadata.value = await metaPromise;
    const data = await entryPromise;

    entry.value = data;
    if (data && data.category) {
      categoryDisplayName.value = await getCategoryDisplayName(data.category);
    }
    
    variants.value = await getEntryVariants(categoryType.value, entryId.value);
    parents.value = await getEntryParents(categoryType.value, entryId.value);

    if (!data) {
       console.error(`Entry data is null for ${categoryType.value}/${entryId.value}`);
       document.title = '未找到条目 - Tobenot Story Wiki';
    } else {
       // Set title after entry is loaded successfully
       document.title = pageTitle.value;
    }
  } catch (error) {
    console.error(`Failed to load content entry or metadata for ${categoryType.value}/${entryId.value}:`, error);
    document.title = '加载错误 - Tobenot Story Wiki';
  } finally {
    loading.value = false;
  }
};

// 监听路由参数变化，重新加载数据
watch([categoryType, entryId], loadData, { immediate: true });

// Function to generate unique IDs for headings
const generateHeadingId = (text) => {
  // Use transliteration.slugify for better non-ASCII handling
  return slugify(text, { lower: true, separator: '-' });
};

// Watch for entry changes to update TOC and log related items data
watch(entry, async (newEntry) => {
  if (newEntry && newEntry.content) {
    await nextTick(); // Wait for DOM updates for TOC

    const headings = [];
    if (contentArea.value) {
      // Find h2 and h3 elements within the rendered content area
      const headingElements = contentArea.value.querySelectorAll('h2, h3');
      headingElements.forEach((el) => {
        const text = el.innerText?.trim();
        if (!text) return;
        let id = el.id;
        if (!id) {
          id = generateHeadingId(text);
          let potentialId = id;
          let idCounter = 0;
          let tries = 0;
          while (document.getElementById(potentialId) && tries < 100) {
              idCounter++;
              potentialId = `${id}-${idCounter}`;
              tries++;
          }
          id = potentialId;
          el.id = id;
        }
        headings.push({
          id: id,
          text: text,
          level: parseInt(el.tagName.substring(1)),
        });
      });
    }
    tocHeadings.value = headings;

    // Log metadata and resolved related items for debugging
    console.log('All Metadata:', allMetadata.value);
    console.log('Resolved Related Items:', resolvedRelatedItems.value);

  } else {
    tocHeadings.value = [];
  }
}, { deep: true });

function resolveAssetPath(path) {
  if (!path || typeof path !== 'string' || !path.startsWith('/')) {
    return path;
  }
  // Prevent double slashes
  const normalizedBase = BASE_URL.endsWith('/') ? BASE_URL : BASE_URL + '/';
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
  const finalUrl = `${normalizedBase}${normalizedPath}`;
  // console.log(`Resolving image path: ${path} -> ${finalUrl}`);
  return finalUrl;
}
</script>

<style scoped>
/* Add styling for load error if needed */
.prose img.load-error {
  /* For example: show a border or a placeholder background */
  border: 2px dashed red;
  background-color: #fee2e2; /* Light red background */
}

/* 更新按钮样式 */
.btn-show-spoilers { /* 我不怕剧透按钮 - 改为slate */
  @apply bg-slate-500 text-white border-slate-700 hover:bg-slate-600;
}
.dark .btn-show-spoilers {
   @apply bg-slate-600 text-slate-100 border-slate-500 hover:bg-slate-500;
}

.btn-hide-spoilers { /* 隐藏所有剧透按钮 - 保持slate */
  @apply bg-slate-500 text-white border-slate-700 hover:bg-slate-600;
}
.dark .btn-hide-spoilers {
   @apply bg-slate-600 text-slate-100 border-slate-500 hover:bg-slate-500;
}

.btn-secondary {
   @apply bg-cosmic-200 text-cosmic-800 border-cosmic-400 hover:bg-cosmic-300;
}
.dark .btn-secondary {
    @apply bg-cosmic-700 text-starlight-100 border-cosmic-500 hover:bg-cosmic-600;
}

/* Add styles for the grid layout if needed */
.wiki-container {
  max-width: 1280px; /* Example max width */
  margin: 0 auto;
  padding: 1rem; /* Adjust padding */
}

/* Ensure sticky TOC works - adjust 'top' based on header height */
.sticky {
  position: -webkit-sticky; /* Safari */
  position: sticky;
}
.top-20 {
  top: 5rem; /* Example: 80px */
}

/* Adjust prose styles to ensure heading IDs scroll correctly */
:deep(.prose h2),
:deep(.prose h3) {
  scroll-margin-top: 5rem; /* Adjust based on your sticky header height */
}

/* 覆盖全局卡片悬停效果 */
article.wiki-card:hover {
  transform: none; /* 移除上移动画 */
  box-shadow: 6px 6px 0 0 rgba(15, 23, 42, 0.9); /* 恢复默认阴影 */
}
.dark article.wiki-card:hover {
   box-shadow: 6px 6px 0 0 rgba(255, 255, 255, 0.9); /* 恢复默认暗色阴影 */
}
</style>