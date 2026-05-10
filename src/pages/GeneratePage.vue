<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowRight, FileImage, LoaderCircle, Sparkles, Upload } from 'lucide-vue-next';
import ModelSummary from '../components/editor/ModelSummary.vue';
import PhysicsCanvas from '../components/player/PhysicsCanvas.vue';
import { generatePhysicsModel } from '../services/mockGenerator';
import { usePhysicsModelStore } from '../stores/physicsModel';

const router = useRouter();
const store = usePhysicsModelStore();
const prompt = ref('斜面上的滑块从静止释放，考虑摩擦力，分析加速度和位移变化。');
const isGenerating = ref(false);
const imagePreview = ref<string | null>(null);
const imageName = ref<string | undefined>();
const errorMessage = ref('');

const canGenerate = computed(() => prompt.value.trim().length > 0 || Boolean(imagePreview.value));

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  imageName.value = file.name;
  imagePreview.value = URL.createObjectURL(file);
}

async function generate() {
  if (!canGenerate.value || isGenerating.value) return;
  errorMessage.value = '';
  isGenerating.value = true;
  try {
    const model = await generatePhysicsModel({ prompt: prompt.value, imageName: imageName.value });
    store.setGeneratedModel(model);
  } catch {
    errorMessage.value = '生成失败，请稍后再试。';
  } finally {
    isGenerating.value = false;
  }
}

function openEditor() {
  router.push('/editor');
}
</script>

<template>
  <section class="generate-page">
    <div class="page-heading">
      <p class="eyebrow">智能生成</p>
      <h1>把高中物理题转成可播放的模型动画</h1>
      <p>输入题干或上传题目图片，系统会先用本地 Mock 生成结构化模型，之后可以在编辑器里继续精调。</p>
    </div>

    <div class="generate-grid">
      <section class="panel input-panel" aria-label="题目输入">
        <div class="panel-title">
          <Sparkles :size="20" aria-hidden="true" />
          <h2>题目信息</h2>
        </div>

        <label class="field-label" for="problem-prompt">题目描述</label>
        <textarea
          id="problem-prompt"
          v-model="prompt"
          rows="8"
          placeholder="例如：小球以一定初速度斜抛，求运动轨迹和最高点速度..."
        />

        <label class="upload-zone">
          <input type="file" accept="image/*" @change="onFileChange" />
          <Upload :size="22" aria-hidden="true" />
          <span>{{ imageName ?? '上传题目图片' }}</span>
        </label>

        <div v-if="imagePreview" class="image-preview">
          <img :src="imagePreview" alt="题目图片预览" />
          <span><FileImage :size="16" aria-hidden="true" />{{ imageName }}</span>
        </div>

        <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

        <button class="primary-button" :disabled="!canGenerate || isGenerating" @click="generate">
          <LoaderCircle v-if="isGenerating" class="spin" :size="18" aria-hidden="true" />
          <Sparkles v-else :size="18" aria-hidden="true" />
          <span>{{ isGenerating ? '生成中...' : '生成演示模型' }}</span>
        </button>
      </section>

      <section class="panel result-panel" aria-label="生成结果">
        <div class="panel-title">
          <FileImage :size="20" aria-hidden="true" />
          <h2>模型预览</h2>
        </div>

        <template v-if="store.generatedModel">
          <PhysicsCanvas :model="store.generatedModel" :time="2.2" :playing="false" />
          <ModelSummary :model="store.generatedModel" />
          <button class="secondary-button" @click="openEditor">
            <span>进入模型编辑器</span>
            <ArrowRight :size="18" aria-hidden="true" />
          </button>
        </template>
        <div v-else class="empty-state">
          <Sparkles :size="32" aria-hidden="true" />
          <p>生成后的模型 JSON、动画预览和参数摘要会显示在这里。</p>
        </div>
      </section>
    </div>
  </section>
</template>
