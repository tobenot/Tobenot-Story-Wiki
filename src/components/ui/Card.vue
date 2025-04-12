<!-- src/components/ui/Card.vue -->
<template>
    <div 
      class="bg-white dark:bg-slate-800 rounded-xl shadow-card transition-shadow p-6 border border-slate-200 dark:border-slate-700"
      :class="{ 'hover:shadow-card-hover': hover }"
    >
      <slot></slot>
    </div>
  </template>
  
  <script setup>
  defineProps({
    hover: {
      type: Boolean,
      default: true
    }
  });
  </script>