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
        <div class="mb-16">
          <router-link to="/works" class="works-highlight no-underline block mx-auto">
            <div class="flex items-center gap-6">
              <div class="category-symbol novel-symbol" v-html="worksIcon"></div>
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h2 class="text-3xl font-extrabold text-white">作品分类</h2>
                  <span class="text-xs font-bold px-2 py-1 border-2 border-white text-white">默认</span>
                </div>
                <p class="text-starlight-200 text-lg">默认浏览方式：按作品/篇章结构进入</p>
              </div>
              <span class="ml-auto text-2xl text-white">→</span>
            </div>
          </router-link>
        </div>

        <!-- 其他分类 -->
        <div class="mb-16">
          <div class="section-divider">
            <span class="section-eyebrow">其他分类</span>
          </div>
          <div class="wiki-grid">
            <router-link v-for="(category, index) in otherCategories" :key="index"
              :to="category.path"
              class="category-card"
              :class="'category-' + index"
            >
              <div class="category-symbol" :class="category.symbolClass" v-html="category.icon"></div>
              <h2 class="text-xl font-bold mb-2 mt-4 text-slate-800">{{ category.title }}</h2>
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
import { categoryIcons } from '../data/categoryIcons';

const categories = [
  {
    title: '人物',
    path: '/category/characters',
    description: '探索各种作品中的角色',
    symbolClass: 'character-symbol',
    icon: categoryIcons.characters
  },
  {
    title: '地点',
    path: '/category/locations',
    description: '发现各种作品中的地点',
    symbolClass: 'location-symbol',
    icon: categoryIcons.locations
  },
  {
    title: '事件',
    path: '/category/events',
    description: '了解各种作品中的事件',
    symbolClass: 'event-symbol',
    icon: categoryIcons.events
  },
  {
    title: '物品',
    path: '/category/items',
    description: '浏览各种作品中的物品',
    symbolClass: 'item-symbol',
    icon: categoryIcons.items
  },
  {
    title: '概念',
    path: '/category/concepts',
    description: '理解各种作品中的概念',
    symbolClass: 'concept-symbol',
    icon: categoryIcons.concepts
  },
  {
    title: '作品',
    path: '/works',
    description: '按作品/篇章组织浏览',
    symbolClass: 'novel-symbol',
    icon: categoryIcons.works
  },
  {
    title: '主题',
    path: '/themes',
    description: '按主题聚合浏览',
    symbolClass: 'theme-symbol',
    icon: categoryIcons.themes
  }
];

const worksIcon = categoryIcons.works;
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

/* 粗野主义按压 */
.category-card:active {
  transform: translate(6px, 6px);
  box-shadow: 0 0 0 0 rgba(15, 23, 42, 0.9);
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

/* 作品分类：全页唯一的高对比实心色块，主角 */
.works-highlight {
  @apply w-full border-2 border-slate-900 p-8 shadow-brutal transition-all;
  max-width: 1080px;
  background: theme('colors.starlight.800');
}
.works-highlight:hover {
  @apply shadow-brutal-lg -translate-y-0.5;
  background: theme('colors.starlight.700');
}
.works-highlight:active {
  transform: translate(6px, 6px);
  box-shadow: 0 0 0 0 rgba(15, 23, 42, 0.9);
}
.works-highlight .category-symbol {
  @apply w-20 h-20;
  background: #fff;
  color: theme('colors.starlight.800');
  box-shadow: 4px 4px 0 0 rgba(255, 255, 255, 0.9);
}
.works-highlight .brutal-icon {
  @apply w-10 h-10;
}

/* 其他分类：降级为细线 + 小号 eyebrow，不再当第二个头条 */
.section-divider {
  @apply flex items-center gap-4 mb-8;
}
.section-divider::after {
  content: '';
  @apply flex-1 h-0.5 bg-slate-300;
}
.section-eyebrow {
  @apply text-sm font-bold tracking-widest uppercase text-slate-500 whitespace-nowrap;
}
</style>