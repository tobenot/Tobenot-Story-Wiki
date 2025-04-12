<template>
  <div class="wiki-container">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <h1 class="text-3xl md:text-4xl font-bold mb-4 md:mb-0">{{ categoryTitle }}</h1>
      
      <!-- 搜索和筛选部分 -->
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative">
          <input 
            type="search" 
            placeholder="搜索..." 
            class="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-500"
          />
          <!-- 搜索图标 -->
        </div>
        
        <div class="relative">
          <select class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 focus:ring-2 focus:ring-primary-500">
            <option value="newest">最新添加</option>
            <option value="oldest">最早添加</option>
            <option value="a-z">字母排序 A-Z</option>
            <option value="z-a">字母排序 Z-A</option>
          </select>
          <!-- 筛选图标 -->
        </div>
      </div>
    </div>
    
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="loading-spinner"></div>
      <span class="ml-3 text-slate-600 dark:text-slate-400">加载中...</span>
    </div>
    
    <div v-else-if="entries.length === 0" class="text-center py-20">
      <div class="mb-4 text-slate-400 dark:text-slate-500">
        <!-- 空状态图标 -->
      </div>
      <h3 class="text-xl font-medium text-slate-700 dark:text-slate-300 mb-2">暂无{{ categoryTitle }}内容</h3>
      <p class="text-slate-600 dark:text-slate-400">敬请期待！</p>
    </div>
    
    <div v-else class="wiki-grid">
      <router-link 
        v-for="entry in entries" 
        :key="entry.id" 
        :to="`/entry/${categoryType}/${entry.id}`"
        class="wiki-card flex flex-col"
      >
        <ImageLoader 
          v-if="entry.image" 
          :src="entry.image" 
          :alt="`${entry.title} preview image`" 
          class="w-full h-48 object-cover rounded-t-lg" 
        />
        
        <div class="flex-grow flex flex-col p-4">
          <h2 class="text-xl font-bold mb-2">{{ entry.title }}</h2>
          
          <div class="flex flex-wrap gap-2 my-3" v-if="entry.tags && entry.tags.length > 0">
            <Tag 
              v-for="tag in entry.tags" 
              :key="tag" 
              :text="tag"
              color="primary"
              :clickable="true"
              @click.prevent="handleTagClick(tag)"
            />
          </div>
          
          <p v-if="entry.description" class="text-slate-600 dark:text-slate-400 line-clamp-3 flex-grow">
            {{ entry.description }}
          </p>
          
          <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <span class="text-sm text-slate-500 dark:text-slate-400">
              <!-- 可以添加创建/更新日期 -->
            </span>
            <span class="text-primary-600 dark:text-primary-400 text-sm font-medium">查看详情 →</span>
          </div>
        </div>
      </router-link>
    </div>
    
    <!-- 分页控件 -->
    <div class="mt-10 flex justify-center">
      <nav class="flex items-center space-x-2">
        <button class="btn btn-secondary p-2" disabled>
          <!-- 上一页图标 -->
        </button>
        <button class="btn btn-primary px-4">1</button>
        <button class="btn btn-secondary px-4">2</button>
        <button class="btn btn-secondary px-4">3</button>
        <button class="btn btn-secondary p-2">
          <!-- 下一页图标 -->
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
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { loadContentList } from '../services/contentService';
import Tag from '../components/ui/Tag.vue';
import ImageLoader from '../components/ui/ImageLoader.vue';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const entries = ref([]);

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

// 加载内容列表
onMounted(async () => {
  try {
    const tag = route.query.tag;
    const result = await loadContentList(categoryType.value, { tag });
    entries.value = result;
  } catch (error) {
    console.error('Failed to load entries:', error);
    // Handle error state if needed
  } finally {
    loading.value = false;
  }
});
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
  display: block;
  padding: 0;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color, #e2e8f0);
  background-color: var(--card-bg, white);
  transition: all 0.2s ease;
  height: 100%;
}

.wiki-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.wiki-card img {
  /* Ensure image doesn't overflow rounded corners */
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
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
    --border-color: #2d3748;
    --card-bg: #1a202c;
    --tag-bg: #2d3748;
    --tag-color: #cbd5e0;
    --spinner-color: #7f9cf5;
  }
}
</style>