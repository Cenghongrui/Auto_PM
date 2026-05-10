export type TemplateType = 'projectile' | 'incline' | 'spring' | 'collision';

export interface PhysicsObject {
  id: string;
  label: string;
  kind: 'ball' | 'block' | 'spring' | 'track' | 'wall';
  mass?: number;
  color: string;
}

export interface ForceVector {
  id: string;
  objectId: string;
  label: string;
  magnitude: number;
  directionDeg: number;
}

export interface TimelineConfig {
  duration: number;
  fps: number;
}

export interface PhysicsAnnotation {
  time: number;
  text: string;
}

export interface PhysicsModel {
  id: string;
  title: string;
  templateType: TemplateType;
  objects: PhysicsObject[];
  forces: ForceVector[];
  parameters: Record<string, number>;
  timeline: TimelineConfig;
  annotations: PhysicsAnnotation[];
}

export interface ParameterField {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
}

export interface TemplateDefinition {
  type: TemplateType;
  name: string;
  description: string;
  fields: ParameterField[];
}

export type SceneObjectType = 'block' | 'ball' | 'incline' | 'platform' | 'wall';

export interface SceneObject {
  id: string;
  name: string;
  type: SceneObjectType;
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
  angle: number;
  mass: number;
  friction: number;
  restitution: number;
  velocityX: number;
  velocityY: number;
  isStatic: boolean;
  color: string;
}

export interface SceneSettings {
  gravity: number;
  duration: number;
  pixelsPerMeter: number;
}

export interface FreePhysicsScene {
  id: string;
  title: string;
  settings: SceneSettings;
  objects: SceneObject[];
  selectedObjectId?: string;
}
