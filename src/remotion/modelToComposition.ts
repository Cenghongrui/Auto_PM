import type { PhysicsModel } from '../types/physics';

export interface PhysicsCompositionConfig {
  id: string;
  fps: number;
  durationInFrames: number;
  width: number;
  height: number;
  defaultProps: PhysicsModel;
}

export function modelToComposition(model: PhysicsModel): PhysicsCompositionConfig {
  return {
    id: `physics-${model.templateType}`,
    fps: model.timeline.fps,
    durationInFrames: model.timeline.duration * model.timeline.fps,
    width: 1280,
    height: 720,
    defaultProps: model,
  };
}
