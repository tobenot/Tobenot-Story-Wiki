<template>
  <div>
    <Header />
    <main class="py-16 max-w-7xl mx-auto px-4 sm:px-6 relative">
      <!-- 装饰性背景元素 -->
      <div class="absolute top-20 left-10 w-96 h-96 bg-gradient-radial from-primary-500/10 via-transparent to-transparent filter blur-3xl opacity-20 animate-pulse-slow"></div>
      <div class="absolute bottom-40 right-10 w-80 h-80 bg-gradient-radial from-primary-400/10 via-transparent to-transparent filter blur-3xl opacity-20 animate-pulse-slow" style="animation-delay: 2s;"></div>
      
      <!-- 页面标题 -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 text-transparent bg-clip-text mx-auto max-w-full leading-normal tracking-wide">
          托贝诺特 游戏坑
        </h1>
        <p v-if="pageSubtitle" class="mt-2 text-xl text-gray-600">{{ pageSubtitle }}</p>
        <div class="h-0.5 w-3/4 sm:w-2/3 lg:w-1/2 mx-auto mt-4 bg-gradient-to-r from-transparent via-primary-400 to-transparent"></div>
        <div class="h-0.5 w-1/2 sm:w-1/3 lg:w-1/4 mx-auto mt-1 bg-gradient-to-r from-transparent via-primary-300 to-transparent"></div>
      </div>

      <!-- 简介区域 -->
      <div class="max-w-3xl mx-auto mb-16 text-center">
        <p class="text-lg text-gray-700 mb-6">
          这里收集了托贝诺特正在开发或构思中的游戏项目，
          既有已经开始制作的实际游戏，也有仍处于构思阶段的游戏创意。
          这些游戏与小说共享同一个世界观体系。
        </p>
        <div class="flex justify-center gap-4 flex-wrap">
          <a href="#development" class="btn btn-secondary">进行中/原型项目</a>
          <a href="#concept" class="btn btn-secondary">构思中的点子</a>
          <router-link to="/category/games" class="btn btn-primary">查看游戏Wiki条目</router-link>
        </div>
      </div>

      <!-- 开发中的项目 -->
      <section id="development" class="mb-24">
        <h2 class="text-2xl font-bold mb-8 pb-2 border-b-2 border-primary-200 inline-block text-gray-800">
          进行中 / 原型项目
        </h2>
        
        <div v-if="developmentGames.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="game in developmentGames" :key="game.id" class="game-card group">
            <div class="h-48 bg-gradient-to-br from-primary-50 to-primary-100 border-b-2 border-slate-900 relative overflow-hidden">
              <img v-if="game.coverImage" :src="game.coverImage" :alt="game.title + ' cover'" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" @error="onImageError" />
              <div v-else class="absolute inset-0 flex items-center justify-center">
                <span class="text-5xl text-primary-200">🎮</span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-primary-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div class="p-6 flex flex-col flex-grow">
              <h3 class="text-xl font-bold text-gray-800 group-hover:text-primary-700 transition-colors">{{ game.title }}</h3>
              <p v-if="game.subtitle" class="text-sm text-primary-600 mb-2">{{ game.subtitle }}</p>
              <p class="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">{{ game.shortDescription || game.description }}</p>
              
              <div v-if="game.genres && game.genres.length" class="flex flex-wrap gap-2 mb-3">
                <span v-for="genre in game.genres" :key="genre" class="tag bg-primary-50 text-primary-700 border-primary-200 text-xs">{{ genre }}</span>
              </div>
              
              <div v-if="game.developmentProgress" class="mt-auto pt-3 space-y-1 mb-2 border-t border-gray-100">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">进度: {{ game.status === 'prototype' ? '原型' : '开发' }}</span>
                  <span class="text-primary-600 font-medium">{{ game.developmentProgress }}</span>
                </div>
                <div v-if="typeof game.developmentProgress === 'string' && game.developmentProgress.includes('%')" class="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div class="bg-primary-500 h-1.5" :style="{ width: game.developmentProgress }"></div>
                </div>
              </div>
              
              <div class="pt-2 mt-auto" :class="{ 'border-t border-gray-100': !game.developmentProgress }">
                <div class="text-xs text-gray-500 mb-2">
                  <span v-if="game.engine">引擎: {{ game.engine }}</span>
                  <span v-if="game.engine && game.platform && game.platform.length"> &bull; </span>
                  <span v-if="game.platform && game.platform.length">平台: {{ game.platform.join(', ') }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <a v-if="game.projectLink" :href="game.projectLink" target="_blank" class="text-primary-600 font-medium flex items-center text-sm group-hover:text-primary-700 transition-colors">
                    <span v-if="game.status === 'released'">前往商店</span>
                    <span v-else-if="game.demoLink">试玩Demo</span>
                    <span v-else>查看项目</span>
                    <span class="ml-1 transition-transform group-hover:translate-x-1">→</span>
                  </a>
                  <router-link v-else-if="game.wikiLink" :to="game.wikiLink" class="text-primary-600 font-medium flex items-center text-sm group-hover:text-primary-700 transition-colors">
                    查看详情 <span class="ml-1 transition-transform group-hover:translate-x-1">→</span>
                  </router-link>
                  <span v-else class="text-xs text-gray-400">暂无链接</span>
                </div>
                 <router-link v-if="game.wikiLink && game.projectLink" :to="game.wikiLink" class="text-xs text-gray-500 hover:text-primary-500 mt-1 inline-block">
                    相关Wiki条目
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-600">暂无进行中或原型阶段的游戏项目。</p>
      </section>
      
      <!-- 构思中的点子 -->
      <section id="concept" class="mb-16">
        <h2 class="text-2xl font-bold mb-8 pb-2 border-b-2 border-primary-200 inline-block text-gray-800">
          构思中的点子
        </h2>
        
        <div v-if="conceptGames.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="game in conceptGames" :key="game.id" class="game-card group bg-opacity-80">
            <div class="h-48 bg-gradient-to-br from-gray-50 to-gray-100 border-b-2 border-slate-900 relative overflow-hidden">
              <img v-if="game.coverImage" :src="game.coverImage" :alt="game.title + ' cover'" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" @error="onImageError" />
              <div v-else class="absolute inset-0 flex items-center justify-center">
                <span class="text-5xl text-gray-300">💡</span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-primary-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div class="p-6 flex flex-col flex-grow">
              <h3 class="text-xl font-bold text-gray-800 group-hover:text-primary-700 transition-colors">{{ game.title }}</h3>
              <p v-if="game.subtitle" class="text-sm text-primary-600 mb-2">{{ game.subtitle }}</p>
              <p class="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">{{ game.shortDescription || game.description }}</p>
              
              <div v-if="game.genres && game.genres.length" class="flex flex-wrap gap-2 mb-3">
                <span v-for="genre in game.genres" :key="genre" class="tag bg-gray-50 text-gray-700 border-gray-200 text-xs">{{ genre }}</span>
              </div>
              
              <div v-if="game.inspiration" class="mt-auto pt-3 border-t border-gray-100 text-xs">
                <p class="text-gray-700 font-medium mb-0.5">灵感来源:</p>
                <p class="text-gray-600">{{ game.inspiration }}</p>
              </div>
              
              <div class="flex justify-between items-center pt-2 mt-2" :class="{ 'border-t border-gray-100': !game.inspiration }">
                <div class="text-xs text-gray-500">
                  <span v-if="game.developmentProgress && game.status === 'concept'">状态: {{ game.developmentProgress }}</span>
                  <span v-else>状态: 构思中</span>
                </div>
                <router-link v-if="game.wikiLink" :to="game.wikiLink" class="text-primary-600 font-medium flex items-center text-sm group-hover:text-primary-700 transition-colors">
                  查看构思 <span class="ml-1 transition-transform group-hover:translate-x-1">→</span>
                </router-link>
                <span v-else class="text-xs text-gray-400">暂无链接</span>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-600">暂无构思中的游戏点子。</p>
      </section>
      
      <!-- 游戏与世界观 -->
      <section class="mb-16 p-8 border-2 border-slate-900 bg-white/80 backdrop-blur-sm shadow-brutal">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">游戏与世界观的关系</h2>
        <p class="text-gray-700 mb-4">
          游戏作为托贝诺特世界观的互动媒介，让玩家能够以另一种方式体验故事。
          每款游戏都致力于探索不同的游戏机制和技术实现，同时保持与整体世界观的连贯性。
          游戏中的设定和概念同样会被记录在Wiki中，与小说和其他内容形成交叉引用。
        </p>
        <div class="flex justify-center mt-6">
          <router-link to="/category/concepts" class="btn btn-secondary">
            探索世界观概念
          </router-link>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Header from '../components/layout/Header.vue';
import Footer from '../components/layout/Footer.vue';
import gamesData from '../data/gamesData.json';

const pageSubtitle = computed(() => {
  const devCount = developmentGames.value.length;
  const conceptCount = conceptGames.value.length;
  return `目前展示 ${devCount} 款进行中/原型项目， ${conceptCount} 个构思中的点子。`;
});

const developmentGames = computed(() => 
  gamesData.filter(game => game.status === 'development' || game.status === 'prototype')
);

const conceptGames = computed(() => 
  gamesData.filter(game => game.status === 'concept')
);

const onImageError = (event) => {
  event.target.style.display = 'none'; 
  // Placeholder logic could be more robust, e.g., by adding a class to the parent
  // and using CSS to show ::before content or a sibling placeholder element.
};

</script>

<style scoped>
.game-card {
  @apply bg-white backdrop-blur-sm border-2 border-slate-900 transition-all duration-300 relative shadow-brutal overflow-hidden flex flex-col;
  transform: translateY(0);
}

.game-card:hover {
  @apply border-primary-400 shadow-brutal-lg;
  transform: translateY(-3px);
}

.tag {
  @apply inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded-none;
}

/* 定义与游戏相关的颜色方案，使用primary色系 */
.bg-game-gradient {
  @apply bg-gradient-to-br from-primary-500 to-primary-600;
}

.game-section-bg {
  @apply bg-primary-50;
}
.h-48 { /* Ensure consistent height for card image area */
  height: 12rem;
}
</style> 