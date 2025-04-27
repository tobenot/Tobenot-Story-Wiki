<template>
  <img :src="resolvedSrc" :alt="alt" @error="onImageError" />
  <!-- TODO: Integrate with ImageLoader for placeholders/errors if needed -->
</template>

<script setup>
import { computed } from 'vue';

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

// Base URL for manual path fixing
const BASE_URL = import.meta.env.BASE_URL;

// Function to prepend base URL if the path is root-relative
function resolveAssetPath(path) {
  if (!path || typeof path !== 'string' || !path.startsWith('/')) {
    return path;
  }
  // Prevent double slashes
  const normalizedBase = BASE_URL.endsWith('/') ? BASE_URL : BASE_URL + '/';
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
  const finalUrl = `${normalizedBase}${normalizedPath}`;
  // console.log(`Resolving image path: ${path} -> ${finalUrl}`);
  return finalUrl;
}

const resolvedSrc = computed(() => resolveAssetPath(props.src));

const onImageError = (event) => {
    console.error(`Failed to load markdown image: ${resolvedSrc.value}`, event);
    // Optionally add an error class or change src to a placeholder
    // event.target.classList.add('load-error');
    // event.target.src = '/path/to/error/image.png';
};
</script>

<style scoped>
img {
    max-width: 100%;
    height: auto;
    border-radius: 0.375rem; /* Optional: Add rounded corners */
    margin-top: 1em;
    margin-bottom: 1em;
}

img.load-error {
    /* Example error style */
    border: 2px dashed red;
    background-color: #fee2e2; /* Light red background */
    padding: 1rem;
}
</style> 