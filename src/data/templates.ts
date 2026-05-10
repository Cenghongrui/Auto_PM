import type { PhysicsModel, TemplateDefinition, TemplateType } from '../types/physics';

export const templateDefinitions: TemplateDefinition[] = [
  {
    type: 'projectile',
    name: '抛体运动',
    description: '展示初速度、发射角和重力共同决定的二维轨迹。',
    fields: [
      { key: 'initialVelocity', label: '初速度', unit: 'm/s', min: 4, max: 40, step: 1 },
      { key: 'angle', label: '发射角', unit: '°', min: 10, max: 80, step: 1 },
      { key: 'gravity', label: '重力加速度', unit: 'm/s²', min: 1, max: 15, step: 0.1 },
    ],
  },
  {
    type: 'incline',
    name: '斜面滑块',
    description: '展示重力分解、摩擦和加速度对滑块运动的影响。',
    fields: [
      { key: 'angle', label: '斜面角', unit: '°', min: 5, max: 45, step: 1 },
      { key: 'friction', label: '摩擦系数', unit: '', min: 0, max: 0.8, step: 0.01 },
      { key: 'gravity', label: '重力加速度', unit: 'm/s²', min: 1, max: 15, step: 0.1 },
    ],
  },
  {
    type: 'spring',
    name: '弹簧振子',
    description: '展示弹簧劲度系数、质量和振幅决定的简谐振动。',
    fields: [
      { key: 'stiffness', label: '劲度系数', unit: 'N/m', min: 5, max: 80, step: 1 },
      { key: 'mass', label: '物块质量', unit: 'kg', min: 0.2, max: 5, step: 0.1 },
      { key: 'amplitude', label: '振幅', unit: 'm', min: 0.2, max: 2, step: 0.1 },
    ],
  },
  {
    type: 'collision',
    name: '简单碰撞',
    description: '展示两物体一维碰撞前后的速度变化。',
    fields: [
      { key: 'massA', label: 'A 质量', unit: 'kg', min: 0.5, max: 8, step: 0.1 },
      { key: 'massB', label: 'B 质量', unit: 'kg', min: 0.5, max: 8, step: 0.1 },
      { key: 'velocityA', label: 'A 初速度', unit: 'm/s', min: 0, max: 12, step: 0.1 },
      { key: 'elasticity', label: '恢复系数', unit: '', min: 0, max: 1, step: 0.05 },
    ],
  },
];

export const templateNames = Object.fromEntries(
  templateDefinitions.map((template) => [template.type, template.name]),
) as Record<TemplateType, string>;

export function getTemplateDefinition(type: TemplateType) {
  return templateDefinitions.find((template) => template.type === type) ?? templateDefinitions[0];
}

export function createDefaultModel(type: TemplateType = 'projectile'): PhysicsModel {
  const base = {
    id: crypto.randomUUID(),
    timeline: { duration: 6, fps: 30 },
  };

  if (type === 'incline') {
    return {
      ...base,
      title: '斜面滑块演示',
      templateType: 'incline',
      objects: [
        { id: 'block', label: '滑块', kind: 'block', mass: 1, color: '#2563eb' },
        { id: 'track', label: '斜面', kind: 'track', color: '#64748b' },
      ],
      forces: [
        { id: 'gravity', objectId: 'block', label: 'G', magnitude: 9.8, directionDeg: 90 },
        { id: 'friction', objectId: 'block', label: 'f', magnitude: 1.2, directionDeg: 180 },
      ],
      parameters: { angle: 25, friction: 0.18, gravity: 9.8 },
      annotations: [
        { time: 0.5, text: '重力沿斜面方向产生加速度' },
        { time: 3, text: '摩擦系数越大，滑块运动越慢' },
      ],
    };
  }

  if (type === 'spring') {
    return {
      ...base,
      title: '弹簧振子演示',
      templateType: 'spring',
      objects: [
        { id: 'spring', label: '弹簧', kind: 'spring', color: '#0f766e' },
        { id: 'block', label: '物块', kind: 'block', mass: 1.2, color: '#f97316' },
        { id: 'wall', label: '固定墙', kind: 'wall', color: '#475569' },
      ],
      forces: [{ id: 'restore', objectId: 'block', label: 'F=-kx', magnitude: 18, directionDeg: 180 }],
      parameters: { stiffness: 24, mass: 1.2, amplitude: 1 },
      annotations: [
        { time: 1, text: '位移越大，回复力越大' },
        { time: 4, text: '质量增大时周期变长' },
      ],
    };
  }

  if (type === 'collision') {
    return {
      ...base,
      title: '简单碰撞演示',
      templateType: 'collision',
      objects: [
        { id: 'ball-a', label: '小车 A', kind: 'block', mass: 2, color: '#dc2626' },
        { id: 'ball-b', label: '小车 B', kind: 'block', mass: 3, color: '#0891b2' },
      ],
      forces: [],
      parameters: { massA: 2, massB: 3, velocityA: 5, elasticity: 0.85 },
      annotations: [
        { time: 2.1, text: '碰撞瞬间动量守恒' },
        { time: 4.4, text: '恢复系数决定碰后分离速度' },
      ],
    };
  }

  return {
    ...base,
    title: '抛体运动演示',
    templateType: 'projectile',
    objects: [{ id: 'ball', label: '小球', kind: 'ball', mass: 1, color: '#16a34a' }],
    forces: [{ id: 'gravity', objectId: 'ball', label: 'G', magnitude: 9.8, directionDeg: 90 }],
    parameters: { initialVelocity: 18, angle: 42, gravity: 9.8 },
    annotations: [
      { time: 0.6, text: '水平速度保持不变' },
      { time: 2.4, text: '竖直方向做匀变速运动' },
    ],
  };
}
