<template>
  <div>
    <Header />
    <main class="wiki-container py-16 md:py-24 relative">
      <!-- 装饰性图案 - 使用 starlight 金色调 -->
      <div class="absolute top-20 left-10 w-96 h-96 bg-gradient-radial from-starlight-500/10 via-transparent to-transparent filter blur-3xl opacity-20 animate-pulse-slow"></div>
      <div class="absolute bottom-40 right-10 w-80 h-80 bg-gradient-radial from-starlight-400/10 via-transparent to-transparent filter blur-3xl opacity-20 animate-pulse-slow" style="animation-delay: 2s;"></div>
      
      <!-- 中央魔法阵 -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vh] h-[70vh] pointer-events-none">
        <div class="absolute inset-0 magical-circle opacity-20 animate-spin-slow"></div>
      </div>
      
      <section class="text-center relative z-10">
        <div class="inline-block py-10 px-4">
          <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-10 font-bold bg-gradient-to-r from-starlight-500 via-starlight-400 to-starlight-500 text-transparent bg-clip-text mx-auto max-w-full leading-normal tracking-wide">
            托贝诺特 世界观
          </h1>
          <div class="h-0.5 w-3/4 sm:w-2/3 lg:w-1/2 mx-auto bg-gradient-to-r from-transparent via-starlight-400 to-transparent"></div>
          <div class="h-0.5 w-1/2 sm:w-1/3 lg:w-1/4 mx-auto mt-1 bg-gradient-to-r from-transparent via-starlight-300 to-transparent"></div>
        </div>
        
        <p class="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mt-12 mb-16 leading-relaxed tracking-wide relative z-10">
          欢迎来到世界观 Wiki，在这里你可以探索各种作品中的设定。<br>目前Wiki正在建设中，许多条目有待补充，值得期待更新！<br>我期望这里变成百科全书，最终可以只通过Wiki（打开剧透模式后）<br>了解我所有作品内的所有设定和事件！<br>
          <span class="text-starlight-600 font-medium">祝你旅途愉快。</span>
        </p>
        
        <!-- 特殊创作入口 -->
        <div class="mb-12 flex flex-col sm:flex-row justify-center gap-4">
          <router-link to="/novels" class="special-entry novel-entry">
            <span class="text-2xl mb-1">📚︎</span>
            <span class="font-bold">小说坑</span>
            <span class="text-sm">探索创作中的小说</span>
          </router-link>
          
          <router-link to="/games" class="special-entry game-entry">
            <span class="text-2xl mb-1">🎮︎</span>
            <span class="font-bold">游戏坑</span>
            <span class="text-sm">查看游戏项目</span>
          </router-link>
        </div>

        <!-- 全局搜索组件 -->
        <div class="mb-16 max-w-xl mx-auto relative z-10">
          <GlobalSearch />
        </div>
        
        <div class="wiki-grid mt-20">
          <router-link v-for="(category, index) in categories" :key="index" 
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
        
        <div class="mt-20 max-w-2xl mx-auto px-6 py-8 bg-gray-50 backdrop-blur-sm border-2 border-slate-900 shadow-brutal">
          <p class="text-center text-gray-700 italic leading-relaxed">
            "在很远的古代，他们称我们为变异者。<br>
            后来，他们称我们为异人。<br>
            再后来，他们称我们为异能者。<br>
            很远的之后，短暂流行着'能力者'的称呼。<br>
            现在我们都是人类了。"<br>
            <span class="text-starlight-600 text-sm mt-2 block">——《论地球联合》，22xx年</span>
          </p>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from '../components/layout/Header.vue';
import Footer from '../components/layout/Footer.vue';
import GlobalSearch from '../components/GlobalSearch.vue';

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
    title: '小说坑',
    path: '/category/novels',
    description: '探索托贝诺特的小说作品',
    symbolClass: 'novel-symbol'
  },
  {
    title: '游戏坑',
    path: '/category/games',
    description: '了解托贝诺特的游戏项目',
    symbolClass: 'game-symbol'
  }
];
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

.game-symbol {
  @apply bg-gradient-to-br from-primary-500/70 to-primary-700/70;
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

.magical-circle {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 800'%3E%3Cdefs%3E%3Cstyle%3E .cls-1 %7B fill: none; stroke: %23AA894A; stroke-width: 1; opacity: 0.4; %7D %3C/style%3E%3C/defs%3E%3Ccircle class='cls-1' cx='400' cy='400' r='390'/%3E%3Ccircle class='cls-1' cx='400' cy='400' r='320'/%3E%3Ccircle class='cls-1' cx='400' cy='400' r='250'/%3E%3Cpath class='cls-1' d='M400,10V790 M10,400H790 M120,120L680,680 M680,120L120,680'/%3E%3Ccircle class='cls-1' cx='400' cy='400' r='100'/%3E%3Cpath class='cls-1' d='M450,400a50,50 0 1,0 -100,0a50,50 0 1,0 100,0'/%3E%3Ccircle class='cls-1' cx='400' cy='100' r='10'/%3E%3Ccircle class='cls-1' cx='400' cy='700' r='10'/%3E%3Ccircle class='cls-1' cx='100' cy='400' r='10'/%3E%3Ccircle class='cls-1' cx='700' cy='400' r='10'/%3E%3Ccircle class='cls-1' cx='170' cy='170' r='10'/%3E%3Ccircle class='cls-1' cx='630' cy='630' r='10'/%3E%3Ccircle class='cls-1' cx='630' cy='170' r='10'/%3E%3Ccircle class='cls-1' cx='170' cy='630' r='10'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
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

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 120s linear infinite;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
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

.special-entry {
  @apply flex flex-col items-center justify-center p-4 bg-white backdrop-blur-sm border-2 border-slate-900 transition-all duration-300 text-center w-full sm:w-64 no-underline text-gray-800 shadow-brutal;
}

.special-entry:hover {
  @apply shadow-brutal-lg transform -translate-y-1;
}

.novel-entry {
  @apply hover:border-secondary-400;
}

.novel-entry:hover span {
  @apply text-secondary-700;
}

.game-entry {
  @apply hover:border-primary-400;
}

.game-entry:hover span {
  @apply text-primary-700;
}
</style>