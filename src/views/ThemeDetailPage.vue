<template>
  <div class="wiki-container">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-starlight-500 to-starlight-600 text-transparent bg-clip-text">{{ theme?.title || themeId }}</h1>
      <router-link to="/themes" class="btn btn-secondary">返回主题列表</router-link>
    </div>

    <div v-if="loading" class="py-12 text-center text-gray-600">加载中...</div>
    <div v-else-if="!theme" class="py-12 text-center text-gray-600">未找到该主题</div>

    <div v-else>
      <p v-if="theme.description" class="text-gray-700 mb-8">{{ theme.description }}</p>

      <div v-if="theme.strategy === 'by-tags'">
        <div v-for="type in displayTypes" :key="type" class="mb-10">
          <h2 class="text-xl font-bold mb-4 text-gray-800">{{ typeTitle(type) }}</h2>
          <div v-if="(itemsByType[type] || []).length === 0" class="text-gray-500">暂无</div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <router-link
              v-for="entry in itemsByType[type]"
              :key="entry.id"
              :to="`/entry/${type}/${entry.id}`"
              class="wiki-card p-5 group"
            >
              <h3 class="text-lg font-semibold text-gray-800 group-hover:text-starlight-700">{{ entry.title }}</h3>
              <p v-if="entry.description" class="text-gray-600 mt-2 line-clamp-3">{{ entry.description }}</p>
            </router-link>
          </div>
        </div>
      </div>

      <div v-else>
        <p class="text-gray-600">该主题暂未配置自动聚合策略。</p>
      </div>

      <div class="prose mt-10" v-if="theme.body" v-html="theme.body"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getTheme, loadContentList } from '../services/contentService';

const route = useRoute();
const themeId = computed(() => route.params.themeId);
const loading = ref(true);
const theme = ref(null);
const itemsByType = ref({});

const defaultTypes = ['characters', 'locations', 'events', 'items', 'concepts'];
const typeTitle = (t) => ({
  characters: '人物',
  locations: '地点',
  events: '事件',
  items: '物品',
  concepts: '概念',
}[t] || t);

const displayTypes = computed(() => Object.keys(itemsByType.value));

onMounted(async () => {
  loading.value = true;
  try {
    theme.value = await getTheme(themeId.value);

    if (theme.value && theme.value.strategy === 'by-tags') {
      const include = theme.value.include || {};
      const types = include.types && include.types.length ? include.types : defaultTypes;
      const tags = include.tags && include.tags.length ? include.tags : [];

      const resultsByType = {};
      for (const type of types) {
        const agg = new Map();
        if (tags.length === 0) {
          const list = await loadContentList(type);
          list.forEach(item => agg.set(item.id, item));
        } else {
          for (const tag of tags) {
            const list = await loadContentList(type, { tag });
            list.forEach(item => agg.set(item.id, item));
          }
        }
        resultsByType[type] = Array.from(agg.values());
      }
      itemsByType.value = resultsByType;
    }
  } finally {
    loading.value = false;
  }
});
</script>