<template>
  <div class="home">
    <h1>托贝诺特世界观 Wiki</h1>
    <p>欢迎来到世界观 Wiki，在这里你可以探索各种作品中的设定。</p>
    
    <div class="category-grid">
      <router-link to="/category/characters" class="category-card">
        <h2>人物</h2>
        <p>探索各种作品中的角色</p>
      </router-link>
      
      <router-link to="/category/locations" class="category-card">
        <h2>地点</h2>
        <p>发现各种作品中的地点</p>
      </router-link>
      
      <router-link to="/category/events" class="category-card">
        <h2>事件</h2>
        <p>了解各种作品中的事件</p>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomePage'
})
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.category-card {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
</style> 