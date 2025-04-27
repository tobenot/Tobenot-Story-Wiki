<template>
  <aside v-if="headings.length > 0" class="toc-container">
    <h3 class="text-sm font-semibold mb-2 uppercase tracking-wider text-slate-700 dark:text-slate-300">目录</h3>
    <ul class="space-y-1">
      <li v-for="heading in headings" :key="heading.id" :class="getHeadingClass(heading.level)">
        <a
          :href="`#${heading.id}`"
          class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-150"
          @click.prevent="scrollToHeading(heading.id)"
        >
          {{ heading.text }}
        </a>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  headings: {
    type: Array,
    required: true, // Format: [{ id: '...', text: '...', level: 2|3 }]
  },
});

const getHeadingClass = (level) => {
  return level === 3 ? 'ml-4 text-sm' : 'text-sm font-medium'; // Indent H3
};

const scrollToHeading = (id) => {
  const element = document.getElementById(id);
  if (element) {
    // Use smooth scrolling behavior
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Optional: Update URL hash without page jump if needed
    // history.pushState(null, null, `#${id}`);
  }
};
</script>

<style scoped>
.toc-container {
  /* Adjust positioning and styling as needed */
  /* Example: sticky positioning for scrolling alongside content */
  /* position: sticky; */
  /* top: 5rem;  */
  /* max-height: calc(100vh - 6rem); */
  /* overflow-y: auto; */
  padding: 1rem;
  border: 1px solid var(--border-color, #e2e8f0); /* Use CSS variable or default */
  border-radius: 0.5rem;
  background-color: var(--card-bg, white); /* Use CSS variable or default */
}

/* Add dark mode styles */
.dark .toc-container {
  border-color: var(--border-color-dark, #334155);
  background-color: var(--card-bg-dark, #1e293b);
}
</style>