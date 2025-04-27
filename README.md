# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

# 索引bug修复
方案1：直接修改 lunr.zh.js 文件（快速但不推荐的解决方法）
这种方法不是工程实践的最佳方式，但可以快速解决问题：

修改 node_modules/lunr-languages/lunr.zh.js 文件：
找到文件中加载 @node-rs/jieba 的行（大约在第33行）

将 require('@node-rs/jieba') 改为 require('nodejieba')
保存文件后再次尝试构建索引
