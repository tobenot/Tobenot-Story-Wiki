<template>
  <div class="wiki-container">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-starlight-800 to-starlight-700 text-transparent bg-clip-text">{{ work?.title || workId }}</h1>
      <router-link to="/works" class="btn btn-secondary">返回作品索引</router-link>
    </div>
    <div v-if="loading" class="py-12 text-center text-gray-600">加载中...</div>
    <div v-else-if="!work" class="py-12 text-center text-gray-600">未找到该作品</div>

    <div v-else>
      <!-- ponytail: cover 走与正文图片同一套根相对路径解析（/images/... + BASE_URL），无图则不渲染 -->
      <img v-if="coverSrc" :src="coverSrc" :alt="work.title || workId" class="w-full max-h-80 object-cover rounded-lg mb-6 border-2 border-slate-900" />
      <p v-if="work.description" class="text-gray-700 mb-6">{{ work.description }}</p>

      <!-- 外站原作出口：真实 URL 单点维护在 works/<workId>/index.md 的 links:，换址只改那一处 -->
      <div v-if="work.links && work.links.length" class="flex flex-wrap gap-3 mb-8">
        <a
          v-for="l in work.links"
          :key="l.url"
          :href="l.url"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-secondary inline-flex items-center gap-1"
        >{{ l.label }} <span class="text-xs">↗</span></a>
      </div>

      <h2 class="text-xl font-bold mb-4 text-gray-800">篇章</h2>
      <div v-if="!work.parts || work.parts.length === 0" class="text-gray-600">暂无篇章</div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link
          v-for="p in work.parts"
          :key="p.partId"
          :to="`/works/${workId}/parts/${p.partId}`"
          class="wiki-card p-5 group"
        >
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-800 group-hover:text-starlight-800">{{ p.title || p.partId }}</h3>
            <span class="text-gray-500 text-sm">序号: {{ p.order ?? 0 }}</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getWork } from '../services/contentService';
import { usePageMeta } from '../composables/usePageMeta';

const route = useRoute();
const workId = computed(() => route.params.workId);
const loading = ref(true);
const work = ref(null);

// ponytail: cover 走根相对路径（/images/...），前置 BASE_URL，与 MarkdownImage/ImageLoader 同一套
const BASE_URL = import.meta.env.BASE_URL;
const coverSrc = computed(() => {
  const cover = work.value?.cover;
  if (!cover || !cover.startsWith('/')) return null;
  return `${BASE_URL.replace(/\/$/, '')}${cover}`;
});

usePageMeta({
  title: computed(() => work.value?.title || ''),
  description: computed(() => work.value?.description || ''),
});

onMounted(async () => {
  loading.value = true;
  try {
    work.value = await getWork(workId.value);
  } finally {
    loading.value = false;
  }
});
</script>