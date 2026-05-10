import type { FreePhysicsScene, SceneObject, SceneObjectType } from '../types/physics';

const colors: Record<SceneObjectType, string> = {
  block: '#2563eb',
  ball: '#16a34a',
  incline: '#64748b',
  platform: '#475569',
  wall: '#334155',
};

export function createDefaultFreeScene(): FreePhysicsScene {
  return {
    id: crypto.randomUUID(),
    title: '自由物理模型场景',
    settings: {
      gravity: 9.8,
      duration: 8,
      pixelsPerMeter: 60,
    },
    selectedObjectId: 'block-1',
    objects: [
      createSceneObject('block', { id: 'block-1', name: '滑块 A', x: 230, y: 120, velocityX: 1.2 }),
      createSceneObject('incline', { id: 'incline-1', name: '斜面', x: 430, y: 300, angle: -18 }),
      createSceneObject('platform', { id: 'platform-1', name: '地面', x: 430, y: 430, width: 760 }),
    ],
  };
}

export function createSceneObject(type: SceneObjectType, overrides: Partial<SceneObject> = {}): SceneObject {
  const base = defaultsByType(type);
  return {
    ...base,
    id: overrides.id ?? crypto.randomUUID(),
    name: overrides.name ?? base.name,
    color: colors[type],
    ...overrides,
  };
}

function defaultsByType(type: SceneObjectType): SceneObject {
  if (type === 'ball') {
    return {
      id: '',
      name: '小球',
      type,
      x: 180,
      y: 120,
      width: 52,
      height: 52,
      radius: 26,
      angle: 0,
      mass: 1,
      friction: 0.08,
      restitution: 0.55,
      velocityX: 0,
      velocityY: 0,
      isStatic: false,
      color: colors.ball,
    };
  }

  if (type === 'incline') {
    return {
      id: '',
      name: '斜面',
      type,
      x: 420,
      y: 260,
      width: 280,
      height: 28,
      angle: -20,
      mass: 1,
      friction: 0.28,
      restitution: 0.1,
      velocityX: 0,
      velocityY: 0,
      isStatic: true,
      color: colors.incline,
    };
  }

  if (type === 'platform' || type === 'wall') {
    return {
      id: '',
      name: type === 'platform' ? '平台' : '挡板',
      type,
      x: type === 'platform' ? 420 : 700,
      y: type === 'platform' ? 420 : 260,
      width: type === 'platform' ? 320 : 28,
      height: type === 'platform' ? 28 : 220,
      angle: 0,
      mass: 1,
      friction: 0.35,
      restitution: 0.08,
      velocityX: 0,
      velocityY: 0,
      isStatic: true,
      color: colors[type],
    };
  }

  return {
    id: '',
    name: '物块',
    type,
    x: 180,
    y: 120,
    width: 70,
    height: 48,
    angle: 0,
    mass: 1.5,
    friction: 0.18,
    restitution: 0.25,
    velocityX: 0,
    velocityY: 0,
    isStatic: false,
    color: colors.block,
  };
}
