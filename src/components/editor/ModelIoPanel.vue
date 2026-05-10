<script setup lang="ts">
import { Download, Upload } from 'lucide-vue-next';

defineProps<{ message: string }>();

const emit = defineEmits<{
  export: [];
  import: [file: File];
}>();

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  emit('import', file);
  input.value = '';
}
</script>

<template>
  <section class="panel compact-panel">
    <h2>导入导出</h2>
    <div class="io-actions">
      <button class="text-button full-width" @click="emit('export')">
        <Download :size="18" aria-hidden="true" />
        <span>导出 JSON</span>
      </button>
      <label class="text-button full-width file-button">
        <Upload :size="18" aria-hidden="true" />
        <span>导入 JSON</span>
        <input type="file" accept="application/json,.json" @change="onFileChange" />
      </label>
    </div>
    <p v-if="message" class="muted-text">{{ message }}</p>
  </section>
</template>
