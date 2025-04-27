<template>
  <div class="global-search relative">
    <div class="search-container relative">
      <input
        ref="searchInput"
        v-model="searchQuery"
        @focus="showResults = true; onFocus && onFocus()"
        @input="handleInput"
        @keydown.down="navigateResults(1)"
        @keydown.up="navigateResults(-1)"
        @keydown.enter="handleEnter"
        @keydown.esc="hideResults"
        @blur="onBlur"
        type="text"
        placeholder="搜索任何内容..."
        class="w-full py-3 pl-10 pr-4 bg-white border-2 border-slate-900 dark:border-slate-700 dark:bg-cosmic-800 shadow-brutal text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:border-starlight-500 focus:ring-1 focus:ring-starlight-500 transition-colors"
      />
      <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-starlight-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
      <span 
        v-if="searchQuery" 
        @click="clearSearch" 
        class="absolute right-4 top-1/2 transform -translate-y-1/2 text-starlight-600 hover:text-starlight-700 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </span>
    </div>

    <!-- 搜索结果下拉框 -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="showResults && filteredItems.length > 0" class="search-results absolute z-50 w-full mt-2 bg-white/90 backdrop-blur-sm border-2 border-slate-900 shadow-brutal overflow-hidden">
        <div class="search-results-header border-b border-slate-200 px-4 py-2 text-xs text-slate-600">
          找到 {{ filteredItems.length }} 个匹配的结果
        </div>
        <ul class="max-h-96 overflow-y-auto">
          <li 
            v-for="(item, index) in filteredItems" 
            :key="index"
            @click="navigateToItem(item)"
            :class="{ 'bg-gray-100/80': index === selectedIndex }"
            class="p-4 border-b border-gray-200/20 last:border-0 cursor-pointer hover:bg-gray-100/50"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0 mr-3">
                <span :class="getCategoryClass(item.type)" class="category-icon inline-flex items-center justify-center w-8 h-8 border-2 border-slate-900 bg-slate-100 dark:bg-cosmic-700">
                  <span class="text-xs text-starlight-600">{{ getCategoryInitial(item.type) }}</span>
                </span>
              </div>
              <div class="flex-1">
                <div class="text-gray-800 font-medium">{{ item.title }}</div>
                <div v-if="item.description" class="text-gray-600 text-sm mt-1 line-clamp-1">{{ item.description }}</div>
                <div class="flex mt-1.5 space-x-2">
                  <span class="text-xs px-2 py-0.5 border border-slate-900 bg-gray-200 text-starlight-700">{{ getCategoryName(item.type) }}</span>
                  <span v-for="(tag, tagIndex) in item.tags?.slice(0, 2)" :key="tagIndex" class="text-xs px-2 py-0.5 border border-slate-900 bg-gray-100 text-gray-600">{{ tag }}</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div v-if="filteredItems.length > 5" class="search-results-footer border-t border-gray-200 px-4 py-2 text-xs text-gray-600 text-center">
          请使用 ↑ ↓ 箭头键选择，Enter 确认
        </div>
      </div>
    </transition>

    <!-- 无结果时的提示 -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="showResults && searchQuery && filteredItems.length === 0" class="search-results absolute z-50 w-full mt-2 bg-white/90 backdrop-blur-sm border-2 border-slate-900 shadow-brutal overflow-hidden p-4 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12.5h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-slate-700">未找到关于 "{{ searchQuery }}" 的结果</p>
        <p class="text-slate-500 text-sm mt-1">请尝试使用其他关键词</p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getAllEntriesMetadata } from '../services/contentService';

const router = useRouter();
const searchQuery = ref('');
const allItems = ref([]);
const showResults = ref(false);
const selectedIndex = ref(0);
const loading = ref(true);
const resultRefs = ref([]);

// 当搜索查询变化时，重置选中的索引
watch(searchQuery, () => {
  selectedIndex.value = 0;
});

