<script setup lang="ts">
import { FolderOpen, Save, Trash2 } from 'lucide-vue-next';
import type { SavedPhysicsModel } from '../../services/modelStorage';

defineProps<{ models: SavedPhysicsModel[] }>();

const emit = defineEmits<{
  saveModel: [];
  load: [model: SavedPhysicsModel];
  remove: [id: string];
}>();

function formatTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}
</script>

<template>
  <section class="panel compact-panel">
    <div class="panel-title">
      <FolderOpen :size="18" aria-hidden="true" />
      <h2>本地模型</h2>
    </div>

    <button class="text-button full-width save-model-button" type="button" @click="emit('saveModel')">
      <Save :size="17" aria-hidden="true" />
      <span>保存当前模型</span>
    </button>

    <div v-if="models.length" class="library-list">
      <article v-for="item in models" :key="item.id" class="saved-item">
        <button class="saved-main" @click="emit('load', item)">
          <strong>{{ item.name }}</strong>
          <span>{{ formatTime(item.savedAt) }}</span>
        </button>
        <button class="mini-button danger" title="删除" aria-label="删除保存模型" @click="emit('remove', item.id)">
          <Trash2 :size="15" aria-hidden="true" />
        </button>
      </article>
    </div>
    <p v-else class="muted-text">还没有保存的模型。</p>
  </section>
</template>
