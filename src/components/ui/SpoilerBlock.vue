<template>
  <div class="spoiler" :class="{ 'is-revealed': isActuallyRevealed }">
    <!-- 剧透来源 -->
    <div v-if="source" class="spoiler-source">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M5 19h14a2 2 0 001.84-2.75L13.74 4a2 2 0 00-3.48 0L3.16 16.25A2 2 0 005 19z" />
      </svg>
      <span>剧透来源：<strong>{{ source }}</strong></span>
    </div>

    <!-- 剧透内容区域 -->
    <div class="spoiler-content-wrapper">
      <!-- 磨砂遮罩层 + 查看按钮，只在需要隐藏时显示 -->
      <div v-if="!isActuallyRevealed" class="spoiler-overlay">
        <button @click="revealSpoiler" class="spoiler-btn view-spoiler">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          查看剧透
        </button>
      </div>
      <!-- 实际内容 -->
      <div
        class="spoiler-content prose prose-starlight dark:prose-invert max-w-none"
        :class="{ 'is-hidden': !isActuallyRevealed }"
        v-html="processedContentHtml"
      ></div>
    </div>

    <!-- 底部操作按钮 -->
    <div class="spoiler-actions">
      <!-- 收起按钮，仅在手动揭示 且 全局未揭示 时显示 -->
      <button
        v-if="isRevealed && !isGloballyRevealed"
        @click="hideSpoiler"
        class="spoiler-btn ghost"
      >
        收起剧透
      </button>
      <!-- 前往原作/催更按钮 -->
      <a
        v-if="sourceLink"
        :href="sourceLink"
        target="_blank"
        rel="noopener noreferrer"
        class="spoiler-btn gold"
      >
        前往原作
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </a>
      <a
        v-else
        :href="pendingSourceLink"
        target="_blank"
        rel="noopener noreferrer"
        class="spoiler-btn ghost"
      >
        敬请催更
      </a>
    </div>
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
  // Optional function to resolve asset paths if needed
  resolveAssetPath: {
    type: Function,
    required: false
  }
});

// Internal state for manual reveal
const isRevealed = ref(false);
const pendingSourceLink = 'https://github.com/tobenot/tobenot.github.io/issues';

// Determine if the spoiler should actually be revealed (global override or manual)
const isActuallyRevealed = computed(() => props.isGloballyRevealed || isRevealed.value);

// Get the link for the source
const sourceLink = computed(() => getSpoilerLink(props.source));

// Manually reveal the spoiler
const revealSpoiler = () => {
  isRevealed.value = true;
};

// Manually hide the spoiler
const hideSpoiler = () => {
  isRevealed.value = false;
};

// Process the initial HTML content (e.g., resolve image paths)
const processedContentHtml = computed(() => {
  if (!props.initialContentHtml) return '';
  // If no resolver is provided, return the original HTML
  if (!props.resolveAssetPath) return props.initialContentHtml;

  // Use DOM manipulation to safely update image sources
  // This avoids potential issues with regex and complex HTML structures
  try {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = props.initialContentHtml;
    const images = tempDiv.querySelectorAll('img');
    images.forEach(img => {
      const originalSrc = img.getAttribute('src');
      // Check if the src is root-relative and needs resolving
      if (originalSrc && originalSrc.startsWith('/') && !(originalSrc.startsWith('//') || originalSrc.startsWith('data:'))) {
         // Ensure BASE_URL logic is handled by the passed function
        img.src = props.resolveAssetPath(originalSrc);
      }
    });
    return tempDiv.innerHTML;
  } catch (error) {
    console.error('Error processing spoiler content HTML:', error);
    return props.initialContentHtml; // Fallback to original content on error
  }
});

// Watch for global reveal changes
watch(() => props.isGloballyRevealed, (newValue) => {
  // When global toggle is turned OFF, reset the manual reveal state as well
  if (!newValue) {
      isRevealed.value = false;
  }
  // If global is ON, we don't need to force isRevealed to true,
  // isActuallyRevealed computed property handles showing the content.
}, { immediate: false }); // Don't run immediately, only on change

</script>