// 过滤搜索结果
const filteredItems = computed(() => {
  if (!searchQuery.value.trim()) {
    return [];
  }
  
  const query = searchQuery.value.toLowerCase();
  return allItems.value.filter(item => {
    const titleMatch = item.title.toLowerCase().includes(query);
    const descMatch = item.description ? item.description.toLowerCase().includes(query) : false;
    const tagsMatch = item.tags ? item.tags.some(tag => tag.toLowerCase().includes(query)) : false;
    
    return titleMatch || descMatch || tagsMatch;
  }).slice(0, 8); // 最多显示8个结果
});

// 获取分类名称
const getCategoryName = (type) => {
  const categoryMap = {
    'characters': '人物',
    'locations': '地点',
    'events': '事件',
    'items': '物品',
    'concepts': '概念'
  };
  
  return categoryMap[type] || type;
};

// 获取分类样式类
const getCategoryClass = (type) => {
  const classMap = {
    'characters': 'bg-primary-100 border-primary-200',
    'locations': 'bg-gray-100 border-gray-200',
    'events': 'bg-gray-100 border-gray-200',
    'items': 'bg-accent-100 border-accent-200',
    'concepts': 'bg-starlight-100 border-starlight-300'
  };
  
  return `border ${classMap[type] || 'bg-gray-100 border-gray-200'}`;
};

// 处理输入
const handleInput = () => {
  showResults.value = searchQuery.value.trim().length > 0;
};

// 清除搜索
const clearSearch = () => {
  searchQuery.value = '';
  showResults.value = false;
};

// 导航到搜索结果
const navigateToItem = (item) => {
  if (item && item.type && item.id) {
    router.push(`/entry/${item.type}/${item.id}`);
    clearSearch();
  }
};

// 使用键盘导航搜索结果
const navigateResults = (direction) => {
  if (filteredItems.value.length === 0) return;
  
  const newIndex = selectedIndex.value + direction;
  if (newIndex >= 0 && newIndex < filteredItems.value.length) {
    selectedIndex.value = newIndex;
    
    // 确保选中的项在视图内
    const selectedElement = document.querySelector(`.search-results li:nth-child(${selectedIndex.value + 1})`);
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest' });
    }
  }
};

// 处理回车键
const handleEnter = () => {
  if (filteredItems.value.length > 0) {
    navigateToItem(filteredItems.value[selectedIndex.value]);
  }
};

// 隐藏搜索结果
const hideResults = () => {
  showResults.value = false;
};

// 点击页面其他位置时隐藏搜索结果
const handleClickOutside = (event) => {
  const searchContainer = document.querySelector('.global-search');
  if (searchContainer && !searchContainer.contains(event.target)) {
    hideResults();
  }
};

// 加载所有条目元数据
const loadAllItems = async () => {
  loading.value = true;
  try {
    allItems.value = await getAllEntriesMetadata();
  } catch (error) {
    console.error('Failed to load search items:', error);
  } finally {
    loading.value = false;
  }
};

// 获取分类初始字母
const getCategoryInitial = (type) => {
  const initialMap = {
    'characters': '人',
    'locations': '地',
    'events': '事',
    'items': '物',
    'concepts': '念'
  };
  
  return initialMap[type] || '?';
};

// 新增键盘导航焦点方法
const onFocus = () => {
  // 可以添加焦点处理逻辑
};

const onBlur = () => {
  // 可以延迟隐藏结果，以便于点击结果
  setTimeout(() => {
    if (!document.activeElement.closest('.search-results')) {
      hideResults();
    }
  }, 200);
};

onMounted(() => {
  loadAllItems();
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.search-results {
  max-height: calc(100vh - 200px);
}

.category-icon {
  position: relative;
}

.inner-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: rgba(170, 137, 74, 0.1);
}

/* 自定义滚动条样式 */
.search-results ul::-webkit-scrollbar {
  width: 6px;
}

.search-results ul::-webkit-scrollbar-track {
  background: rgba(200, 200, 200, 0.2);
  border-radius: 3px;
}

.search-results ul::-webkit-scrollbar-thumb {
  background-color: rgba(170, 137, 74, 0.3);
  border-radius: 3px;
}

.search-results ul::-webkit-scrollbar-thumb:hover {
  background-color: rgba(170, 137, 74, 0.5);
}
</style> 