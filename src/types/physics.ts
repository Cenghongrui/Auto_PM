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
