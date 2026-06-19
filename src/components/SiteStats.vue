<template>
  <section v-if="stats" class="site-stats">
    <!-- 头条数字：字数 / 实体 -->
    <div class="stats-headline">
      <div class="headline-item">
        <span class="headline-num">{{ fmt(stats.totalChars) }}</span>
        <span class="headline-label">字</span>
      </div>
      <div class="headline-divider"></div>
      <div class="headline-item">
        <span class="headline-num">{{ fmt(stats.totalEntries) }}</span>
        <span class="headline-label">条目</span>
      </div>
      <div class="headline-divider"></div>
      <div class="headline-item">
        <span class="headline-num">{{ fmt(stats.works) }}</span>
        <span class="headline-label">作品</span>
      </div>
    </div>

    <!-- 分类细分 -->
    <div class="stats-grid">
      <router-link
        v-for="t in stats.byType"
        :key="t.type"
        :to="`/category/${t.type}`"
        class="stat-cell"
      >
        <div class="stat-cell-top">
          <span class="stat-label">{{ t.label }}</span>
          <span class="stat-count">{{ t.count }}</span>
        </div>
        <div class="stat-bar-track">
          <div class="stat-bar-fill" :style="{ width: barWidth(t.chars) }"></div>
        </div>
        <div class="stat-chars">{{ fmt(t.chars) }} 字</div>
      </router-link>
    </div>

    <!-- 次级计数 + 生成时间 -->
    <div class="stats-foot">
      <span class="foot-chip">篇章 {{ stats.parts }}</span>
      <span class="foot-chip">主题 {{ stats.themes }}</span>
      <span class="foot-chip">物理文件 {{ stats.entryFiles }}</span>
      <span v-if="stats.lastUpdated" class="foot-time">
        最近更新 · {{ fmtDate(stats.lastUpdated) }}
      </span>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const stats = ref(null);
const maxChars = ref(1);

onMounted(async () => {
  try {
    const res = await fetch('/site-stats.json');
    if (!res.ok) return;
    stats.value = await res.json();
    maxChars.value = Math.max(1, ...stats.value.byType.map((t) => t.chars));
  } catch (err) {
    // 统计为增强信息，加载失败时静默隐藏，不影响首页。
    console.warn('[SiteStats] 加载 site-stats.json 失败：', err);
  }
});

function fmt(n) {
  return Number(n || 0).toLocaleString('zh-CN');
}

function fmtDate(iso) {
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  } catch {
    return '';
  }
}

function barWidth(c) {
  return `${Math.round(((c || 0) / maxChars.value) * 100)}%`;
}
</script>

<style scoped>
.site-stats {
  @apply w-full max-w-[1080px] mx-auto mb-16 bg-white border-2 border-slate-900 shadow-brutal p-6 md:p-8;
}

/* 头条 */
.stats-headline {
  @apply flex items-center justify-center gap-6 md:gap-10 mb-6;
}
.headline-item {
  @apply flex items-baseline gap-2;
}
.headline-num {
  @apply text-3xl md:text-5xl font-extrabold text-starlight-800 tabular-nums;
}
.headline-label {
  @apply text-sm md:text-base font-bold text-slate-500;
}
.headline-divider {
  @apply h-8 w-px bg-slate-300;
}

/* 分类网格 */
.stats-grid {
  @apply grid gap-3;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}
.stat-cell {
  @apply block no-underline border-2 border-slate-900 p-3 transition-all duration-200 bg-slate-50;
}
.stat-cell:hover {
  @apply -translate-y-0.5 shadow-brutal bg-white;
}
.stat-cell-top {
  @apply flex items-center justify-between mb-2;
}
.stat-label {
  @apply text-sm font-bold text-slate-800;
}
.stat-count {
  @apply text-lg font-extrabold text-starlight-800 tabular-nums;
}
.stat-bar-track {
  @apply h-1.5 w-full bg-slate-200 mb-1.5;
}
.stat-bar-fill {
  @apply h-full bg-starlight-600;
}
.stat-chars {
  @apply text-xs text-slate-500 tabular-nums;
}

/* 页脚 */
.stats-foot {
  @apply flex flex-wrap items-center gap-x-3 gap-y-1 mt-6 pt-4 border-t border-slate-200;
}
.foot-chip {
  @apply text-xs font-bold text-slate-600 px-2 py-0.5 border border-slate-300;
}
.foot-time {
  @apply ml-auto text-xs text-slate-400;
}
</style>
