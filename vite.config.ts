import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  base: '/',
  resolve: {
    alias: {
      '@': './src',
    }
  },
  css: {
    postcss: './postcss.config.js',
  },
  assetsInclude: ['**/*.md'],
  optimizeDeps: {
    esbuildOptions: {
    }
  },
  build: {
    rollupOptions: {
    }
  }
})
