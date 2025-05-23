<template>
  <div>
    <!-- 导航栏 -->
    <Header />

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
                :to="`/category/${categoryType}?folder=${entry.category}`"
                class="text-starlight-600 hover:text-starlight-100 transition-colors"
              >
                {{ entry.category }}
              </router-link>
            </template>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mx-2 text-cosmic-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <span class="text-starlight-500 font-medium">{{ entry.title }}</span>
          </nav>

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
          <div class="flex justify-between mt-10">
            <router-link :to="`/category/${categoryType}`" class="btn btn-secondary group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回{{ categoryTitle }}列表
            </router-link>

            <!-- 分享按钮 -->
            <div class="relative">
              <button @click="isShareMenuOpen = !isShareMenuOpen" class="btn btn-share flex items-center group">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>分享</span>
                <span class="ml-1 group-hover:rotate-45 transition-transform">+</span>
              </button>

              <!-- 分享弹出菜单 -->
              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-100"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div v-if="isShareMenuOpen" class="absolute right-0 bottom-full mb-2 bg-cosmic-800/90 backdrop-blur-md shadow-brutal border-brutal p-3 w-64 z-10 share-menu">
                  <div class="flex flex-col space-y-2">
                    <div class="flex justify-between items-center">
                      <span class="text-sm font-semibold text-starlight-300">分享到</span>
                      <button @click="isShareMenuOpen = false" class="text-starlight-500 hover:text-starlight-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div class="h-px w-full bg-cosmic-600/50"></div>

                    <!-- 社交媒体分享按钮 -->
                    <button @click="shareToWeibo" class="share-btn bg-red-600/80 hover:bg-red-700/90 border-2 border-slate-900">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10.098 20.323c-3.977 0-7.215-1.942-7.215-4.333 0-1.27.807-2.7 2.186-4.048 1.854-1.813 4.035-2.657 4.863-1.814.371.376.203 1.311-.157 2.293-.18.495.054.557.385.21.331-.348 1.662-1.447 2.343-2.352.386-.644.353-1.345-.006-1.702-1.833-1.803-8.285.207-8.285-3.162 0-1.729 2.658-3.943 9.071-3.943 4.432 0 9.135 1.905 9.135 5.333 0 2.159-2.248 3.768-4.418 4.151-.525.093-.94.16-.94-.115s.323-.705.323-1.191c0-.705-.913-.784-1.159-.784-1.304 0-2.697 1.332-2.697 2.948 0 1.029.441 1.435 1.254 1.435.825 0 1.588-.269 2.346-.761.723.323 1.073 1.919-1.282 3.129-1.255.645-3.496 1.705-5.747 1.705zm7.016-16.938c-.18-.525-.913-.568-1.159-.073-.246.495 0 1.029.441 1.246.441.218.913 0 1.094-.495.181-.495-.204-.341-.376-.678zm2.433 1.663c-.723-.823-2.317-1.214-3.616-.823-1.3.391-1.854 1.557-1.3 2.659.553 1.1 2.09 1.511 3.39 1.098 1.298-.413 2.04-2.066 1.526-2.934.06.078-.723-.824 0 0zM6.158 14.835c-.081.26.081.413.327.413.247 0 .533-.153.614-.413.082-.153-.081-.26-.326-.26-.164 0-.533.107-.615.26zm1.547-.208c-.245.074-.409.368-.409.589 0 .221.164.295.41.221.245-.074.408-.368.408-.589.082-.147-.081-.295-.409-.221z"/>
                      </svg>
                      <span>微博</span>
                    </button>

                    <button @click="shareToQQ" class="share-btn bg-blue-600/80 hover:bg-blue-700/90 border-2 border-slate-900">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.003 2c-2.265 0-6.292 1.807-6.2 7.478.064 2.407-.42 4.865-.12 5.401.45.766.898 1.05 1.479 1.211.966.262 1.17-.734 1.276-1.236.12-.557.241-1.045.462-1.08.55-.09 1.03 1.01 1.66 1.729.133.15.334.33.618.33.505 0 1.092-.237 1.517-.596.201-.17.43-.309.4-.571-.11-.932-.283-1.17-.805-1.63-.704-.623-1.795-1.683-1.84-2.415-.011-.176.11-.361.284-.485.217-.154.919-.472 1.354-.659 1.159-.499 1.179-1.323.22-1.584-1.169-.318-4.471-.97-3.675-1.876.155-.17.616-.68 1.136-.68.521 0 1.675.393 2.05.615.393.232 1.106.232 1.53 0 .424-.232 1.578-.615 2.05-.615.52 0 .982.51 1.137.68.796.905-2.507 1.558-3.676 1.876-.959.261-.939 1.085.22 1.584.435.187 1.137.505 1.354.66.173.123.294.308.284.483-.045.732-1.136 1.792-1.84 2.415-.522.461-.695.699-.805 1.631-.3.262.199.401.4.57.425.36 1.012.597 1.517.597.284 0 .485-.18.618-.33.63-.72 1.11-1.818 1.66-1.729.22.035.341.523.462 1.08.106.502.31 1.498 1.276 1.236.581-.16 1.028-.445 1.478-1.211.3-.536-.183-2.994-.119-5.401.091-5.671-3.936-7.478-6.202-7.478zm-.17 14.766c-.076-.115-.159-.527-.159-.968 0-.441.083-.853.159-.967.077-.115.151-.115.228 0 .076.114.158.526.158.967 0 .441-.082.853-.158.968-.077.114-.151.114-.228 0zm2.367-.286c-.045-.138-.079-.414-.079-.658 0-.244.034-.52.079-.657.038-.129.107-.143.164-.143.058 0 .117.013.164.143.045.138.08.414.08.657 0 .244-.035.52-.08.658-.047.13-.106.143-.164.143-.057 0-.126-.014-.164-.143z"/>
                      </svg>
                      <span>QQ</span>
                    </button>

                    <div class="h-px w-full bg-cosmic-600/50"></div>

                    <!-- 复制链接 -->
                    <button @click="copyLink" class="share-btn bg-cosmic-600/80 hover:bg-cosmic-700/90 border-2 border-slate-900">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      <span>复制链接</span>
                    </button>

                    <transition name="fade">
                      <div v-if="showCopySuccess" class="mt-2 text-center text-sm text-green-500">
                        链接已复制到剪贴板
                      </div>
                    </transition>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- TOC Sidebar Area -->
        <div class="md:col-span-1 hidden md:block">
          <div class="sticky top-20 bg-cosmic-800/60 backdrop-blur-sm border-brutal shadow-brutal p-4 overflow-hidden">
            <h4 class="text-starlight-500 font-semibold mb-4 pb-2 border-b border-cosmic-600/40 flex items-center">
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

    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { loadContentEntry, renderContent, getAllEntriesMetadata } from '../services/contentService';
