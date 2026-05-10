import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { createDefaultModel, getTemplateDefinition } from '../data/templates';
import type { PhysicsModel, TemplateType } from '../types/physics';

export const usePhysicsModelStore = defineStore('physicsModel', () => {
  const currentModel = ref<PhysicsModel>(createDefaultModel('projectile'));
  const generatedModel = ref<PhysicsModel | null>(null);

  const activeTemplate = computed(() => getTemplateDefinition(currentModel.value.templateType));

  function setGeneratedModel(model: PhysicsModel) {
    generatedModel.value = model;
    currentModel.value = structuredClone(model);
  }

  function selectTemplate(type: TemplateType) {
    currentModel.value = createDefaultModel(type);
  }

  function updateParameter(key: string, value: number) {
    currentModel.value = {
      ...currentModel.value,
      parameters: {
        ...currentModel.value.parameters,
        [key]: value,
      },
    };
  }

  function resetModel() {
    currentModel.value = createDefaultModel(currentModel.value.templateType);
  }

  return {
    currentModel,
    generatedModel,
    activeTemplate,
    setGeneratedModel,
    selectTemplate,
    updateParameter,
    resetModel,
  };
});
