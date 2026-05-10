export interface CanvasSize {
  width: number;
  height: number;
}

export function drawArrow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dx: number,
  dy: number,
  label: string,
) {
  const endX = x + dx;
  const endY = y + dy;
  const angle = Math.atan2(dy, dx);

  ctx.strokeStyle = '#e11d48';
  ctx.fillStyle = '#e11d48';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(endX - 8 * Math.cos(angle - Math.PI / 6), endY - 8 * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(endX - 8 * Math.cos(angle + Math.PI / 6), endY - 8 * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
  ctx.font = '13px Inter, sans-serif';
  ctx.fillText(label, endX + 6, endY - 6);
}

export function drawGround(ctx: CanvasRenderingContext2D, width: number, y: number) {
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(36, y);
  ctx.lineTo(width - 36, y);
  ctx.stroke();
}

export function drawGrid(ctx: CanvasRenderingContext2D, size: CanvasSize) {
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, size.width, size.height);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;

  for (let x = 0; x < size.width; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size.height);
    ctx.stroke();
  }

  for (let y = 0; y < size.height; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size.width, y);
    ctx.stroke();
  }
}
