<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { renderPhysicsScene } from '../../physics/renderers/renderScene';
import type { PhysicsModel } from '../../types/physics';

const props = withDefaults(
  defineProps<{
    model: PhysicsModel;
    playing?: boolean;
  }>(),
  { playing: false },
);

const time = defineModel<number>('time', { default: 0 });
const canvasRef = ref<HTMLCanvasElement | null>(null);
let frameId = 0;
let lastFrame = 0;

function draw() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = rect.width * pixelRatio;
  canvas.height = rect.height * pixelRatio;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.scale(pixelRatio, pixelRatio);
  renderPhysicsScene(ctx, props.model, { width: rect.width, height: rect.height }, time.value);
}

function animate(timestamp: number) {
  if (props.playing) {
    const delta = lastFrame ? (timestamp - lastFrame) / 1000 : 0;
    time.value = (time.value + delta) % props.model.timeline.duration;
  }
  lastFrame = timestamp;
  draw();
  frameId = window.requestAnimationFrame(animate);
}

onMounted(() => {
  frameId = window.requestAnimationFrame(animate);
  window.addEventListener('resize', draw);
});

onUnmounted(() => {
  window.cancelAnimationFrame(frameId);
  window.removeEventListener('resize', draw);
});

watch(() => props.model, draw, { deep: true });
watch(time, draw);
</script>

<template>
  <canvas ref="canvasRef" class="physics-canvas" aria-label="物理动画预览" />
</template>
