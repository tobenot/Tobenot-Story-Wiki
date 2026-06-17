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
              <div class="category-symbol novel-symbol" v-html="worksIcon"></div>
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
              <div class="category-symbol" :class="category.symbolClass" v-html="category.icon"></div>
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

// 粗野主义风格图标：粗描边、硬边角、几何感
const brutalistIcon = (paths) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="miter" class="brutal-icon">${paths}</svg>`;

const icons = {
  // 人物
  characters: brutalistIcon(
    '<circle cx="12" cy="7.5" r="3.5"/><path d="M4 21v-1a8 8 0 0 1 16 0v1"/>'
  ),
  // 地点
  locations: brutalistIcon(
    '<path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><rect x="9" y="7" width="6" height="6"/>'
  ),
  // 事件
  events: brutalistIcon(
    '<path d="M13 2 4 14h7l-2 8 9-12h-7l2-8z"/>'
  ),
  // 物品
  items: brutalistIcon(
    '<path d="M12 2 3 7v10l9 5 9-5V7l-9-5z"/><path d="M3 7l9 5 9-5"/><path d="M12 12v10"/>'
  ),
  // 概念
  concepts: brutalistIcon(
    '<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 2a7 7 0 0 0-4 12.6c1 .8 1.5 1.4 1.5 2.4h5c0-1 .5-1.6 1.5-2.4A7 7 0 0 0 12 2z"/>'
  ),
  // 作品
  works: brutalistIcon(
    '<path d="M4 4h7a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z"/><path d="M20 4h-7a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h7z"/>'
  ),
  // 主题
  themes: brutalistIcon(
    '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>'
  ),
};

const categories = [
  {
    title: '人物',
    path: '/category/characters',
    description: '探索各种作品中的角色',
    symbolClass: 'character-symbol',
    icon: icons.characters
  },
  {
    title: '地点',
    path: '/category/locations',
    description: '发现各种作品中的地点',
    symbolClass: 'location-symbol',
    icon: icons.locations
  },
  {
    title: '事件',
    path: '/category/events',
    description: '了解各种作品中的事件',
    symbolClass: 'event-symbol',
    icon: icons.events
  },
  {
    title: '物品',
    path: '/category/items',
    description: '浏览各种作品中的物品',
    symbolClass: 'item-symbol',
    icon: icons.items
  },
  {
    title: '概念',
    path: '/category/concepts',
    description: '理解各种作品中的概念',
    symbolClass: 'concept-symbol',
    icon: icons.concepts
  },
  {
    title: '作品',
    path: '/works',
    description: '按作品/篇章组织浏览',
    symbolClass: 'novel-symbol',
    icon: icons.works
  },
  {
    title: '主题',
    path: '/themes',
    description: '按主题聚合浏览',
    symbolClass: 'theme-symbol',
    icon: icons.themes
  }
];

const worksIcon = icons.works;
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
  @apply w-16 h-16 flex items-center justify-center relative border-2 border-slate-900;
  box-shadow: 4px 4px 0 0 rgba(15, 23, 42, 0.9);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  color: #fff;
}

/* 粗野主义：纯色块 + 高对比度图标 */
.character-symbol {
  background: #0f172a; /* slate-900 */
}

.location-symbol {
  background: theme('colors.secondary.600');
}

.event-symbol {
  background: theme('colors.primary.600');
}

.item-symbol {
  background: theme('colors.accent.600');
}

.concept-symbol {
  background: theme('colors.starlight.600');
}

.novel-symbol {
  background: theme('colors.starlight.700');
}

.theme-symbol {
  background: #334155; /* slate-700 */
}

.brutal-icon {
  @apply w-8 h-8;
}

.category-card:hover .category-symbol {
  transform: translate(-2px, -2px);
  box-shadow: 7px 7px 0 0 rgba(15, 23, 42, 0.9);
}

@media (max-width: 768px) {
  .wiki-grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
  }

  .category-symbol {
    @apply w-14 h-14;
  }

  .brutal-icon {
    @apply w-7 h-7;
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