import type { PhysicsModel, TemplateType } from '../../types/physics';
import { drawGrid } from './canvasPrimitives';
import {
  renderCollision,
  renderIncline,
  renderProjectile,
  renderSpring,
  type TemplateRenderer,
} from './templates';

const renderers: Record<TemplateType, TemplateRenderer> = {
  projectile: renderProjectile,
  incline: renderIncline,
  spring: renderSpring,
  collision: renderCollision,
};

export function renderPhysicsScene(
  ctx: CanvasRenderingContext2D,
  model: PhysicsModel,
  size: { width: number; height: number },
  time: number,
) {
  ctx.clearRect(0, 0, size.width, size.height);
  drawGrid(ctx, size);
  renderers[model.templateType]({ ctx, model, size, time });
  drawOverlay(ctx, model, size, time);
}

function drawOverlay(
  ctx: CanvasRenderingContext2D,
  model: PhysicsModel,
  size: { width: number; height: number },
  time: number,
) {
  ctx.fillStyle = '#0f172a';
  ctx.font = '600 16px Inter, sans-serif';
  ctx.fillText(model.title, 24, 32);

  const activeNote = model.annotations.find((note) => Math.abs(note.time - time) < 0.7);
  if (!activeNote) return;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
  ctx.fillRect(24, size.height - 54, Math.min(size.width - 48, activeNote.text.length * 15 + 28), 34);
  ctx.fillStyle = '#ffffff';
  ctx.font = '14px Inter, sans-serif';
  ctx.fillText(activeNote.text, 38, size.height - 32);
}
