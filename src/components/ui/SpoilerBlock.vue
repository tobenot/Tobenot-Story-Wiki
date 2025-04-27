<template>
  <div class="spoiler border-2 border-dashed border-amber-500 dark:border-amber-400 p-4 my-4 relative" :class="{ 'revealed': isActuallyRevealed }">
    <!-- 剧透来源 -->
    <div v-if="source" class="spoiler-source text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
      <span>剧透来源: {{ source }}</span>
    </div>
    
    <!-- 剧透内容区域 -->
    <div class="spoiler-content-wrapper">
      <!-- 遮罩层 + 查看按钮，只在需要隐藏时显示 -->
      <div 
        v-if="!isActuallyRevealed" 
        class="absolute inset-0 bg-slate-50/80 dark:bg-slate-800/90 backdrop-blur-sm z-10 flex items-center justify-center"
      >
        <!-- 查看剧透按钮放在遮罩层上 -->
        <button 
          @click="revealSpoiler"
          class="spoiler-btn view-spoiler z-20"
        >
          查看剧透
        </button>
      </div>
      <!-- 实际内容 -->
      <div 
        class="spoiler-content prose prose-slate dark:prose-invert max-w-none transition-opacity duration-300 ease-in-out" 
        :class="{'opacity-0 pointer-events-none': !isActuallyRevealed}"
        v-html="processedContentHtml"
      ></div>
    </div>
    
    <!-- 底部操作按钮 -->
    <div class="spoiler-actions mt-4 flex flex-wrap gap-2 items-center">
      <!-- 收起按钮，仅在手动揭示 且 全局未揭示 时显示 -->
      <button 
        v-if="isRevealed && !isGloballyRevealed" 
        @click="hideSpoiler"
        class="spoiler-btn hide-spoiler"
      >
        收起剧透
      </button>
      <!-- 前往原作/催更按钮 -->
      <a 
        v-if="sourceLink" 
        :href="sourceLink" 
        target="_blank" 
        class="spoiler-btn goto-source"
      >
        前往原作
      </a>
      <a 
        v-else 
        :href="pendingSourceLink" 
        target="_blank" 
        class="spoiler-btn pending-source"
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
.spoiler {
  /* Base styles for the spoiler container - no rounded corners */
  background-color: rgba(251, 191, 36, 0.05); /* Light amber background */
  transition: background-color 0.3s ease;
  border-width: 2px; /* Ensure brutal border width */
}

.dark .spoiler {
    background-color: rgba(251, 191, 36, 0.1); /* Darker amber background */
}

/* Content wrapper needed for absolute positioning of the blur overlay */
.spoiler-content-wrapper {
  position: relative;
}

.spoiler-content {
  /* Styles for the actual content area */
  /* Opacity transition is handled inline with :class */
}

.spoiler-btn {
  /* Shared button styles - no rounded corners */
  padding: 0.35rem 0.85rem; /* Slightly adjust padding */
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  cursor: pointer;
  border-width: 2px; /* Brutal border */
  border-style: solid;
  text-align: center;
}

.view-spoiler {
  border-color: theme('colors.starlight.600'); /* Use starlight */
  background-color: theme('colors.starlight.500');
  color: theme('colors.cosmic.900'); /* Dark text on gold */
}
.view-spoiler:hover {
  background-color: theme('colors.starlight.400');
  border-color: theme('colors.starlight.500');
}
.dark .view-spoiler {
  border-color: theme('colors.starlight.500');
  background-color: theme('colors.starlight.600');
  color: theme('colors.cosmic.100'); /* Light text on dark gold */
}
.dark .view-spoiler:hover {
   background-color: theme('colors.starlight.500');
   border-color: theme('colors.starlight.400');
}

.hide-spoiler {
  border-color: theme('colors.slate.600');
  background-color: theme('colors.slate.500');
  color: white;
}
.hide-spoiler:hover {
  background-color: theme('colors.slate.600');
  border-color: theme('colors.slate.700');
}
.dark .hide-spoiler {
  border-color: theme('colors.slate.500');
  background-color: theme('colors.slate.600');
}
.dark .hide-spoiler:hover {
   background-color: theme('colors.slate.500');
   border-color: theme('colors.slate.400');
}


.goto-source, .pending-source {
  border-color: theme('colors.slate.600'); /* 改为 slate */
  background-color: theme('colors.slate.100');
  color: theme('colors.slate.700');
}
.goto-source:hover, .pending-source:hover {
  background-color: theme('colors.slate.200');
  border-color: theme('colors.slate.700');
}

.dark .goto-source, .dark .pending-source {
  border-color: theme('colors.slate.600');
  background-color: theme('colors.slate.700');
  color: theme('colors.slate.100');
}
.dark .goto-source:hover, .dark .pending-source:hover {
  background-color: theme('colors.slate.600');
  border-color: theme('colors.slate.500');
}
</style> 