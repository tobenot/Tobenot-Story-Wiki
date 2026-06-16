<template>
  <div>
    <!-- 标题（恢复原始样式） -->
    <section class="text-center relative z-10">
      <div class="inline-block py-10 px-4">
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-10 font-bold bg-gradient-to-r from-starlight-500 via-starlight-400 to-starlight-500 text-transparent bg-clip-text mx-auto max-w-full leading-normal tracking-wide">
          托贝诺特 世界观
        </h1>
        <div class="h-0.5 w-3/4 sm:w-2/3 lg:w-1/2 mx-auto bg-gradient-to-r from-transparent via-starlight-400 to-transparent"></div>
        <div class="h-0.5 w-1/2 sm:w-1/3 lg:w-1/4 mx-auto mt-1 bg-gradient-to-r from-transparent via-starlight-300 to-transparent"></div>
      </div>
    </section>

    <main class="wiki-container py-16 md:py-24">
      <section class="relative">
        <!-- 全局搜索组件 -->
        <div class="mb-16 max-w-xl mx-auto">
          <GlobalSearch />
        </div>

        <!-- 作品分类（默认）突出展示 -->
        <div class="mb-20">
          <router-link to="/works" class="works-highlight no-underline block mx-auto">
            <div class="flex items-center gap-6">
              <div class="category-symbol novel-symbol">
                <div class="symbol-inner"></div>
                <div class="symbol-glow"></div>
              </div>
              <div class="flex-1">
                <h2 class="text-3xl font-extrabold text-starlight-700 mb-2">作品分类</h2>
                <p class="text-gray-700 text-lg">默认浏览方式：按作品/篇章结构进入</p>
              </div>
              <span class="ml-auto text-sm font-bold px-3 py-2 rounded border-2 border-starlight-700 text-starlight-700 bg-starlight-50">默认</span>
            </div>
          </router-link>
        </div>

        <!-- 其他分类 -->
        <div class="mb-16">
          <h3 class="text-2xl font-bold text-center text-gray-800 mb-12">其他分类</h3>
          <div class="wiki-grid">
            <router-link v-for="(category, index) in otherCategories" :key="index" 
              :to="category.path" 
              class="category-card"
              :class="'category-' + index"
            >
              <div class="category-symbol" :class="category.symbolClass">
                <div class="symbol-inner"></div>
                <div class="symbol-glow"></div>
              </div>
              <h2 class="text-xl font-bold mb-2 mt-4 text-starlight-600">{{ category.title }}</h2>
              <p class="text-gray-600">{{ category.description }}</p>
            </router-link>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import GlobalSearch from '../components/GlobalSearch.vue';
import { computed } from 'vue';

const categories = [
  {
    title: '人物',
    path: '/category/characters',
    description: '探索各种作品中的角色',
    symbolClass: ''
  },
  {
    title: '地点',
    path: '/category/locations',
    description: '发现各种作品中的地点',
    symbolClass: 'location-symbol'
  },
  {
    title: '事件',
    path: '/category/events',
    description: '了解各种作品中的事件',
    symbolClass: 'event-symbol'
  },
  {
    title: '物品',
    path: '/category/items',
    description: '浏览各种作品中的物品',
    symbolClass: 'item-symbol'
  },
  {
    title: '概念',
    path: '/category/concepts',
    description: '理解各种作品中的概念',
    symbolClass: 'concept-symbol'
  },
  {
    title: '作品',
    path: '/works',
    description: '按作品/篇章组织浏览',
    symbolClass: 'novel-symbol'
  },
  {
    title: '主题',
    path: '/themes',
    description: '按主题聚合浏览',
    symbolClass: 'concept-symbol'
  }
];

const otherCategories = computed(() => categories.filter(c => c.path !== '/works'));
</script>

<style scoped>
.wiki-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

@media (max-width: 640px) {
  .wiki-container {
    padding: 0 1rem;
  }
}

.wiki-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
  max-width: 1080px;
  margin: 0 auto;
}

.category-card {
  @apply bg-white backdrop-blur-sm border-2 border-slate-900 transition-all duration-500 p-6 flex flex-col items-center text-center hover:border-starlight-300 overflow-hidden no-underline shadow-brutal;
  transform: perspective(1000px) rotateX(0deg);
}

.category-card:hover {
  @apply shadow-brutal-lg;
  transform: perspective(1000px) rotateX(5deg) translateY(-5px);
}

.category-0 { animation-delay: 0s; }
.category-1 { animation-delay: 0.1s; }
.category-2 { animation-delay: 0.2s; }
.category-3 { animation-delay: 0.3s; }
.category-4 { animation-delay: 0.4s; }

.category-symbol {
  @apply w-16 h-16 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden border-2 border-slate-900;
  box-shadow: 0 0 15px rgba(170, 137, 74, 0.15);
}

.location-symbol {
  @apply bg-gradient-to-br from-secondary-500/70 to-secondary-700/70;
}

.event-symbol {
  @apply bg-gradient-to-br from-primary-500/70 to-primary-700/70;
}

.item-symbol {
  @apply bg-gradient-to-br from-accent-500/70 to-accent-700/70;
}

.concept-symbol {
  @apply bg-gradient-to-br from-starlight-500/70 to-starlight-700/70;
}

.novel-symbol {
  @apply bg-gradient-to-br from-secondary-500/70 to-secondary-700/70;
}

.symbol-inner {
  @apply w-12 h-12 absolute;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(2px);
  animation: pulse 4s infinite alternate;
}

.symbol-glow {
  @apply w-14 h-14 absolute opacity-0;
  background: radial-gradient(circle, rgba(219, 189, 125, 0.3) 0%, transparent 70%);
  transition: opacity 0.3s ease;
}

.category-card:hover .symbol-inner {
  animation: pulse 2s infinite alternate;
}

.category-card:hover .symbol-glow {
  opacity: 0.8;
  animation: glow-pulse 2s infinite alternate;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

@keyframes glow-pulse {
  0% {
    transform: scale(0.9);
    opacity: 0.4;
  }
  100% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}

@media (max-width: 768px) {
  .wiki-grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
  }
  
  .category-symbol {
    @apply w-14 h-14;
  }
  
  .symbol-inner {
    @apply w-10 h-10;
  }
  
  .symbol-glow {
    @apply w-12 h-12;
  }
}

/* 作品分类突出样式 */
.works-highlight {
  @apply max-w-4xl w-full bg-white backdrop-blur-sm border-2 border-starlight-700 p-8 shadow-brutal transition-all;
}
.works-highlight:hover {
  @apply shadow-brutal-lg -translate-y-0.5;
}
</style>