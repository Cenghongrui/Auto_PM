<script setup lang="ts">
import { BookOpen } from 'lucide-vue-next';
import { exampleModels } from '../../data/examples';
import type { PhysicsModel } from '../../types/physics';

const emit = defineEmits<{ load: [model: PhysicsModel] }>();
</script>

<template>
  <section class="panel compact-panel">
    <div class="panel-title">
      <BookOpen :size="18" aria-hidden="true" />
      <h2>示例题库</h2>
    </div>
    <div class="library-list">
      <button v-for="example in exampleModels" :key="example.id" class="library-item" @click="emit('load', example.model)">
        <strong>{{ example.name }}</strong>
        <span>{{ example.description }}</span>
      </button>
    </div>
  </section>
</template>