import Header from '../components/layout/Header.vue';
import Footer from '../components/layout/Footer.vue';
import Tag from '../components/ui/Tag.vue';
import ImageLoader from '../components/ui/ImageLoader.vue';
import SpoilerBlock from '../components/ui/SpoilerBlock.vue';
import MarkdownImage from '../components/ui/MarkdownImage.vue';
import TableOfContents from '../components/TableOfContents.vue';
import { slugify } from 'transliteration';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const showAllSpoilers = ref(false);
const entry = ref(null);
const isShareMenuOpen = ref(false);
const showCopySuccess = ref(false);
const allMetadata = ref([]);
const contentArea = ref(null);
const tocHeadings = ref([]);

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
    default: return '未知分类';
  }
});

// 页面标题
const pageTitle = computed(() => {
  if (entry.value) {
    return `${entry.value.type}: ${entry.value.title} - Tobenot Story Wiki`;
  }
  return 'Tobenot Story Wiki';
});

// 更新页面标题
watch(pageTitle, (newTitle) => {
  document.title = newTitle;
});

// 分享功能
const getCurrentUrl = () => {
  return window.location.href;
};

const copyLink = () => {
  navigator.clipboard.writeText(getCurrentUrl()).then(() => {
    showCopySuccess.value = true;
    setTimeout(() => {
      showCopySuccess.value = false;
      isShareMenuOpen.value = false; // Optional: Close menu after copy
    }, 2000);
  });
};

const shareToWeibo = () => {
  const url = encodeURIComponent(getCurrentUrl());
  const title = encodeURIComponent(pageTitle.value);
  // Try to fetch an image if available
  const imageUrl = entry.value?.image ? encodeURIComponent(window.location.origin + resolveAssetPath(entry.value.image)) : '';
  window.open(`http://service.weibo.com/share/share.php?url=${url}&title=${title}${imageUrl ? '&pic=' + imageUrl : ''}`, '_blank');
  isShareMenuOpen.value = false;
};

const shareToQQ = () => {
  const url = encodeURIComponent(getCurrentUrl());
  const title = encodeURIComponent(pageTitle.value);
  const summary = encodeURIComponent(entry.value?.summary || document.querySelector('meta[name="description"]')?.content || ''); // Add summary if available
  const imageUrl = entry.value?.image ? encodeURIComponent(window.location.origin + resolveAssetPath(entry.value.image)) : '';
  window.open(`http://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${title}&desc=${summary}${imageUrl ? '&pics=' + imageUrl : ''}&summary=${summary}`, '_blank');
  isShareMenuOpen.value = false;
};

const pendingSourceLink = 'https://github.com/tobenot/tobenot.github.io/issues';

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
  isShareMenuOpen.value = false;
  try {
    // Load metadata first (or concurrently) - it's cached after the first time
    const metaPromise = getAllEntriesMetadata(); // Start fetching metadata
    const entryPromise = loadContentEntry(categoryType.value, entryId.value); // Start fetching entry

    // Await both promises
    allMetadata.value = await metaPromise;
    const data = await entryPromise;

    entry.value = data;

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

// 点击外部关闭分享菜单
const handleClickOutside = (event) => {
    const shareMenu = document.querySelector('.share-menu');
    // Ensure the click is not on the share button itself
    if (isShareMenuOpen.value && shareMenu && !shareMenu.contains(event.target) && !event.target.closest('.relative > button')) {
      isShareMenuOpen.value = false;
    }
};

// 初始加载和设置事件监听器
onMounted(() => {
  // loadData is now called by the watcher immediately
  document.addEventListener('click', handleClickOutside);
});

// 清理事件监听器
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

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

.btn-share { /* 分享按钮单独样式 */
   @apply bg-accent-500 text-white border-accent-700 hover:bg-accent-600;
}
.dark .btn-share {
    @apply bg-accent-600 text-white border-accent-500 hover:bg-accent-500;
}

/* 分享按钮和菜单样式 */
.share-btn {
  display: flex;
  align-items: center;
  justify-content: center; /* Center icon and text */
  padding: 0.5rem 0.75rem; /* Adjust padding */
  color: white;
  border: 2px solid #111827; /* 添加粗野主义边框 */
  font-size: 0.875rem; /* Tailwind's text-sm */
  line-height: 1.25rem;
  font-weight: 500; /* Tailwind's font-medium */
  transition: background-color 0.2s ease;
  text-align: left; /* Ensure text aligns left */
  width: 100%; /* Make buttons fill width */
}

.share-btn svg {
  margin-right: 0.5rem; /* Tailwind's mr-2 */
}

.share-menu {
  min-width: 12rem; /* Ensure minimum width */
}

/* 淡入淡出动画 for copy success message */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
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