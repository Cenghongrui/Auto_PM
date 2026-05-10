<script setup lang="ts">
import type { SceneSettings } from '../../types/physics';

defineProps<{ settings: SceneSettings }>();
const emit = defineEmits<{ update: [settings: Partial<SceneSettings>] }>();
</script>

<template>
  <section class="panel compact-panel">
    <h2>环境参数</h2>
    <label class="parameter-row">
      <span>
        <strong>重力加速度</strong>
        <small>{{ settings.gravity }} m/s²</small>
      </span>
      <input
        type="range"
        min="0"
        max="15"
        step="0.1"
        :value="settings.gravity"
        @input="emit('update', { gravity: Number(($event.target as HTMLInputElement).value) })"
      />
    </label>
    <label class="parameter-row">
      <span>
        <strong>演示时长</strong>
        <small>{{ settings.duration }} s</small>
      </span>
      <input
        type="range"
        min="3"
        max="15"
        step="1"
        :value="settings.duration"
        @input="emit('update', { duration: Number(($event.target as HTMLInputElement).value) })"
      />
    </label>
  </section>
</template>
