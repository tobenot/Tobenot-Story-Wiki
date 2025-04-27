<!-- src/components/ui/Card.vue -->
<template>
    <div 
      :class="[
        'bg-white dark:bg-slate-800 shadow-brutal border-2 border-slate-900 dark:border-slate-700 transition-shadow p-6',
        clickable ? 'cursor-pointer hover:shadow-brutal-lg' : '',
        className
      ]"
      @click="handleClick"
    >
      <slot></slot>
    </div>
  </template>
  
  <script setup>
  defineProps({
    hover: {
      type: Boolean,
      default: true
    },
    clickable: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    }
  });

  const handleClick = () => {
    // Implement the click handler
  };
  </script>