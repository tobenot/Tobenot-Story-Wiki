<template>
  <div class="wiki-container">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-12">
      <h1 class="text-3xl md:text-4xl font-bold mb-6 md:mb-0 bg-gradient-to-r from-starlight-500 to-starlight-600 text-transparent bg-clip-text">{{ categoryTitle }}</h1>
      
      <!-- 当前文件夹指示 -->
      <div v-if="currentFolder" class="mb-4 md:mb-0 ml-4 text-gray-700">
        <span>当前文件夹: {{ currentFolder }}</span>
        <button 
          @click="clearFolder" 
          class="ml-2 text-starlight-600 hover:text-starlight-700 transition-colors"
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
            class="w-full pl-10 pr-4 py-2.5 border-2 border-slate-900 bg-white/90 backdrop-blur-sm focus:border-starlight-400 focus:ring-1 focus:ring-starlight-400/30 text-gray-700 placeholder-gray-500"
          />
          <!-- 搜索图标 -->
          <span class="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-starlight-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
        
        <div class="relative">
          <select 
            v-model="sortOption"
            class="w-full border-2 border-slate-900 bg-white/90 backdrop-blur-sm px-4 py-2.5 focus:border-starlight-400 focus:ring-1 focus:ring-starlight-400/30 appearance-none pr-8 text-gray-700"
          >
            <option value="newest">最新添加</option>
            <option value="oldest">最早添加</option>
            <option value="a-z">字母排序 A-Z</option>
            <option value="z-a">字母排序 Z-A</option>
          </select>
          <!-- 下拉图标 -->
          <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-starlight-500 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </div>
    </div>

    <!-- 文件夹列表 -->
    <div v-if="folders.length > 0 && !currentFolder" class="mb-12">
      <h2 class="text-xl font-bold mb-5 text-gray-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-starlight-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        文件夹
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div 
          v-for="folder in folders" 
          :key="folder"
          @click="selectFolder(folder)"
          class="cursor-pointer p-4 bg-white/80 backdrop-blur-sm border-2 border-slate-900 hover:border-starlight-400 hover:shadow-brutal flex items-center transition-all duration-300 group"
        >
          <span class="text-lg text-starlight-500 mr-2 group-hover:text-starlight-600 transition-colors">📁</span>
          <span class="text-gray-700 group-hover:text-gray-800 transition-colors">{{ folder }}</span>
        </div>
      </div>
    </div>
    
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin h-10 w-10 border-t-2 border-b-2 border-l-2 border-r-2 border-starlight-500"></div>
      <span class="ml-3 text-gray-600">加载中...</span>
    </div>
    
    <div v-else-if="paginatedEntries.length === 0" class="text-center py-20">
      <div class="mb-4 text-starlight-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      </div>
      <h3 class="text-xl font-medium text-gray-700 mb-2">
        {{ currentFolder ? `文件夹 "${currentFolder}" 中` : '' }}{{ searchQuery ? '匹配搜索结果' : '' }}暂无{{ categoryTitle }}内容
      </h3>
      <p class="text-gray-500">敬请期待！</p>
    </div>
    
    <div v-else class="wiki-grid">
      <!-- 条目卡片 -->
      <router-link 
        v-for="entry in paginatedEntries" 
        :key="entry.id" 
        :to="`/entry/${categoryType}/${entry.id}`"
        class="wiki-card group flex flex-col overflow-hidden"
      >
        <div v-if="entry.image" class="aspect-video overflow-hidden bg-gray-100 relative">
          <ImageLoader 
            :src="entry.image" 
            :alt="`${entry.title} preview image`" 
            imageClass="w-full h-full object-cover object-[center_30%] transition-transform duration-500 group-hover:scale-105"
            placeholderClass="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400"
            errorClass="w-full h-full flex items-center justify-center bg-red-50 text-red-400"
          />
          <!-- 渐变遮罩 -->
          <div class="absolute inset-0 bg-gradient-to-t from-white/90 via-gray-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div v-else class="aspect-video flex items-center justify-center bg-gray-50 text-gray-400 relative overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <!-- 装饰背景 -->
          <div class="absolute inset-0">
            <div class="absolute w-20 h-20 bg-starlight-500/5 blur-xl -top-5 -left-5"></div>
            <div class="absolute w-16 h-16 bg-starlight-400/5 blur-xl bottom-2 right-2"></div>
          </div>
        </div>
        
        <div class="flex-grow flex flex-col p-5">
          <h2 class="text-xl font-bold mb-2 text-gray-800 group-hover:text-starlight-700 transition-colors">{{ entry.title }}</h2>
          
          <div class="flex flex-wrap gap-2 my-3" v-if="entry.tags && entry.tags.length > 0">
            <Tag 
              v-for="tag in entry.tags" 
              :key="tag" 
              :text="tag"
              color="starlight"
              :clickable="true"
              @click.prevent="handleTagClick(tag)"
            />
          </div>
          
          <p v-if="entry.description" class="text-gray-600 line-clamp-3 flex-grow mb-4 text-sm">
            {{ entry.description }}
          </p>
          
          <div class="mt-auto pt-4 border-t border-gray-200 flex justify-between items-center">
            <span class="text-xs text-gray-500">
              <!-- 可以添加创建/更新日期 -->
            </span>
            <span class="text-starlight-600 text-sm font-medium flex items-center group-hover:text-starlight-700 transition-colors">
              查看详情 <span class="ml-1 transition-transform group-hover:translate-x-1">→</span>
            </span>
          </div>
        </div>

        <!-- 卡片hover装饰 -->
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300">
          <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-starlight-300 to-transparent"></div>
          <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-starlight-300 to-transparent"></div>
        </div>
      </router-link>
    </div>
    
    <!-- 分页控件 -->
    <div v-if="totalPages > 1" class="mt-12 flex justify-center">
      <nav class="flex items-center space-x-2">
        <button 
          class="btn-page" 
          :disabled="currentPage === 1" 
          @click="prevPage"
          :class="{'btn-page-disabled': currentPage === 1}"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>

        <button 
          v-for="page in pagesToShow" 
          :key="page"
          class="btn-page" 
          :class="{'btn-page-active': page === currentPage, 'btn-page-disabled': page === '...'}"
          @click="goToPage(page)"
          :disabled="page === '...'"
        >
          {{ page }}
        </button>

        <button 
          class="btn-page" 
          :disabled="currentPage === totalPages" 
          @click="nextPage"
          :class="{'btn-page-disabled': currentPage === totalPages}"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </nav>
    </div>
    
    <div class="mt-10 text-center">
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
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.wiki-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.wiki-card {
  @apply bg-white backdrop-blur-sm border-2 border-slate-900 transition-all duration-300 relative shadow-brutal;
  transform: translateY(0);
}

.wiki-card:hover {
  @apply border-starlight-400 shadow-brutal-lg;
  transform: translateY(-3px);
}

.aspect-video {
  aspect-ratio: 16 / 9;
}

.btn-page {
  @apply flex items-center justify-center h-9 w-9 bg-white text-gray-700 border-2 border-slate-900 transition-all;
}

.btn-page:hover:not(:disabled) {
  @apply bg-gray-50 text-gray-800 border-gray-300;
}

.btn-page-active {
  @apply bg-starlight-50 text-starlight-700 border-starlight-200;
}

.btn-page-disabled {
  @apply cursor-not-allowed opacity-40;
}

@media (max-width: 768px) {
  .wiki-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 640px) {
  .wiki-grid {
    grid-template-columns: 1fr;
  }
}
</style>