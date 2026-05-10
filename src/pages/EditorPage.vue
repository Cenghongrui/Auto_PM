<script setup lang="ts">
import { computed, ref } from 'vue';
import { Download, Pause, Play, RotateCcw } from 'lucide-vue-next';
import ModelSummary from '../components/editor/ModelSummary.vue';
import ParameterPanel from '../components/editor/ParameterPanel.vue';
import TemplateSelector from '../components/editor/TemplateSelector.vue';
import PhysicsCanvas from '../components/player/PhysicsCanvas.vue';
import TimelineControls from '../components/player/TimelineControls.vue';
import { usePhysicsModelStore } from '../stores/physicsModel';

const store = usePhysicsModelStore();
const playing = ref(false);
const time = ref(0);

const remotionConfig = computed(() => ({
  compositionId: `physics-${store.currentModel.templateType}`,
  durationInFrames: store.currentModel.timeline.duration * store.currentModel.timeline.fps,
  fps: store.currentModel.timeline.fps,
  props: store.currentModel,
}));

function togglePlaying() {
  playing.value = !playing.value;
}

function reset() {
  time.value = 0;
  playing.value = false;
}
</script>

<template>
  <section class="editor-page">
    <aside class="editor-sidebar">
      <TemplateSelector :active-type="store.currentModel.templateType" @select="store.selectTemplate" />
      <ParameterPanel
        :template="store.activeTemplate"
        :parameters="store.currentModel.parameters"
        @update-parameter="store.updateParameter"
      />
      <ModelSummary :model="store.currentModel" />
    </aside>

    <section class="workspace">
      <div class="workspace-header">
        <div>
          <p class="eyebrow">模型编辑器</p>
          <h1>{{ store.currentModel.title }}</h1>
        </div>
        <div class="toolbar" aria-label="播放工具栏">
          <button class="icon-button" :title="playing ? '暂停' : '播放'" @click="togglePlaying">
            <Pause v-if="playing" :size="20" aria-hidden="true" />
            <Play v-else :size="20" aria-hidden="true" />
          </button>
          <button class="icon-button" title="重置时间" @click="reset">
            <RotateCcw :size="20" aria-hidden="true" />
          </button>
          <button class="text-button" title="Remotion 导出预留">
            <Download :size="18" aria-hidden="true" />
            <span>导出</span>
          </button>
        </div>
      </div>

      <PhysicsCanvas v-model:time="time" :model="store.currentModel" :playing="playing" />
      <TimelineControls v-model:time="time" :duration="store.currentModel.timeline.duration" />

      <section class="remotion-box" aria-label="Remotion 导出配置">
        <div>
          <h2>Remotion 导出配置</h2>
          <p>当前模型已映射为 Composition props，后续接入渲染服务即可导出视频。</p>
        </div>
        <pre>{{ JSON.stringify(remotionConfig, null, 2) }}</pre>
      </section>
    </section>
  </section>
</template>
