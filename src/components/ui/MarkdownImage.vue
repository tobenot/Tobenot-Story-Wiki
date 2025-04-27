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
.markdown-image-wrapper {
  margin: 1.5rem 0;
  overflow: hidden;
  position: relative;
}

.markdown-image {
  max-width: 100%;
  height: auto;
  border: 2px solid #1a202c; /* 添加硬边框 */
}

.image-caption {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
  text-align: center;
  font-style: italic;
}

/* 加载状态和错误状态的样式 */
.image-loading-placeholder,
.image-error-placeholder {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
  color: #94a3b8;
  border: 2px solid #1a202c;
}

.image-error-placeholder {
  color: #ef4444;
  background-color: #fee2e2;
}
</style> 