<template>
  <div class="wiki-container">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-starlight-800 to-starlight-700 text-transparent bg-clip-text">{{ title }}</h1>
      <router-link :to="`/works/${workId}`" class="btn btn-secondary">返回作品</router-link>
    </div>

    <div v-if="loading" class="py-12 text-center text-gray-600">加载中...</div>
    <div v-else-if="!part" class="py-12 text-center text-gray-600">未找到该篇章</div>

    <div v-else>
      <!-- ponytail: cover 走与正文图片同一套根相对路径解析（/images/... + BASE_URL）；@error 兜底，图缺失则静默不渲染而非破图 -->
      <img v-if="coverSrc && !coverFailed" :src="coverSrc" :alt="title" @error="coverFailed = true" class="w-full max-h-80 object-cover rounded-lg mb-6 border-2 border-slate-900" />
      <p v-if="part.description" class="text-gray-700 mb-6">{{ part.description }}</p>

      <!-- 门面入口：仅在该篇章存在 *-overview 专题页时显示，没写概览的篇章不显示 -->
      <router-link
        v-if="overviewEntry"
        :to="`/entry/features/${overviewEntry.id}`"
        class="btn btn-primary mb-6 inline-block"
      >进入篇章导览 →</router-link>

      <!-- 外站原作出口：真实 URL 单点维护在 parts/<partId>/index.md 的 links:，换址只改那一处 -->
      <div v-if="part.links && part.links.length" class="flex flex-wrap gap-3 mb-8">
        <a
          v-for="l in part.links"
          :key="l.url"
          :href="l.url"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-secondary inline-flex items-center gap-1"
        >{{ l.label }} <span class="text-xs">↗</span></a>
      </div>

      <div v-for="type in orderedTypes" :key="type" class="mb-10">
        <h2 class="text-xl font-bold mb-4 text-gray-800">{{ typeTitle(type) }}</h2>
        <div v-if="!part.entriesByType[type] || part.entriesByType[type].length === 0" class="text-gray-500">暂无</div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <router-link
            v-for="entry in part.entriesByType[type]"
            :key="entry.id"
            :to="`/entry/${type}/${entry.id}`"
            class="wiki-card p-5 group"
          >
            <h3 class="text-lg font-semibold text-gray-800 group-hover:text-starlight-800">{{ entry.title }}</h3>
            <p v-if="entry.description" class="text-gray-600 mt-2 line-clamp-3">{{ entry.description }}</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getPart } from '../services/contentService';
import { usePageMeta } from '../composables/usePageMeta';

const route = useRoute();
const workId = computed(() => route.params.workId);
const partId = computed(() => route.params.partId);
const loading = ref(true);
const part = ref(null);
const coverFailed = ref(false);

const orderedTypes = computed(() => {
  if (!part.value) return [];
  const keys = Object.keys(part.value.entriesByType || {});
  const order = ['characters', 'locations', 'events', 'items', 'concepts'];
  return keys.sort((a, b) => (order.indexOf(a) === -1 ? 999 : order.indexOf(a)) - (order.indexOf(b) === -1 ? 999 : order.indexOf(b)));
});

const typeTitle = (t) => ({
  characters: '人物',
  locations: '地点',
  events: '事件',
  items: '物品',
  concepts: '概念',
  features: '专题',
}[t] || t);

const title = computed(() => part.value?.title || partId.value);

// ponytail: cover 走根相对路径（/images/...），前置 BASE_URL，与 MarkdownImage/ImageLoader 同一套
const BASE_URL = import.meta.env.BASE_URL;
const coverSrc = computed(() => {
  const cover = part.value?.cover;
  if (!cover || !cover.startsWith('/')) return null;
  return `${BASE_URL.replace(/\/$/, '')}${cover}`;
});

// 篇章门面：features 里 id 以 -overview 结尾的专题页（零配置，没概览页的篇章返回 null）
const overviewEntry = computed(() => {
  const features = part.value?.entriesByType?.features || [];
  return features.find((e) => e.id && e.id.endsWith('-overview')) || null;
});

usePageMeta({
  title,
  description: computed(() => part.value?.description || ''),
});

onMounted(async () => {
  loading.value = true;
  coverFailed.value = false;
  try {
    part.value = await getPart(workId.value, partId.value);
  } finally {
    loading.value = false;
  }
});
</script>