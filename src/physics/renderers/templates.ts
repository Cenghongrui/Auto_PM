import type { PhysicsModel } from '../../types/physics';
import type { CanvasSize } from './canvasPrimitives';
import { drawArrow, drawGround } from './canvasPrimitives';

export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  model: PhysicsModel;
  size: CanvasSize;
  time: number;
}

export type TemplateRenderer = (context: RenderContext) => void;

export const renderProjectile: TemplateRenderer = ({ ctx, model, size, time }) => {
  const { initialVelocity, angle, gravity } = model.parameters;
  const rad = (angle * Math.PI) / 180;
  const vx = initialVelocity * Math.cos(rad);
  const vy = initialVelocity * Math.sin(rad);
  const total = Math.max(2.8, (2 * vy) / gravity);
  const simT = Math.min(time % model.timeline.duration, total);
  const scale = Math.min(size.width / (vx * total + 8), size.height / ((vy * vy) / (2 * gravity) + 8));
  const originX = 58;
  const originY = size.height - 64;
  const x = originX + vx * simT * scale;
  const y = originY - (vy * simT - 0.5 * gravity * simT * simT) * scale;

  drawGround(ctx, size.width, originY);
  ctx.strokeStyle = '#86efac';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i <= 80; i += 1) {
    const sample = (total * i) / 80;
    const px = originX + vx * sample * scale;
    const py = originY - (vy * sample - 0.5 * gravity * sample * sample) * scale;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  ctx.fillStyle = model.objects[0]?.color ?? '#16a34a';
  ctx.beginPath();
  ctx.arc(x, y, 14, 0, Math.PI * 2);
  ctx.fill();
  drawArrow(ctx, x, y, 0, 42, 'G');
};

export const renderIncline: TemplateRenderer = ({ ctx, model, size, time }) => {
  const { angle, friction, gravity } = model.parameters;
  const rad = (angle * Math.PI) / 180;
  const baseX = 70;
  const baseY = size.height - 58;
  const length = size.width - 140;
  const topX = baseX + length * Math.cos(rad);
  const topY = baseY - length * Math.sin(rad);
  const acceleration = Math.max(0.1, gravity * (Math.sin(rad) - friction * Math.cos(rad)));
  const progress = Math.min(1, (0.5 * acceleration * (time % model.timeline.duration) ** 2) / 18);
  const x = topX + (baseX - topX) * progress;
  const y = topY + (baseY - topY) * progress;

  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(baseX, baseY);
  ctx.lineTo(topX, topY);
  ctx.lineTo(baseX, baseY);
  ctx.stroke();

  ctx.save();
  ctx.translate(x, y - 16);
  ctx.rotate(rad);
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(-18, -14, 36, 28);
  ctx.restore();
  drawArrow(ctx, x, y - 22, 0, 44, 'G');
  drawArrow(ctx, x, y - 22, -34 * Math.cos(rad), 34 * Math.sin(rad), 'f');
};

export const renderSpring: TemplateRenderer = ({ ctx, model, size, time }) => {
  const { stiffness, mass, amplitude } = model.parameters;
  const centerY = size.height / 2;
  const wallX = 76;
  const restX = size.width / 2 + 40;
  const omega = Math.sqrt(stiffness / mass);
  const displacement = Math.cos(omega * time) * amplitude * 48;
  const blockX = restX + displacement;

  ctx.fillStyle = '#475569';
  ctx.fillRect(wallX - 18, centerY - 72, 18, 144);
  ctx.strokeStyle = '#0f766e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(wallX, centerY);
  for (let i = 0; i <= 12; i += 1) {
    const x = wallX + ((blockX - wallX - 28) * i) / 12;
    const y = centerY + (i % 2 === 0 ? -18 : 18);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(blockX - 28, centerY);
  ctx.stroke();

  ctx.fillStyle = '#f97316';
  ctx.fillRect(blockX - 28, centerY - 28, 56, 56);
  drawGround(ctx, size.width, centerY + 42);
  drawArrow(ctx, blockX, centerY - 38, displacement > 0 ? -48 : 48, 0, 'F=-kx');
};

export const renderCollision: TemplateRenderer = ({ ctx, model, size, time }) => {
  const { massA, massB, velocityA, elasticity } = model.parameters;
  const trackY = size.height / 2 + 40;
  const hitTime = 2.2;
  const vAfterA = ((massA - elasticity * massB) / (massA + massB)) * velocityA;
  const vAfterB = ((1 + elasticity) * massA * velocityA) / (massA + massB);
  const before = Math.min(time, hitTime);
  const after = Math.max(0, time - hitTime);
  const collisionX = size.width / 2;
  const xA = time < hitTime ? 90 + before * velocityA * 38 : collisionX + after * vAfterA * 32;
  const xB = time < hitTime ? collisionX + 32 : collisionX + 32 + after * vAfterB * 32;

  drawGround(ctx, size.width, trackY + 28);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(xA - 28, trackY - 28, 56, 56);
  ctx.fillStyle = '#0891b2';
  ctx.fillRect(xB - 28, trackY - 28, 56, 56);
  drawArrow(ctx, xA, trackY - 42, time < hitTime ? 44 : Math.sign(vAfterA) * 36, 0, 'vA');
  drawArrow(ctx, xB, trackY - 42, time < hitTime ? 0 : 48, 0, 'vB');
};
