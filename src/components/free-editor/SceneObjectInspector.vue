<script setup lang="ts">
import type { SceneObject } from '../../types/physics';

const props = defineProps<{ object: SceneObject | null }>();
const emit = defineEmits<{ update: [id: string, patch: Partial<SceneObject>] }>();

function patch(values: Partial<SceneObject>) {
  if (!props.object) return;
  emit('update', props.object.id, values);
}
</script>

<template>
  <section class="panel compact-panel">
    <h2>属性面板</h2>
    <div v-if="object" class="inspector-form">
      <label class="text-field">
        <span>名称</span>
        <input :value="object.name" @input="patch({ name: ($event.target as HTMLInputElement).value })" />
      </label>

      <label class="check-row">
        <input type="checkbox" :checked="object.isStatic" @change="patch({ isStatic: ($event.target as HTMLInputElement).checked })" />
        <span>固定物体</span>
      </label>

      <div class="number-grid">
        <label>
          <span>X</span>
          <input type="number" :value="object.x" @input="patch({ x: Number(($event.target as HTMLInputElement).value) })" />
        </label>
        <label>
          <span>Y</span>
          <input type="number" :value="object.y" @input="patch({ y: Number(($event.target as HTMLInputElement).value) })" />
        </label>
        <label>
          <span>宽</span>
          <input type="number" :value="object.width" @input="patch({ width: Number(($event.target as HTMLInputElement).value) })" />
        </label>
        <label>
          <span>高</span>
          <input type="number" :value="object.height" @input="patch({ height: Number(($event.target as HTMLInputElement).value) })" />
        </label>
        <label>
          <span>角度</span>
          <input type="number" :value="object.angle" @input="patch({ angle: Number(($event.target as HTMLInputElement).value) })" />
        </label>
        <label>
          <span>质量</span>
          <input type="number" min="0.1" step="0.1" :value="object.mass" @input="patch({ mass: Number(($event.target as HTMLInputElement).value) })" />
        </label>
        <label>
          <span>Vx</span>
          <input type="number" step="0.1" :value="object.velocityX" @input="patch({ velocityX: Number(($event.target as HTMLInputElement).value) })" />
        </label>
        <label>
          <span>Vy</span>
          <input type="number" step="0.1" :value="object.velocityY" @input="patch({ velocityY: Number(($event.target as HTMLInputElement).value) })" />
        </label>
        <label>
          <span>摩擦</span>
          <input type="number" min="0" max="1" step="0.01" :value="object.friction" @input="patch({ friction: Number(($event.target as HTMLInputElement).value) })" />
        </label>
        <label>
          <span>弹性</span>
          <input type="number" min="0" max="1" step="0.05" :value="object.restitution" @input="patch({ restitution: Number(($event.target as HTMLInputElement).value) })" />
        </label>
      </div>
    </div>
    <p v-else class="muted-text">选择画布中的对象后可编辑参数。</p>
  </section>
</template>
