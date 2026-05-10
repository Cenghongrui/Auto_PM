<script setup lang="ts">
import type { TemplateDefinition } from '../../types/physics';

defineProps<{
  template: TemplateDefinition;
  parameters: Record<string, number>;
}>();

const emit = defineEmits<{ updateParameter: [key: string, value: number] }>();
</script>

<template>
  <section class="panel compact-panel">
    <h2>参数调节</h2>
    <div class="parameter-list">
      <label v-for="field in template.fields" :key="field.key" class="parameter-row">
        <span>
          <strong>{{ field.label }}</strong>
          <small>{{ parameters[field.key] }} {{ field.unit }}</small>
        </span>
        <input
          type="range"
          :min="field.min"
          :max="field.max"
          :step="field.step"
          :value="parameters[field.key]"
          @input="emit('updateParameter', field.key, Number(($event.target as HTMLInputElement).value))"
        />
      </label>
    </div>
  </section>
</template>
