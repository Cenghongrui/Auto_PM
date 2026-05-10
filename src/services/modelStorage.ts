import type { PhysicsModel } from '../types/physics';

const storageKey = 'auto-pm.saved-models';

export interface SavedPhysicsModel {
  id: string;
  name: string;
  savedAt: string;
  model: PhysicsModel;
}

export function loadSavedModels(): SavedPhysicsModel[] {
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as SavedPhysicsModel[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistSavedModels(models: SavedPhysicsModel[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(models));
}

export function createSavedModel(model: PhysicsModel): SavedPhysicsModel {
  return {
    id: crypto.randomUUID(),
    name: model.title,
    savedAt: new Date().toISOString(),
    model: clonePhysicsModel(model),
  };
}

export function parsePhysicsModelJson(value: string): PhysicsModel {
  const parsed = JSON.parse(value) as Partial<PhysicsModel>;

  if (
    !parsed.id ||
    !parsed.title ||
    !parsed.templateType ||
    !parsed.parameters ||
    !parsed.timeline ||
    !Array.isArray(parsed.objects) ||
    !Array.isArray(parsed.forces) ||
    !Array.isArray(parsed.annotations)
  ) {
    throw new Error('Invalid physics model JSON.');
  }

  return parsed as PhysicsModel;
}

export function downloadModelJson(model: PhysicsModel) {
  const blob = new Blob([JSON.stringify(clonePhysicsModel(model), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${model.title.replace(/[\\/:*?"<>|]/g, '-')}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function clonePhysicsModel(model: PhysicsModel): PhysicsModel {
  return JSON.parse(JSON.stringify(model)) as PhysicsModel;
}
