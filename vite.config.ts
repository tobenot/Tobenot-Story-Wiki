import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/Tobenot-Story-Wiki/', // 修改为仓库名，用于 GitHub Pages 部署
  resolve: {
    alias: {
      '@': './src'
    }
  }
})
