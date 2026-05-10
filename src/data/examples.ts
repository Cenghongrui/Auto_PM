import { createDefaultModel } from './templates';
import type { PhysicsModel } from '../types/physics';

export interface ExampleModel {
  id: string;
  name: string;
  description: string;
  model: PhysicsModel;
}

const projectile = createDefaultModel('projectile');
projectile.title = '篮球斜抛入筐';
projectile.parameters = { initialVelocity: 15, angle: 52, gravity: 9.8 };
projectile.annotations = [
  { time: 0.8, text: '速度分解为水平和竖直两个方向' },
  { time: 2.2, text: '最高点竖直速度为零' },
];

const incline = createDefaultModel('incline');
incline.title = '粗糙斜面上的木块';
incline.parameters = { angle: 30, friction: 0.24, gravity: 9.8 };
incline.annotations = [
  { time: 1, text: '沿斜面方向合力决定加速度' },
  { time: 3.4, text: '增大摩擦系数会削弱下滑趋势' },
];

const spring = createDefaultModel('spring');
spring.title = '水平弹簧振子';
spring.parameters = { stiffness: 36, mass: 1.5, amplitude: 1.2 };

const collision = createDefaultModel('collision');
collision.title = '两小车弹性碰撞';
collision.parameters = { massA: 2, massB: 2.8, velocityA: 6, elasticity: 0.95 };

export const exampleModels: ExampleModel[] = [
  {
    id: 'basketball-projectile',
    name: '篮球斜抛',
    description: '适合讲解速度分解、最高点和运动轨迹。',
    model: projectile,
  },
  {
    id: 'rough-incline',
    name: '粗糙斜面',
    description: '适合讲解重力分解、摩擦力和加速度。',
    model: incline,
  },
  {
    id: 'horizontal-spring',
    name: '弹簧振子',
    description: '适合讲解回复力、振幅和周期。',
    model: spring,
  },
  {
    id: 'cart-collision',
    name: '小车碰撞',
    description: '适合讲解动量守恒和恢复系数。',
    model: collision,
  },
];
