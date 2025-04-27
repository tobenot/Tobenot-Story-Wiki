<template>
  <div class="spoiler border border-dashed border-amber-500 dark:border-amber-400 rounded-md p-4 my-4" :class="{ 'revealed': isRevealed }">
    <div class="spoiler-header flex justify-between items-center mb-2">
      <div class="spoiler-source text-sm font-medium text-slate-600 dark:text-slate-400">
        {{ sourceText }}
      </div>
      <div class="spoiler-actions flex gap-2">
        <button @click="toggleSpoiler" class="spoiler-btn view-spoiler">
          {{ toggleButtonText }}
        </button>
        <a v-if="sourceLink" :href="sourceLink" target="_blank" rel="noopener noreferrer" class="spoiler-btn goto-source">
          前往原作
        </a>
        <a v-else :href="pendingSourceLink" target="_blank" rel="noopener noreferrer" class="spoiler-btn pending-source">
          敬请催更
        </a>
      </div>
    </div>
    <div 
      v-show="isRevealed" 
      class="spoiler-content prose prose-slate dark:prose-invert max-w-none" 
      v-html="processedContentHtml"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { getSpoilerLink } from '../../services/contentService';

const props = defineProps({
  source: {
    type: String,
    required: true,
    default: '未知来源'
  },
  initialContentHtml: {
    type: String,
    required: true
  },
  isGloballyRevealed: {
    type: Boolean,
    required: true
  },
  resolveAssetPath: {
    type: Function,
    required: false
  }
});

const isRevealed = ref(false);
const pendingSourceLink = 'https://github.com/tobenot/tobenot.github.io/issues';

const toggleSpoiler = () => {
  console.log('[SpoilerBlock] Before toggle, isRevealed:', isRevealed.value);
  isRevealed.value = !isRevealed.value;
  console.log('[SpoilerBlock] After toggle, isRevealed:', isRevealed.value);
};

const sourceText = computed(() => `出自：${props.source}`);
const sourceLink = computed(() => getSpoilerLink(props.source));

const toggleButtonText = computed(() => {
    return isRevealed.value ? '收起剧透' : '点击查看剧透';
});

const processedContentHtml = computed(() => {
    if (!props.initialContentHtml) return '';
    if (!props.resolveAssetPath) return props.initialContentHtml;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = props.initialContentHtml;
    const images = tempDiv.querySelectorAll('img');
    images.forEach(img => {
        const originalSrc = img.getAttribute('src');
        if (originalSrc && originalSrc.startsWith('/') && !originalSrc.startsWith(import.meta.env.BASE_URL)) {
            img.src = props.resolveAssetPath(originalSrc);
        }
    });
    return tempDiv.innerHTML;
});

watch(() => props.isGloballyRevealed, (newValue) => {
  if (newValue) {
    isRevealed.value = true;
  }
}, { immediate: true });

</script>

<style scoped>
.spoiler {
  /* Base styles for the spoiler container */
  background-color: rgba(251, 191, 36, 0.05); /* Light amber background */
  transition: background-color 0.3s ease;
}

.dark .spoiler {
    background-color: rgba(251, 191, 36, 0.1); /* Darker amber background */
}

.spoiler.revealed {
  /* Styles when revealed, e.g., change background */
  /* background-color: transparent; */
}

.spoiler-content {
  /* Styles for the content area */
  transition: max-height 0.5s ease-out, opacity 0.5s ease-out;
  overflow: hidden;
  max-height: 1000px; /* Set a large enough max-height for transition */
  opacity: 1;
  padding-top: 0.5rem; /* Add some space below header */
}

/* Add styles for v-show transition if desired */
/* .spoiler:not(.revealed) .spoiler-content {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
} */

.spoiler-btn {
  /* Shared button styles */
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s ease, color 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;
}

.view-spoiler {
  background-color: var(--primary-500, theme('colors.primary.500'));
  color: white;
  border-color: var(--primary-500, theme('colors.primary.500'));
}
.view-spoiler:hover {
  background-color: var(--primary-600, theme('colors.primary.600'));
  border-color: var(--primary-600, theme('colors.primary.600'));
}

.goto-source, .pending-source {
  background-color: var(--secondary-100, theme('colors.slate.100'));
  color: var(--secondary-700, theme('colors.slate.700'));
  border-color: var(--secondary-300, theme('colors.slate.300'));
}
.goto-source:hover, .pending-source:hover {
  background-color: var(--secondary-200, theme('colors.slate.200'));
}

.dark .goto-source, .dark .pending-source {
  background-color: var(--secondary-700, theme('colors.slate.700'));
  color: var(--secondary-200, theme('colors.slate.200'));
  border-color: var(--secondary-600, theme('colors.slate.600'));
}
.dark .goto-source:hover, .dark .pending-source:hover {
  background-color: var(--secondary-600, theme('colors.slate.600'));
}

/* Style adjustments for when global reveal is active */
.spoiler.revealed .view-spoiler {
    /* Maybe make the button look disabled or different if global is on? */
    /* background-color: var(--secondary-300, theme('colors.slate.300')); */
    /* color: var(--secondary-500, theme('colors.slate.500')); */
    /* cursor: not-allowed; */
}

</style> 