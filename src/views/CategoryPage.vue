<template>
  <div class="wiki-container">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <h1 class="text-3xl md:text-4xl font-bold mb-4 md:mb-0">{{ categoryTitle }}</h1>
      
      <!-- 当前文件夹指示 -->
      <div v-if="currentFolder" class="mb-4 md:mb-0 ml-4 text-slate-600 dark:text-slate-400">
        <span>当前文件夹: {{ currentFolder }}</span>
        <button 
          @click="clearFolder" 
          class="ml-2 text-primary-600 dark:text-primary-400 hover:underline"
        >
          返回全部
        </button>
      </div>
      
      <!-- 搜索和筛选部分 -->
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative">
          <input 
            type="search" 
            placeholder="搜索..." 
            v-model="searchQuery"
            class="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-500"
          />
          <!-- 搜索图标 -->
        </div>
        
        <div class="relative">
          <select 
            v-model="sortOption"
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 focus:ring-2 focus:ring-primary-500 appearance-none pr-8"
          >
            <option value="newest">最新添加</option>
            <option value="oldest">最早添加</option>
            <option value="a-z">字母排序 A-Z</option>
            <option value="z-a">字母排序 Z-A</option>
          </select>
          <!-- 筛选图标 -->
        </div>
      </div>
    </div>

    <!-- 文件夹列表 -->
    <div v-if="folders.length > 0 && !currentFolder" class="mb-8">
      <h2 class="text-xl font-bold mb-4">文件夹</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div 
          v-for="folder in folders" 
          :key="folder"
          @click="selectFolder(folder)"
          class="cursor-pointer p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 flex items-center"
        >
          <span class="text-lg">📁</span>
          <span class="ml-2">{{ folder }}</span>
        </div>
      </div>
    </div>
    
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="loading-spinner"></div>
      <span class="ml-3 text-slate-600 dark:text-slate-400">加载中...</span>
    </div>
    
    <div v-else-if="paginatedEntries.length === 0" class="text-center py-20">
      <div class="mb-4 text-slate-400 dark:text-slate-500">
        <!-- 空状态图标 -->
      </div>
      <h3 class="text-xl font-medium text-slate-700 dark:text-slate-300 mb-2">
        {{ currentFolder ? `文件夹 "${currentFolder}" 中` : '' }}{{ searchQuery ? '匹配搜索结果' : '' }}暂无{{ categoryTitle }}内容
      </h3>
      <p class="text-slate-600 dark:text-slate-400">敬请期待！</p>
    </div>
    
    <div v-else class="wiki-grid">
      <!-- 条目卡片 -->
      <router-link 
        v-for="entry in paginatedEntries" 
        :key="entry.id" 
        :to="`/entry/${categoryType}/${entry.id}`"
        class="wiki-card group flex flex-col overflow-hidden"
      >
        <div v-if="entry.image" class="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-700">
          <ImageLoader 
            :src="entry.image" 
            :alt="`${entry.title} preview image`" 
            imageClass="w-full h-full object-cover object-[center_30%] transition-transform duration-300 group-hover:scale-105"
            placeholderClass="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500"
            errorClass="w-full h-full flex items-center justify-center bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300"
          />
        </div>
        <div v-else class="aspect-video flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        
        <div class="flex-grow flex flex-col p-4">
          <h2 class="text-xl font-bold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{{ entry.title }}</h2>
          
          <div class="flex flex-wrap gap-2 my-3" v-if="entry.tags && entry.tags.length > 0">
            <Tag 
              v-for="tag in entry.tags" 
              :key="tag" 
              :text="tag"
              color="secondary"
              :clickable="true"
              @click.prevent="handleTagClick(tag)"
            />
          </div>
          
          <p v-if="entry.description" class="text-slate-600 dark:text-slate-400 line-clamp-3 flex-grow mb-4">
            {{ entry.description }}
          </p>
          
          <div class="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <span class="text-sm text-slate-500 dark:text-slate-400">
              <!-- 可以添加创建/更新日期 -->
            </span>
            <span class="text-primary-600 dark:text-primary-400 text-sm font-medium flex items-center">
              查看详情 <span class="ml-1 transition-transform group-hover:translate-x-1">→</span>
            </span>
          </div>
        </div>
      </router-link>
    </div>
    
    <!-- 分页控件 -->
    <div v-if="totalPages > 1" class="mt-10 flex justify-center">
      <nav class="flex items-center space-x-2">
        <button 
          class="btn btn-secondary p-2" 
          :disabled="currentPage === 1" 
          @click="prevPage"
        >
          <!-- 上一页图标 -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>

        <button 
          v-for="page in pagesToShow" 
          :key="page"
          class="btn px-4" 
          :class="page === currentPage ? 'btn-primary' : 'btn-secondary'"
          @click="goToPage(page)"
          :disabled="page === '...'"
        >
          {{ page }}
        </button>

        <button 
          class="btn btn-secondary p-2" 
          :disabled="currentPage === totalPages" 
          @click="nextPage"
        >
          <!-- 下一页图标 -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </nav>
    </div>
    
    <div class="mt-8 text-center">
      <router-link to="/" class="btn btn-secondary">
        返回首页
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { loadContentList } from '../services/contentService';
import Tag from '../components/ui/Tag.vue';
import ImageLoader from '../components/ui/ImageLoader.vue';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const allEntries = ref([]); // Store all loaded entries
const folders = ref([]);
const currentFolder = ref(route.query.folder || null); // 从 query 获取当前文件夹
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(12);
const sortOption = ref('newest'); // Default sort option

const handleTagClick = (tag) => {
  // Prevent navigation when clicking tag inside the link
  router.push({
    path: route.path, // Stay on the current category page
    query: { tag } 
  });
};