<style scoped>
/* 粗野主义剧透框：实线边框、金色警示色、无圆角 */
.spoiler {
  position: relative;
  padding: 1.25rem;
  margin: 1.25rem 0;
  border: 2px solid theme('colors.starlight.600');
  background-color: theme('colors.starlight.50');
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.spoiler.is-revealed {
  background-color: theme('colors.white');
  border-color: theme('colors.starlight.400');
}

.dark .spoiler {
  border-color: theme('colors.starlight.500');
  background-color: rgba(48, 48, 56, 0.6); /* cosmic-600 半透明 */
}

.dark .spoiler.is-revealed {
  background-color: theme('colors.cosmic.800');
  border-color: theme('colors.starlight.600');
}

/* 剧透来源标签 */
.spoiler-source {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px dashed theme('colors.starlight.400');
  font-size: 0.85rem;
  color: theme('colors.starlight.700');
}

.spoiler-source strong {
  font-weight: 600;
  color: theme('colors.starlight.800');
}

.dark .spoiler-source {
  color: theme('colors.starlight.300');
  border-bottom-color: theme('colors.starlight.600');
}

.dark .spoiler-source strong {
  color: theme('colors.starlight.200');
}

/* 内容包裹层，用于定位遮罩 */
.spoiler-content-wrapper {
  position: relative;
  min-height: 2.5rem;
}

/* 磨砂玻璃遮罩 */
.spoiler-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(170, 137, 74, 0.12); /* starlight-500 淡金蒙版 */
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.dark .spoiler-overlay {
  background-color: rgba(20, 21, 24, 0.55); /* cosmic-900 蒙版 */
}

.spoiler-content {
  transition: opacity 0.3s ease;
}

.spoiler-content.is-hidden {
  opacity: 0;
  pointer-events: none;
  user-select: none;
}

/* 操作按钮区 */
.spoiler-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  margin-top: 1rem;
  padding-top: 0.85rem;
  border-top: 1px solid theme('colors.starlight.200');
}

.dark .spoiler-actions {
  border-top-color: theme('colors.cosmic.600');
}

/* 粗野主义按钮基础：实线 2px 边框、按压下沉反馈 */
.spoiler-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.9rem;
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1.2;
  cursor: pointer;
  border: 2px solid theme('colors.cosmic.900');
  box-shadow: 3px 3px 0 0 theme('colors.cosmic.900');
  transition: transform 0.1s ease, box-shadow 0.1s ease, background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  text-align: center;
  text-decoration: none;
}

.spoiler-btn:active {
  transform: translate(3px, 3px);
  box-shadow: 0 0 0 0 theme('colors.cosmic.900');
}

.dark .spoiler-btn {
  border-color: theme('colors.cosmic.100');
  box-shadow: 3px 3px 0 0 theme('colors.cosmic.100');
}

.dark .spoiler-btn:active {
  box-shadow: 0 0 0 0 theme('colors.cosmic.100');
}

/* 查看剧透：金色实心主按钮 */
.view-spoiler {
  background-color: theme('colors.starlight.500');
  color: theme('colors.cosmic.900');
  border-color: theme('colors.cosmic.900');
}

.view-spoiler:hover {
  background-color: theme('colors.starlight.400');
}

.dark .view-spoiler {
  background-color: theme('colors.starlight.500');
  color: theme('colors.cosmic.950');
}

.dark .view-spoiler:hover {
  background-color: theme('colors.starlight.400');
}

/* 前往原作：金色描边按钮（与品牌金色协调，非紫色） */
.gold {
  background-color: transparent;
  color: theme('colors.starlight.700');
  border-color: theme('colors.starlight.600');
  box-shadow: 3px 3px 0 0 theme('colors.starlight.600');
}

.gold:hover {
  background-color: theme('colors.starlight.500');
  color: theme('colors.cosmic.900');
  border-color: theme('colors.cosmic.900');
  box-shadow: 3px 3px 0 0 theme('colors.cosmic.900');
}

.dark .gold {
  color: theme('colors.starlight.300');
  border-color: theme('colors.starlight.500');
  box-shadow: 3px 3px 0 0 theme('colors.starlight.500');
}

.dark .gold:hover {
  background-color: theme('colors.starlight.500');
  color: theme('colors.cosmic.950');
  border-color: theme('colors.cosmic.100');
  box-shadow: 3px 3px 0 0 theme('colors.cosmic.100');
}

/* 次级按钮（收起 / 催更）：中性描边 */
.ghost {
  background-color: theme('colors.cosmic.100');
  color: theme('colors.cosmic.700');
  border-color: theme('colors.cosmic.400');
  box-shadow: 3px 3px 0 0 theme('colors.cosmic.400');
}

.ghost:hover {
  background-color: theme('colors.cosmic.200');
  border-color: theme('colors.cosmic.500');
  box-shadow: 3px 3px 0 0 theme('colors.cosmic.500');
}

.dark .ghost {
  background-color: theme('colors.cosmic.700');
  color: theme('colors.cosmic.100');
  border-color: theme('colors.cosmic.500');
  box-shadow: 3px 3px 0 0 theme('colors.cosmic.500');
}

.dark .ghost:hover {
  background-color: theme('colors.cosmic.600');
  border-color: theme('colors.cosmic.400');
  box-shadow: 3px 3px 0 0 theme('colors.cosmic.400');
}
</style>
