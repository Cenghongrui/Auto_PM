import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { createDefaultModel, getTemplateDefinition } from '../data/templates';
import { createSavedModel, loadSavedModels, persistSavedModels } from '../services/modelStorage';
import type { SavedPhysicsModel } from '../services/modelStorage';
import type { PhysicsModel, TemplateType } from '../types/physics';

export const usePhysicsModelStore = defineStore('physicsModel', () => {
  const currentModel = ref<PhysicsModel>(createDefaultModel('projectile'));
  const generatedModel = ref<PhysicsModel | null>(null);
  const savedModels = ref<SavedPhysicsModel[]>(loadSavedModels());

  const activeTemplate = computed(() => getTemplateDefinition(currentModel.value.templateType));

  function setCurrentModel(model: PhysicsModel) {
    currentModel.value = JSON.parse(JSON.stringify(model)) as PhysicsModel;
  }

  function setGeneratedModel(model: PhysicsModel) {
    generatedModel.value = model;
    setCurrentModel(model);
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

  function saveCurrentModel() {
    const saved = createSavedModel(currentModel.value);
    savedModels.value = [saved, ...savedModels.value].slice(0, 12);
    persistSavedModels(savedModels.value);
  }

  function loadSavedModel(saved: SavedPhysicsModel) {
    setCurrentModel(saved.model);
  }

  function deleteSavedModel(id: string) {
    savedModels.value = savedModels.value.filter((model) => model.id !== id);
    persistSavedModels(savedModels.value);
  }

  return {
    currentModel,
    generatedModel,
    savedModels,
    activeTemplate,
    setCurrentModel,
    setGeneratedModel,
    selectTemplate,
    updateParameter,
    resetModel,
    saveCurrentModel,
    loadSavedModel,
    deleteSavedModel,
  };
});
