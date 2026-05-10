<script setup lang="ts">
import { computed } from 'vue';
import { templateNames } from '../../data/templates';
import type { PhysicsModel } from '../../types/physics';

const props = defineProps<{ model: PhysicsModel }>();

const parameterText = computed(() =>
  Object.entries(props.model.parameters)
    .map(([key, value]) => `${key}: ${value}`)
    .join(' · '),
);
</script>

<template>
  <section class="model-summary">
    <div>
      <span>模板</span>
      <strong>{{ templateNames[model.templateType] }}</strong>
    </div>
    <div>
      <span>对象</span>
      <strong>{{ model.objects.map((object) => object.label).join('、') }}</strong>
    </div>
    <div>
      <span>参数</span>
      <strong>{{ parameterText }}</strong>
    </div>
    <div>
      <span>时间轴</span>
      <strong>{{ model.timeline.duration }}s / {{ model.timeline.fps }}fps</strong>
    </div>
  </section>
</template>
