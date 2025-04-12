<!-- src/components/ui/Button.vue -->
<template>
    <component
      :is="tag"
      class="btn"
      :class="[
        size === 'sm' ? 'px-3 py-1 text-sm' : size === 'lg' ? 'px-5 py-3 text-lg' : 'px-4 py-2',
        {
          'btn-primary': variant === 'primary',
          'btn-secondary': variant === 'secondary',
          'btn-outlined': variant === 'outlined',
          'btn-ghost': variant === 'ghost',
          'opacity-50 cursor-not-allowed': disabled
        }
      ]"
      :disabled="disabled"
      v-bind="$attrs"
    >
      <slot></slot>
    </component>
  </template>
  
  <script setup>
  defineProps({
    variant: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'secondary', 'outlined', 'ghost'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: value => ['sm', 'md', 'lg'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String,
      default: 'button'
    }
  });
  </script>