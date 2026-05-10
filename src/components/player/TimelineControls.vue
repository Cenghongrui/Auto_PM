<script setup lang="ts">
const time = defineModel<number>('time', { required: true });
defineProps<{ duration: number }>();
</script>

<template>
  <div class="timeline">
    <span>{{ time.toFixed(1) }}s</span>
    <input v-model.number="time" type="range" min="0" :max="duration" step="0.05" />
    <span>{{ duration.toFixed(1) }}s</span>
  </div>
</template>
