<template>
  <div>
    <Header />
    <main class="py-16 max-w-7xl mx-auto px-4 sm:px-6 relative">
      <!-- 装饰性背景元素 -->
      <div class="absolute top-20 left-10 w-96 h-96 bg-gradient-radial from-secondary-500/10 via-transparent to-transparent filter blur-3xl opacity-20 animate-pulse-slow"></div>
      <div class="absolute bottom-40 right-10 w-80 h-80 bg-gradient-radial from-secondary-400/10 via-transparent to-transparent filter blur-3xl opacity-20 animate-pulse-slow" style="animation-delay: 2s;"></div>
      
      <!-- 页面标题 -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-secondary-500 via-secondary-400 to-secondary-500 text-transparent bg-clip-text mx-auto max-w-full leading-normal tracking-wide">
          托贝诺特 小说坑
        </h1>
        <p v-if="pageSubtitle" class="mt-2 text-xl text-gray-600">{{ pageSubtitle }}</p>
        <div class="h-0.5 w-3/4 sm:w-2/3 lg:w-1/2 mx-auto mt-4 bg-gradient-to-r from-transparent via-secondary-400 to-transparent"></div>
        <div class="h-0.5 w-1/2 sm:w-1/3 lg:w-1/4 mx-auto mt-1 bg-gradient-to-r from-transparent via-secondary-300 to-transparent"></div>
      </div>

      <!-- 简介区域 -->
      <div class="max-w-3xl mx-auto mb-16 text-center">
        <p class="text-lg text-gray-700 mb-6">
          这里是托贝诺特的小说创作工坊，汇集了正在构思或创作中的所有小说项目。
          每部小说都会拥有自己的专属阅读站，而世界观设定则会整合到Wiki系统中。
        </p>
        <div class="flex justify-center gap-4 flex-wrap">
          <a href="#ongoing" class="btn btn-secondary">进行中的作品</a>
          <a href="#planned" class="btn btn-secondary">计划中的作品</a>
          <a href="#completed" class="btn btn-secondary">已完成的作品</a>
          <a href="#archived" class="btn btn-secondary">已归档的作品</a>
          <router-link to="/category/novels" class="btn btn-primary">查看小说Wiki条目</router-link>
        </div>
      </div>

      <!-- 进行中的作品 -->
      <section id="ongoing" class="mb-24">
        <h2 class="text-2xl font-bold mb-8 pb-2 border-b-2 border-secondary-200 inline-block text-gray-800">
          进行中的作品
        </h2>
        
        <div v-if="ongoingNovels.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="novel in ongoingNovels" :key="novel.id" class="novel-card group">
            <div class="h-48 bg-gradient-to-br from-secondary-50 to-secondary-100 border-b-2 border-slate-900 relative overflow-hidden">
              <ImageLoader 
                v-if="novel.coverImage" 
                :src="novel.coverImage" 
                :alt="novel.title + ' cover'" 
                imageClass="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                placeholderClass="w-full h-full flex items-center justify-center bg-secondary-50 text-secondary-200"
                errorClass="w-full h-full flex items-center justify-center bg-red-50 text-red-400"
              />
              <div v-else class="absolute inset-0 flex items-center justify-center">
                <span class="text-5xl text-secondary-200">📖</span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-secondary-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div class="p-6 flex flex-col flex-grow">
              <h3 class="text-xl font-bold text-gray-800 group-hover:text-secondary-700 transition-colors">{{ novel.title }}</h3>
              <p v-if="novel.subtitle" class="text-sm text-secondary-600 mb-2">{{ novel.subtitle }}</p>
              <p class="text-sm text-gray-600 mb-3 flex-grow max-h-36 overflow-y-auto pr-1 whitespace-pre-line description-scroll">{{ novel.description }}</p>
              
              <div v-if="novel.genres && novel.genres.length" class="flex flex-wrap gap-2 mb-3">
                <span v-for="genre in novel.genres" :key="genre" class="tag bg-secondary-50 text-secondary-700 border-secondary-200 text-xs">{{ genre }}</span>
              </div>
              <div v-if="novel.themes && novel.themes.length" class="mb-3">
                <p class="text-xs text-gray-500 font-medium">主题:</p>
                <div class="flex flex-wrap gap-1 mt-1">
                    <span v-for="theme in novel.themes" :key="theme" class="tag bg-gray-100 text-gray-700 border-gray-300 text-xs">{{ theme }}</span>
                </div>
              </div>
              <div v-if="novel.world" class="text-xs text-gray-500 mb-2">世界: <span class="font-medium text-gray-700">{{novel.world}}</span></div>

              <div class="mt-auto pt-3 border-t border-gray-100 space-y-2">
                <div class="text-xs text-gray-500">
                  <span v-if="novel.status === 'ongoing' && novel.chapters">状态: 更新中 · {{ novel.chapters }}章</span>
                  <span v-else-if="novel.currentProgress">状态: {{ novel.currentProgress }}</span>
                  <span v-else>状态: {{ novel.status }}</span>
                  <span v-if="novel.expectedLength" class="ml-2 text-gray-400">(预计: {{novel.expectedLength}})</span>
                </div>
                 <div v-if="novel.authorNotes" class="text-xs text-gray-600 bg-gray-50 p-2 border border-gray-200">
                    <p class="font-medium text-gray-700">作者注记:</p>
                    <p class="mt-0.5">{{ novel.authorNotes }}</p>
                </div>
                <div class="flex justify-between items-center">
                  <a v-if="novel.externalReadLink" :href="novel.externalReadLink" target="_blank" class="text-secondary-600 font-medium flex items-center text-sm group-hover:text-secondary-700 transition-colors">
                    前往阅读 <span class="ml-1 transition-transform group-hover:translate-x-1">→</span>
                  </a>
                  <router-link v-else-if="novel.wikiLink" :to="novel.wikiLink" class="text-secondary-600 font-medium flex items-center text-sm group-hover:text-secondary-700 transition-colors">
                    查看构思 <span class="ml-1 transition-transform group-hover:translate-x-1">→</span>
                  </router-link>
                   <span v-else class="text-xs text-gray-400">暂无链接</span>
                   <span v-if="novel.conceptionDate" class="text-xs text-gray-400">构思于: {{novel.conceptionDate}}</span>
                </div>
                <div v-if="novel.relatedWikiEntries && novel.relatedWikiEntries.length" class="pt-1">
                    <p class="text-xs font-medium text-gray-600 mb-0.5">相关Wiki:</p>
                    <ul class="list-disc list-inside text-xs">
                        <li v-for="entry in novel.relatedWikiEntries" :key="entry.link">
                            <router-link :to="entry.link" class="text-secondary-600 hover:text-secondary-700 hover:underline">{{ entry.title }}</router-link>
                        </li>
                    </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-600">暂无进行中的小说项目。</p>
      </section>
      
      <!-- 计划中的作品 -->
      <section id="planned" class="mb-16">
        <h2 class="text-2xl font-bold mb-8 pb-2 border-b-2 border-secondary-200 inline-block text-gray-800">
          计划中的作品
        </h2>
        
        <div v-if="plannedNovels.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="novel in plannedNovels" :key="novel.id" class="novel-card group bg-opacity-80">
            <div class="h-48 bg-gradient-to-br from-gray-50 to-gray-100 border-b-2 border-slate-900 relative overflow-hidden">
              <ImageLoader
                v-if="novel.coverImage"
                :src="novel.coverImage"
                :alt="novel.title + ' cover'"
                imageClass="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                placeholderClass="w-full h-full flex items-center justify-center bg-gray-50 text-gray-200"
                errorClass="w-full h-full flex items-center justify-center bg-red-50 text-red-400"
              />
              <div v-else class="absolute inset-0 flex items-center justify-center">
                <span class="text-5xl text-gray-300">🔮</span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-secondary-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div class="p-6 flex flex-col flex-grow">
              <h3 class="text-xl font-bold text-gray-800 group-hover:text-secondary-700 transition-colors">{{ novel.title }}</h3>
              <p v-if="novel.subtitle" class="text-sm text-secondary-600 mb-2">{{ novel.subtitle }}</p>
              <p class="text-sm text-gray-600 mb-3 flex-grow max-h-36 overflow-y-auto pr-1 whitespace-pre-line description-scroll">{{ novel.description }}</p>
              <div v-if="novel.genres && novel.genres.length" class="flex flex-wrap gap-2 mb-3">
                <span v-for="genre in novel.genres" :key="genre" class="tag bg-gray-50 text-gray-700 border-gray-200 text-xs">{{ genre }}</span>
              </div>
              <div v-if="novel.themes && novel.themes.length" class="mb-3">
                <p class="text-xs text-gray-500 font-medium">主题:</p>
                <div class="flex flex-wrap gap-1 mt-1">
                    <span v-for="theme in novel.themes" :key="theme" class="tag bg-gray-100 text-gray-700 border-gray-300 text-xs">{{ theme }}</span>
                </div>
              </div>
              <div v-if="novel.world" class="text-xs text-gray-500 mb-2">世界: <span class="font-medium text-gray-700">{{novel.world}}</span></div>
              <div class="mt-auto pt-3 border-t border-gray-100 space-y-2">
                 <div class="text-xs text-gray-500">
                  <span v-if="novel.currentProgress">状态: {{ novel.currentProgress }}</span>
                  <span v-else>状态: {{ novel.status === 'planned' ? '计划中' : novel.status }}</span>
                   <span v-if="novel.expectedLength" class="ml-2 text-gray-400">(预计: {{novel.expectedLength}})</span>
                </div>
                <div v-if="novel.authorNotes" class="text-xs text-gray-600 bg-gray-50 p-2 border border-gray-200">
                    <p class="font-medium text-gray-700">作者注记:</p>
                    <p class="mt-0.5">{{ novel.authorNotes }}</p>
                </div>
                <div class="flex justify-between items-center">
                  <router-link v-if="novel.wikiLink" :to="novel.wikiLink" class="text-secondary-600 font-medium flex items-center text-sm group-hover:text-secondary-700 transition-colors">
                    查看构思 <span class="ml-1 transition-transform group-hover:translate-x-1">→</span>
                  </router-link>
                  <span v-else class="text-xs text-gray-400">暂无链接</span>
                  <span v-if="novel.conceptionDate" class="text-xs text-gray-400">构思于: {{novel.conceptionDate}}</span>
                </div>
                <div v-if="novel.relatedWikiEntries && novel.relatedWikiEntries.length" class="pt-1">
                    <p class="text-xs font-medium text-gray-600 mb-0.5">相关Wiki:</p>
                    <ul class="list-disc list-inside text-xs">
                        <li v-for="entry in novel.relatedWikiEntries" :key="entry.link">
                            <router-link :to="entry.link" class="text-secondary-600 hover:text-secondary-700 hover:underline">{{ entry.title }}</router-link>
                        </li>
                    </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-600">暂无计划中的小说项目。</p>
      </section>
      
      <!-- 已完成的作品 -->
      <section id="completed" class="mb-24">
        <h2 class="text-2xl font-bold mb-8 pb-2 border-b-2 border-starlight-200 inline-block text-gray-800">
          已完成的作品
        </h2>
        <div v-if="completedNovels.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="novel in completedNovels" :key="novel.id" class="novel-card group">
            <div class="h-48 bg-gradient-to-br from-starlight-50 to-starlight-100 border-b-2 border-slate-900 relative overflow-hidden">
              <ImageLoader 
                v-if="novel.coverImage" 
                :src="novel.coverImage" 
                :alt="novel.title + ' cover'" 
                imageClass="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                placeholderClass="w-full h-full flex items-center justify-center bg-starlight-50 text-starlight-200"
                errorClass="w-full h-full flex items-center justify-center bg-red-50 text-red-400"
              />
              <div v-else class="absolute inset-0 flex items-center justify-center">
                <span class="text-5xl text-starlight-200">🎉</span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-starlight-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div class="p-6 flex flex-col flex-grow">
              <h3 class="text-xl font-bold text-gray-800 group-hover:text-starlight-700 transition-colors">{{ novel.title }}</h3>
              <p v-if="novel.subtitle" class="text-sm text-starlight-600 mb-2">{{ novel.subtitle }}</p>
              <p class="text-sm text-gray-600 mb-3 flex-grow max-h-36 overflow-y-auto pr-1 whitespace-pre-line description-scroll">{{ novel.description }}</p>
              <div v-if="novel.genres && novel.genres.length" class="flex flex-wrap gap-2 mb-3">
                <span v-for="genre in novel.genres" :key="genre" class="tag bg-starlight-50 text-starlight-700 border-starlight-200 text-xs">{{ genre }}</span>
              </div>
              <div v-if="novel.themes && novel.themes.length" class="mb-3">
                <p class="text-xs text-gray-500 font-medium">主题:</p>
                <div class="flex flex-wrap gap-1 mt-1">
                    <span v-for="theme in novel.themes" :key="theme" class="tag bg-gray-100 text-gray-700 border-gray-300 text-xs">{{ theme }}</span>
                </div>
              </div>
              <div v-if="novel.world" class="text-xs text-gray-500 mb-2">世界: <span class="font-medium text-gray-700">{{novel.world}}</span></div>
              <div class="mt-auto pt-3 border-t border-gray-100 space-y-2">
                 <div class="text-xs text-gray-500">
                  <span>状态: 已完成</span>
                  <span v-if="novel.chapters" class="ml-1">· {{ novel.chapters }}章</span>
                  <span v-if="novel.expectedLength" class="ml-2 text-gray-400">(全长: {{novel.expectedLength}})</span>
                </div>
                <div v-if="novel.authorNotes" class="text-xs text-gray-600 bg-gray-50 p-2 border border-gray-200">
                    <p class="font-medium text-gray-700">作者注记:</p>
                    <p class="mt-0.5">{{ novel.authorNotes }}</p>
                </div>
                <div class="flex justify-between items-center">
                  <a v-if="novel.externalReadLink" :href="novel.externalReadLink" target="_blank" class="text-starlight-600 font-medium flex items-center text-sm group-hover:text-starlight-700 transition-colors">
                    前往阅读 <span class="ml-1 transition-transform group-hover:translate-x-1">→</span>
                  </a>
                  <router-link v-else-if="novel.wikiLink" :to="novel.wikiLink" class="text-starlight-600 font-medium flex items-center text-sm group-hover:text-starlight-700 transition-colors">
                    查看详情 <span class="ml-1 transition-transform group-hover:translate-x-1">→</span>
                  </router-link>
                   <span v-else class="text-xs text-gray-400">暂无链接</span>
                   <span v-if="novel.conceptionDate" class="text-xs text-gray-400">完成于: {{novel.conceptionDate}}</span>
                </div>
                <div v-if="novel.relatedWikiEntries && novel.relatedWikiEntries.length" class="pt-1">
                    <p class="text-xs font-medium text-gray-600 mb-0.5">相关Wiki:</p>
                    <ul class="list-disc list-inside text-xs">
                        <li v-for="entry in novel.relatedWikiEntries" :key="entry.link">
                            <router-link :to="entry.link" class="text-starlight-600 hover:text-starlight-700 hover:underline">{{ entry.title }}</router-link>
                        </li>
                    </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-600">暂无已完成的小说项目。</p>
      </section>

      <!-- 已归档的作品 -->
      <section id="archived" class="mb-24">
        <h2 class="text-2xl font-bold mb-8 pb-2 border-b-2 border-gray-300 inline-block text-gray-800">
          已归档的作品
        </h2>
        <div v-if="archivedNovels.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="novel in archivedNovels" :key="novel.id" class="novel-card group bg-opacity-70">
            <div class="h-48 bg-gradient-to-br from-slate-100 to-slate-200 border-b-2 border-slate-900 relative overflow-hidden">
              <ImageLoader 
                v-if="novel.coverImage" 
                :src="novel.coverImage" 
                :alt="novel.title + ' cover'" 
                imageClass="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                placeholderClass="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300"
                errorClass="w-full h-full flex items-center justify-center bg-red-50 text-red-400"
              />
              <div v-else class="absolute inset-0 flex items-center justify-center">
                <span class="text-5xl text-slate-300">🗄️</span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-slate-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div class="p-6 flex flex-col flex-grow">
              <h3 class="text-xl font-bold text-gray-700 group-hover:text-slate-800 transition-colors">{{ novel.title }}</h3>
              <p v-if="novel.subtitle" class="text-sm text-slate-500 mb-2">{{ novel.subtitle }}</p>
              <p class="text-sm text-gray-500 mb-3 flex-grow max-h-36 overflow-y-auto pr-1 whitespace-pre-line description-scroll">{{ novel.description }}</p>
              <div v-if="novel.genres && novel.genres.length" class="flex flex-wrap gap-2 mb-3">
                <span v-for="genre in novel.genres" :key="genre" class="tag bg-slate-100 text-slate-600 border-slate-300 text-xs">{{ genre }}</span>
              </div>
              <div v-if="novel.themes && novel.themes.length" class="mb-3">
                <p class="text-xs text-gray-500 font-medium">主题:</p>
                <div class="flex flex-wrap gap-1 mt-1">
                    <span v-for="theme in novel.themes" :key="theme" class="tag bg-gray-100 text-gray-700 border-gray-300 text-xs">{{ theme }}</span>
                </div>
              </div>
              <div v-if="novel.world" class="text-xs text-gray-500 mb-2">世界: <span class="font-medium text-gray-600">{{novel.world}}</span></div>
              <div class="mt-auto pt-3 border-t border-gray-100 space-y-2">
                <div class="text-xs text-gray-500">
                  <span>状态: 已归档</span>
                </div>
                <div v-if="novel.authorNotes" class="text-xs text-gray-600 bg-gray-50 p-2 border border-gray-200">
                    <p class="font-medium text-gray-700">作者注记:</p>
                    <p class="mt-0.5">{{ novel.authorNotes }}</p>
                </div>
                <div class="flex justify-between items-center">
                  <a v-if="novel.externalReadLink" :href="novel.externalReadLink" target="_blank" class="text-slate-600 font-medium flex items-center text-sm group-hover:text-slate-700 transition-colors">
                    查看归档 <span class="ml-1 transition-transform group-hover:translate-x-1">→</span>
                  </a>
                  <router-link v-else-if="novel.wikiLink" :to="novel.wikiLink" class="text-slate-600 font-medium flex items-center text-sm group-hover:text-slate-700 transition-colors">
                    查看详情 <span class="ml-1 transition-transform group-hover:translate-x-1">→</span>
                  </router-link>
                   <span v-else class="text-xs text-gray-400">暂无链接</span>
                   <span v-if="novel.conceptionDate" class="text-xs text-gray-400">归档于: {{novel.conceptionDate}}</span>
                </div>
                <div v-if="novel.relatedWikiEntries && novel.relatedWikiEntries.length" class="pt-1">
                    <p class="text-xs font-medium text-gray-600 mb-0.5">相关Wiki:</p>
                    <ul class="list-disc list-inside text-xs">
                        <li v-for="entry in novel.relatedWikiEntries" :key="entry.link">
                            <router-link :to="entry.link" class="text-slate-600 hover:text-slate-700 hover:underline">{{ entry.title }}</router-link>
                        </li>
                    </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-600">暂无已归档的小说项目。</p>
      </section>
      
      <!-- 世界观与小说 -->
      <section class="mb-16 p-8 border-2 border-slate-900 bg-white/80 backdrop-blur-sm shadow-brutal">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">世界观与小说的关系</h2>
        <p class="text-gray-700 mb-4">
          在托贝诺特的创作体系中，小说是世界观的载体，而世界观则是小说的基础。
          每部小说都会扩展和丰富整个托贝诺特宇宙的一部分，这些设定会被整合到Wiki系统中，
          形成一个连贯且丰富的多维度叙事网络。
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
import novelsData from '../data/novelsData.json';
import ImageLoader from '../components/ui/ImageLoader.vue';

