<template>
  <div class="relative max-w-xl mx-auto">
    <input
      type="search"
      v-model="searchQuery"
      placeholder="搜索 Wiki 条目 (标题, 标签, 内容)..."
      class="w-full px-4 py-2 pr-10 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-800 dark:text-slate-200"
      @input="debouncedSearch"
      @focus="isFocused = true"
      @blur="handleBlur"
    />
    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <svg class="h-5 w-5 text-slate-400 dark:text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>

    <!-- Loading/Error State -->
    <div v-if="isLoadingIndex || loadError" class="mt-2 text-sm text-center text-slate-500 dark:text-slate-400">
      <span v-if="isLoadingIndex">正在加载搜索索引...</span>
      <span v-else-if="loadError" class="text-red-500">{{ loadError }}</span>
    </div>

    <!-- Search Results Dropdown -->
    <div
      v-if="showResults && indexLoaded && !loadError"
      class="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-lg max-h-80 overflow-y-auto"
      ref="resultsDropdown"
    >
      <ul v-if="results.length > 0">
        <li
          v-for="result in results"
          :key="result.id"
          class="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
          @mousedown="navigateToResult(result)" 
        >
          <router-link :to="result.path" class="block text-slate-700 dark:text-slate-200">
            {{ result.title }}
          </router-link>
          <span class="text-xs text-slate-500 dark:text-slate-400 ml-2">({{ getCategoryName(result.type) }})</span>
        </li>
      </ul>
      <div v-else-if="searchQuery.length > 0" class="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
        没有找到匹配 "{{ searchQuery }}" 的结果。
      </div>
      <div v-else class="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
        请输入关键词进行搜索。
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSearch } from '../composables/useSearch';
import debounce from 'lodash-es/debounce';

const router = useRouter();
const { search, isLoadingIndex, indexLoaded, loadError } = useSearch();

const searchQuery = ref('');
const results = ref([]);
const isFocused = ref(false);
const resultsDropdown = ref(null); // Ref for the dropdown element

const showResults = computed(() => isFocused.value && (searchQuery.value.length > 0 || results.value.length > 0 || !indexLoaded.value || loadError.value));

// Debounced search function
const performSearch = () => {
  if (indexLoaded.value && searchQuery.value.length > 0) {
    results.value = search(searchQuery.value);
    console.log('Search results:', results.value);
  }
  else if (searchQuery.value.length === 0) {
    results.value = []; // Clear results if query is empty
  }
};

const debouncedSearch = debounce(performSearch, 300); // 300ms debounce

// Watch for query changes to trigger debounced search
watch(searchQuery, (newQuery) => {
    if (newQuery.length > 0) {
        debouncedSearch();
    } else {
        results.value = []; // Clear instantly if input is empty
        debouncedSearch.cancel(); // Cancel any pending debounced calls
    }
});


// Handle blur with a slight delay to allow clicks on results
const handleBlur = () => {
  // Use setTimeout to delay hiding the results
  // This allows the @mousedown event on the results list to fire before blur hides it
  setTimeout(() => {
      isFocused.value = false;
  }, 150);
};

// Navigate to the selected result page
// Use @mousedown on the result item instead of @click
// because @mousedown fires before the input's @blur event
const navigateToResult = (result) => {
  if (result.path) {
      searchQuery.value = ''; // Clear search input
      results.value = []; // Clear results
      isFocused.value = false; // Hide dropdown
      router.push(result.path);
  }
};

// Helper to get category name
const getCategoryName = (type) => {
  switch(type) {
    case 'characters': return '人物';
    case 'locations': return '地点';
    case 'events': return '事件';
    default: return '未知';
  }
};

</script>

<style scoped>
/* Add any additional scoped styles if needed */
</style> 