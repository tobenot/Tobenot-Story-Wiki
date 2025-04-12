<template>
  <img 
    v-if="resolvedSrc"
    :src="resolvedSrc" 
    :alt="alt || 'Wiki image'" 
    @load="onLoad"
    @error="onError"
    :class="{ 'opacity-0': isLoading }"
    class="transition-opacity duration-300" 
  />
  <!-- Optional: Add a placeholder or loading indicator -->
  <div v-if="isLoading" class="flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-500">
    <!-- Placeholder icon or animation -->
    Loading... 
  </div>
  <div v-if="hasError" class="flex items-center justify-center bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">
    <!-- Error icon -->
    Error
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  }
});

const isLoading = ref(true);
const hasError = ref(false);

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
  // Reset states when src changes
  isLoading.value = true;
  hasError.value = false;
  return resolveAssetPath(props.src);
});

const onLoad = () => {
  isLoading.value = false;
  hasError.value = false;
};

const onError = () => {
  isLoading.value = false;
  hasError.value = true;
  console.error(`Failed to load image: ${resolvedSrc.value}`);
};
</script>

<style scoped>
/* Add any specific styling for the loader/error states if needed */
img {
  display: block; /* Prevents extra space below image */
}
</style> 