<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next';
import type { SceneObject } from '../../types/physics';

defineProps<{
  objects: SceneObject[];
  selectedId?: string;
}>();

const emit = defineEmits<{
  select: [id: string];
  remove: [id: string];
}>();
</script>

<template>
  <section class="panel compact-panel">
    <h2>场景对象</h2>
    <div class="object-list">
      <article v-for="object in objects" :key="object.id" class="object-row" :class="{ active: object.id === selectedId }">
        <button class="object-main" @click="emit('select', object.id)">
          <span class="color-dot" :style="{ background: object.color }" />
          <span>
            <strong>{{ object.name }}</strong>
            <small>{{ object.type }} · {{ object.isStatic ? '固定' : '运动' }}</small>
          </span>
        </button>
        <button class="mini-button danger" aria-label="删除对象" @click="emit('remove', object.id)">
          <Trash2 :size="15" aria-hidden="true" />
        </button>
      </article>
    </div>
  </section>
</template>
