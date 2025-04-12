<template>
  <img 
    v-if="resolvedSrc && !hasError"
    :src="resolvedSrc" 
    :alt="alt || 'Wiki image'" 
    @load="onLoad"
    @error="onError"
    :class="[imageClass, { 'opacity-0': isLoading }]"
    class="transition-opacity duration-300" 
  />
  <!-- Placeholder shown during loading -->
  <div v-if="isLoading" :class="placeholderClass || 'flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'">
    <!-- You can customize placeholder via prop or slot -->
    <svg class="animate-pulse h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  </div>
  <!-- Error state shown if image fails to load -->
  <div v-if="hasError" :class="errorClass || 'flex items-center justify-center bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300'">
     <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  imageClass: {
    type: [String, Object, Array],
    default: ''
  },
  placeholderClass: { // Optional class for placeholder state
    type: [String, Object, Array],
    default: ''
  },
  errorClass: { // Optional class for error state
     type: [String, Object, Array],
    default: ''
  }
});

const isLoading = ref(true);
const hasError = ref(false);

// Watch for src changes to reset state
watch(() => props.src, (newSrc) => {
  // console.log('ImageLoader src changed:', newSrc);
  isLoading.value = true;
  hasError.value = false;
}, { immediate: true }); // immediate: true ensures initial state is set

// Vite provides the base URL (e.g., '/' in dev, '/repo-name/' in prod)
const BASE_URL = import.meta.env.BASE_URL;

// Function to prepend base URL if the path is root-relative
function resolveAssetPath(path) {
  if (!path || !path.startsWith('/')) {
    return path; // Return as is if null, undefined, or not root-relative
  }
   // Prevent double slashes if BASE_URL is '/' or path is just '/' 
  return `${BASE_URL.replace(/\/$/, '')}${path}`;
}

const resolvedSrc = computed(() => {
  return resolveAssetPath(props.src);
});

const onLoad = () => {
  // console.log('Image loaded:', resolvedSrc.value);
  isLoading.value = false;
  hasError.value = false;
};

const onError = () => {
  console.error(`Failed to load image: ${resolvedSrc.value}`);
  isLoading.value = false;
  hasError.value = true;
};
</script>

<style scoped>
/* Add any specific styling for the loader/error states if needed */
img {
  display: block; /* Prevents extra space below image */
}
/* Ensure placeholder/error divs fill the container space */
img + div {
  width: 100%;
  height: 100%; 
}
</style> 