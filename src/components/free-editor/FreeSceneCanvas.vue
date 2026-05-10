<script setup lang="ts">
import { computed } from 'vue';
import { simulateFreeScene } from '../../physics/freeSceneEngine';
import type { FreePhysicsScene, SceneObject } from '../../types/physics';

const props = defineProps<{
  scene: FreePhysicsScene;
  time: number;
  playing: boolean;
}>();

const emit = defineEmits<{
  select: [id: string];
  move: [id: string, x: number, y: number];
}>();

const simulated = computed(() => simulateFreeScene(props.scene, props.time));
let dragId = '';

function pointerPosition(event: PointerEvent) {
  const svg = event.currentTarget as SVGSVGElement;
  const rect = svg.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function onPointerDown(event: PointerEvent, object: SceneObject) {
  if (props.playing) return;
  dragId = object.id;
  emit('select', object.id);
  (event.currentTarget as SVGElement).setPointerCapture(event.pointerId);
}

function onPointerMove(event: PointerEvent) {
  if (!dragId || props.playing) return;
  const point = pointerPosition(event);
  emit('move', dragId, point.x, point.y);
}

function onPointerUp() {
  dragId = '';
}
</script>

<template>
  <svg
    class="free-scene-canvas"
    viewBox="0 0 860 500"
    role="img"
    aria-label="自由物理场景画布"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointerleave="onPointerUp"
  >
    <defs>
      <pattern id="scene-grid" width="32" height="32" patternUnits="userSpaceOnUse">
        <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#e2e8f0" stroke-width="1" />
      </pattern>
    </defs>
    <rect width="860" height="500" fill="#f8fafc" />
    <rect width="860" height="500" fill="url(#scene-grid)" />

    <g v-for="object in simulated.objects" :key="object.id">
      <circle
        v-if="object.type === 'ball'"
        :cx="object.renderX"
        :cy="object.renderY"
        :r="object.radius ?? object.width / 2"
        :fill="object.color"
        :stroke="object.id === scene.selectedObjectId ? '#f59e0b' : '#0f172a'"
        stroke-width="3"
        @pointerdown="onPointerDown($event, object)"
      />
      <rect
        v-else
        :x="object.renderX - object.width / 2"
        :y="object.renderY - object.height / 2"
        :width="object.width"
        :height="object.height"
        :rx="object.type === 'block' ? 6 : 2"
        :fill="object.color"
        :stroke="object.id === scene.selectedObjectId ? '#f59e0b' : '#0f172a'"
        stroke-width="3"
        :transform="`rotate(${object.renderAngle} ${object.renderX} ${object.renderY})`"
        @pointerdown="onPointerDown($event, object)"
      />
      <text :x="object.renderX" :y="object.renderY - object.height / 2 - 12" text-anchor="middle" class="scene-label">
        {{ object.name }}
      </text>
    </g>
  </svg>
</template>
