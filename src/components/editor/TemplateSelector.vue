<script setup lang="ts">
import { Blocks, CircleDot, Mountain, Waves } from 'lucide-vue-next';
import { templateDefinitions } from '../../data/templates';
import type { TemplateType } from '../../types/physics';

defineProps<{ activeType: TemplateType }>();
const emit = defineEmits<{ select: [type: TemplateType] }>();

const icons = {
  projectile: CircleDot,
  incline: Mountain,
  spring: Waves,
  collision: Blocks,
};
</script>

<template>
  <section class="panel compact-panel">
    <h2>模型模板</h2>
    <div class="template-list">
      <button
        v-for="template in templateDefinitions"
        :key="template.type"
        class="template-button"
        :class="{ active: template.type === activeType }"
        @click="emit('select', template.type)"
      >
        <component :is="icons[template.type]" :size="20" aria-hidden="true" />
        <span>
          <strong>{{ template.name }}</strong>
          <small>{{ template.description }}</small>
        </span>
      </button>
    </div>
  </section>
</template>
