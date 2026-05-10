<script setup lang="ts">
import { Atom, WandSparkles } from 'lucide-vue-next';
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <RouterLink class="brand" to="/">
        <Atom :size="26" aria-hidden="true" />
        <span>自动物理模型生成器</span>
      </RouterLink>
      <nav class="nav-tabs" aria-label="主导航">
        <RouterLink to="/">智能生成</RouterLink>
        <RouterLink to="/editor">模型编辑器</RouterLink>
      </nav>
      <div class="status-pill">
        <WandSparkles :size="16" aria-hidden="true" />
        <span>高中力学 MVP</span>
      </div>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>