// Get category type from route parameters
const categoryType = computed(() => route.params.type || 'characters');

// Map category types to display titles
const categoryTitles = {
  characters: '人物',
  locations: '地点',
  items: '物品',
  events: '事件',
  concepts: '概念'
};

// Get the display title based on category type
const categoryTitle = computed(() => categoryTitles[categoryType.value] || '内容');

// 根据文件夹和搜索词过滤条目
const filteredEntries = computed(() => {
  let entries = allEntries.value;

  // 1. 按文件夹过滤
  if (currentFolder.value) {
    entries = entries.filter(entry => entry.category === currentFolder.value);
  } else {
    // 仅显示根目录条目 (category 为 null)
    entries = entries.filter(entry => !entry.category);
  }
  
  // 2. 按搜索词过滤 (忽略大小写)
  if (searchQuery.value) {
    const lowerCaseQuery = searchQuery.value.toLowerCase();
    entries = entries.filter(entry => 
      entry.title.toLowerCase().includes(lowerCaseQuery) ||
      (entry.description && entry.description.toLowerCase().includes(lowerCaseQuery)) ||
      (entry.tags && entry.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)))
    );
  }

  // 3. 应用排序
  const sortedEntries = [...entries].sort((a, b) => {
    switch (sortOption.value) {
      case 'newest':
        // Fallback: Z-A by title (replace with date logic later if available)
        return b.title.localeCompare(a.title);
      case 'oldest':
        // Fallback: A-Z by title (replace with date logic later if available)
        return a.title.localeCompare(b.title);
      case 'a-z':
        return a.title.localeCompare(b.title);
      case 'z-a':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  return sortedEntries;
});

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(filteredEntries.value.length / itemsPerPage.value);
});

// 获取当前页要显示的条目
const paginatedEntries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredEntries.value.slice(start, end);
});

// 获取要在分页控件中显示的页码数组（包括省略号）
const pagesToShow = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;
  const range = 2; // 当前页码左右各显示多少个页码
  const showEllipsis = total > (range * 2) + 3; // 是否需要显示省略号

  if (total <= 1) return [];

  pages.push(1); // 总是显示第一页

  if (showEllipsis && current > range + 2) {
    pages.push('...');
  }

  // 计算中间页码范围
  const startPage = Math.max(2, current - range);
  const endPage = Math.min(total - 1, current + range);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (showEllipsis && current < total - range - 1) {
    pages.push('...');
  }

  if (total > 1) {
    pages.push(total); // 总是显示最后一页
  }
  
  // 去重（当页码少时，可能会重复添加1或total）
  return [...new Set(pages)];
});

// 选择文件夹
const selectFolder = (folder) => {
  currentPage.value = 1; // Reset pagination
  currentFolder.value = folder;
  router.push({ query: { ...route.query, folder } }); // 更新 URL query
};

// 清除文件夹选择
const clearFolder = () => {
  currentPage.value = 1; // Reset pagination
  currentFolder.value = null;
  const { folder, ...restQuery } = route.query; // 移除 folder query
  router.push({ query: restQuery });
};

// 分页导航
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const goToPage = (page) => {
  if (page !== '...') {
    currentPage.value = page;
  }
};

// 加载内容列表
const loadData = async () => {
  loading.value = true;
  currentPage.value = 1; // Reset pagination on load
  try {
    const tag = route.query.tag;
    // Await the async function call
    const result = await loadContentList(categoryType.value, { tag });
    allEntries.value = result;
    
    // 提取所有唯一的文件夹名称
    const uniqueFolders = new Set(result.map(entry => entry.category).filter(Boolean));
    folders.value = Array.from(uniqueFolders);
    
  } catch (error) {
    console.error('Failed to load entries:', error);
    // Handle error state if needed
  } finally {
    loading.value = false;
  }
};

onMounted(loadData);

// 监听路由 query 的变化，特别是 'folder'
watch(() => route.query.folder, (newFolder) => {
  currentFolder.value = newFolder || null;
  currentPage.value = 1; // Reset pagination
  // 如果需要，可以在这里重新加载数据或仅重新计算过滤后的列表
  // loadData(); // 如果需要在文件夹切换时重新请求数据
});

// 监听搜索查询的变化
watch(searchQuery, () => {
  currentPage.value = 1; // Reset pagination on search
});

// 监听排序选项的变化
watch(sortOption, () => {
  currentPage.value = 1; // Reset pagination on sort change
});

// 监听路由参数 (type) 和标签 query 的变化
watch([categoryType, () => route.query.tag], loadData);

</script>

<style scoped>
.wiki-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

.wiki-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.wiki-card {
  display: flex;
  flex-direction: column;
  padding: 0;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color, theme('colors.slate.200'));
  background-color: var(--card-bg, white);
  transition: all 0.2s ease;
  overflow: hidden;
}

.wiki-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.07), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
  border-color: var(--hover-border-color, theme('colors.primary.300'));
}

.aspect-video {
  aspect-ratio: 16 / 9;
}

.tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background-color: var(--tag-bg, #edf2f7);
  color: var(--tag-color, #4a5568);
  font-size: 0.75rem;
  font-weight: 500;
}

.loading-spinner {
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 3px solid var(--spinner-color, #3498db);
  width: 1.5rem;
  height: 1.5rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (prefers-color-scheme: dark) {
  :root {
    --border-color: theme('colors.slate.700');
    --card-bg: theme('colors.slate.800');
    --hover-border-color: theme('colors.primary.600');
    --tag-bg: #2d3748;
    --tag-color: #cbd5e0;
    --spinner-color: #7f9cf5;
  }
}
</style>