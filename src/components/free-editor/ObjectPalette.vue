<script setup lang="ts">
import { Box, Circle, Minus, Mountain, PanelTop } from 'lucide-vue-next';
import type { SceneObjectType } from '../../types/physics';

const emit = defineEmits<{ add: [type: SceneObjectType] }>();

const tools: Array<{ type: SceneObjectType; label: string; icon: typeof Box }> = [
  { type: 'block', label: '物块', icon: Box },
  { type: 'ball', label: '小球', icon: Circle },
  { type: 'incline', label: '斜面', icon: Mountain },
  { type: 'platform', label: '平台', icon: Minus },
  { type: 'wall', label: '挡板', icon: PanelTop },
];
</script>

<template>
  <section class="panel compact-panel">
    <h2>对象库</h2>
    <div class="tool-grid">
      <button v-for="tool in tools" :key="tool.type" class="tool-button" @click="emit('add', tool.type)">
        <component :is="tool.icon" :size="20" aria-hidden="true" />
        <span>{{ tool.label }}</span>
      </button>
    </div>
  </section>
</template>
