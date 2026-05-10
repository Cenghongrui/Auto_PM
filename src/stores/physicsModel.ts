import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { createDefaultModel, getTemplateDefinition } from '../data/templates';
import { createDefaultFreeScene, createSceneObject } from '../physics/freeSceneFactory';
import { createSavedModel, loadSavedModels, persistSavedModels } from '../services/modelStorage';
import type { SavedPhysicsModel } from '../services/modelStorage';
import type { FreePhysicsScene, PhysicsModel, SceneObject, SceneObjectType, TemplateType } from '../types/physics';

export const usePhysicsModelStore = defineStore('physicsModel', () => {
  const currentModel = ref<PhysicsModel>(createDefaultModel('projectile'));
  const freeScene = ref<FreePhysicsScene>(createDefaultFreeScene());
  const generatedModel = ref<PhysicsModel | null>(null);
  const savedModels = ref<SavedPhysicsModel[]>(loadSavedModels());

  const activeTemplate = computed(() => getTemplateDefinition(currentModel.value.templateType));
  const selectedSceneObject = computed(
    () => freeScene.value.objects.find((object) => object.id === freeScene.value.selectedObjectId) ?? null,
  );

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

  function addSceneObject(type: SceneObjectType) {
    const object = createSceneObject(type, {
      x: 160 + freeScene.value.objects.length * 28,
      y: 100 + freeScene.value.objects.length * 18,
    });
    freeScene.value = {
      ...freeScene.value,
      selectedObjectId: object.id,
      objects: [...freeScene.value.objects, object],
    };
  }

  function selectSceneObject(id: string) {
    freeScene.value.selectedObjectId = id;
  }

  function updateSceneObject(id: string, patch: Partial<SceneObject>) {
    freeScene.value = {
      ...freeScene.value,
      objects: freeScene.value.objects.map((object) => (object.id === id ? { ...object, ...patch } : object)),
    };
  }

  function moveSceneObject(id: string, x: number, y: number) {
    updateSceneObject(id, { x, y });
  }

  function deleteSceneObject(id: string) {
    const objects = freeScene.value.objects.filter((object) => object.id !== id);
    freeScene.value = {
      ...freeScene.value,
      objects,
      selectedObjectId: objects[0]?.id,
    };
  }

  function updateSceneSettings(settings: Partial<FreePhysicsScene['settings']>) {
    freeScene.value = {
      ...freeScene.value,
      settings: {
        ...freeScene.value.settings,
        ...settings,
      },
    };
  }

  function resetFreeScene() {
    freeScene.value = createDefaultFreeScene();
  }

  return {
    currentModel,
    freeScene,
    generatedModel,
    savedModels,
    activeTemplate,
    selectedSceneObject,
    setCurrentModel,
    setGeneratedModel,
    selectTemplate,
    updateParameter,
    resetModel,
    saveCurrentModel,
    loadSavedModel,
    deleteSavedModel,
    addSceneObject,
    selectSceneObject,
    updateSceneObject,
    moveSceneObject,
    deleteSceneObject,
    updateSceneSettings,
    resetFreeScene,
  };
});