const pageSubtitle = computed(() => {
  const ongoingCount = ongoingNovels.value.length;
  const plannedCount = plannedNovels.value.length;
  const completedCount = completedNovels.value.length;
  const archivedCount = archivedNovels.value.length;
  return `目前收录 ${ongoingCount} 部进行中的作品，${plannedCount} 部计划中的作品，${completedCount} 部已完成的作品，${archivedCount} 部已归档的作品。`;
});

const ongoingNovels = computed(() => 
  novelsData.filter(novel => novel.status === 'ongoing')
);

const plannedNovels = computed(() => 
  novelsData.filter(novel => novel.status === 'planned')
);

const completedNovels = computed(() =>
  novelsData.filter(novel => novel.status === 'completed')
);

const archivedNovels = computed(() =>
  novelsData.filter(novel => novel.status === 'archived')
);

</script>

<style scoped>
.novel-card {
  @apply bg-white backdrop-blur-sm border-2 border-slate-900 transition-all duration-300 relative shadow-brutal overflow-hidden flex flex-col;
  transform: translateY(0);
}

.novel-card:hover {
  @apply border-secondary-400 shadow-brutal-lg;
  transform: translateY(-3px);
}

.tag {
  @apply inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded-none;
}

/* 定义与小说相关的颜色方案，使用secondary色系 */
.bg-novel-gradient {
  @apply bg-gradient-to-br from-secondary-500 to-secondary-600;
}

.novel-section-bg {
  @apply bg-secondary-50;
}
.h-48 { /* Ensure consistent height for card image area */
  height: 12rem;
}

/* 自定义描述区域滚动条 */
.description-scroll::-webkit-scrollbar {
  width: 4px;
}

.description-scroll::-webkit-scrollbar-track {
  background: rgba(243, 244, 246, 0.1);
  border-radius: 2px;
}

.description-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

.description-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(107, 114, 128, 0.7);
}

/* Firefox 滚动条 */
.description-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) rgba(243, 244, 246, 0.1);
}
</style> 