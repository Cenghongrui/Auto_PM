<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { Download, Pause, Play, RotateCcw } from 'lucide-vue-next';
import ExampleLibrary from '../components/editor/ExampleLibrary.vue';
import ModelIoPanel from '../components/editor/ModelIoPanel.vue';
import ModelSummary from '../components/editor/ModelSummary.vue';
import SavedModelPanel from '../components/editor/SavedModelPanel.vue';
import FreeSceneCanvas from '../components/free-editor/FreeSceneCanvas.vue';
import ObjectPalette from '../components/free-editor/ObjectPalette.vue';
import SceneObjectInspector from '../components/free-editor/SceneObjectInspector.vue';
import SceneObjectList from '../components/free-editor/SceneObjectList.vue';
import SceneSettingsPanel from '../components/free-editor/SceneSettingsPanel.vue';
import TimelineControls from '../components/player/TimelineControls.vue';
import { downloadModelJson, parsePhysicsModelJson } from '../services/modelStorage';
import { usePhysicsModelStore } from '../stores/physicsModel';

const store = usePhysicsModelStore();
const playing = ref(false);
const time = ref(0);
const ioMessage = ref('');
let frameId = 0;
let lastFrame = 0;

const remotionConfig = computed(() => ({
  compositionId: 'free-physics-scene',
  durationInFrames: store.freeScene.settings.duration * store.currentModel.timeline.fps,
  fps: store.currentModel.timeline.fps,
  props: {
    scene: store.freeScene,
    legacyModel: store.currentModel,
  },
}));

function togglePlaying() {
  playing.value = !playing.value;
  lastFrame = 0;
}

function reset() {
  time.value = 0;
  playing.value = false;
  lastFrame = 0;
}

function resetScene() {
  store.resetFreeScene();
  reset();
}

function tick(timestamp: number) {
  if (playing.value) {
    const delta = lastFrame ? (timestamp - lastFrame) / 1000 : 0;
    time.value = (time.value + delta) % store.freeScene.settings.duration;
  }

  lastFrame = timestamp;
  frameId = window.requestAnimationFrame(tick);
}

function saveCurrentModel() {
  store.saveCurrentModel();
  ioMessage.value = '当前模板模型已保存到本地。';
}

async function importModel(file: File) {
  try {
    const text = await file.text();
    store.setCurrentModel(parsePhysicsModelJson(text));
    ioMessage.value = `已导入 ${file.name}。`;
  } catch {
    ioMessage.value = '导入失败：JSON 格式不是有效的物理模型。';
  }
}

function exportModel() {
  downloadModelJson(store.currentModel);
  ioMessage.value = '已生成当前模板模型的 JSON 文件。';
}

onMounted(() => {
  frameId = window.requestAnimationFrame(tick);
});

onUnmounted(() => {
  window.cancelAnimationFrame(frameId);
});
</script>

<template>
  <section class="editor-page free-editor-page">
    <aside class="editor-sidebar">
      <ObjectPalette @add="store.addSceneObject" />
      <SceneObjectList
        :objects="store.freeScene.objects"
        :selected-id="store.freeScene.selectedObjectId"
        @select="store.selectSceneObject"
        @remove="store.deleteSceneObject"
      />
      <SceneObjectInspector :object="store.selectedSceneObject" @update="store.updateSceneObject" />
      <SceneSettingsPanel :settings="store.freeScene.settings" @update="store.updateSceneSettings" />
      <SavedModelPanel
        :models="store.savedModels"
        @save-model="saveCurrentModel"
        @load="store.loadSavedModel"
        @remove="store.deleteSavedModel"
      />
      <ModelIoPanel :message="ioMessage" @export="exportModel" @import="importModel" />
    </aside>

    <section class="workspace">
      <div class="workspace-header">
        <div>
          <p class="eyebrow">模块化模型编辑器</p>
          <h1>{{ store.freeScene.title }}</h1>
        </div>
        <div class="toolbar" aria-label="播放工具栏">
          <button class="icon-button" :title="playing ? '暂停' : '播放'" :aria-label="playing ? '暂停' : '播放'" @click="togglePlaying">
            <Pause v-if="playing" :size="20" aria-hidden="true" />
            <Play v-else :size="20" aria-hidden="true" />
          </button>
          <button class="icon-button" title="重置时间" aria-label="重置时间" @click="reset">
            <RotateCcw :size="20" aria-hidden="true" />
          </button>
          <button class="text-button" title="重置场景" @click="resetScene">
            <RotateCcw :size="18" aria-hidden="true" />
            <span>重置场景</span>
          </button>
          <button class="text-button" title="Remotion 导出预留">
            <Download :size="18" aria-hidden="true" />
            <span>导出</span>
          </button>
        </div>
      </div>

      <FreeSceneCanvas
        :scene="store.freeScene"
        :time="time"
        :playing="playing"
        @select="store.selectSceneObject"
        @move="store.moveSceneObject"
      />
      <TimelineControls v-model:time="time" :duration="store.freeScene.settings.duration" />

      <section class="teaching-panel">
        <div>
          <h2>教学级物理引擎</h2>
          <p>
            当前自由场景使用 Matter.js 进行刚体碰撞、重力、摩擦和弹性模拟。播放前可拖拽物体任意摆放，并在左侧设置质量、速度、角度、摩擦系数和恢复系数。
          </p>
        </div>
        <ModelSummary :model="store.currentModel" />
      </section>

      <section class="remotion-box" aria-label="Remotion 导出配置">
        <div>
          <h2>Remotion 导出配置</h2>
          <p>自由场景已整理为可传入渲染层的 scene props，后续可复用同一场景数据导出教学视频。</p>
        </div>
        <pre>{{ JSON.stringify(remotionConfig, null, 2) }}</pre>
      </section>

      <section class="legacy-tools">
        <ExampleLibrary @load="store.setCurrentModel" />
      </section>
    </section>
  </section>
</template>
