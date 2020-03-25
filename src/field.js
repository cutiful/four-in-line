import { rows, columns } from "./config.js";

export function fillField(ctx, width, height) {
  ctx.save();

  ctx.fillStyle = "#ddebff";
  ctx.fillRect(0, 0, width, height);

  ctx.restore();
}

export function drawBorders(ctx, width, height) {
  ctx.save();

  for (let i = 1; i < columns; i++) {
    ctx.beginPath();
    ctx.moveTo(width / columns * i, 0);
    ctx.lineTo(width / columns * i, height);
    ctx.stroke();
  }

  for (let i = 1; i < rows; i++) {
    ctx.beginPath();
    ctx.moveTo(0, height / rows * i);
    ctx.lineTo(width, height / rows * i);
    ctx.stroke();
  }

  ctx.restore();
}

export function highlightColumn(ctx, width, height, column) {
  ctx.save();

  const x = width / columns * (column - 1);
  const y = 0;
  const w = width / columns;
  const h = height;

  const grad = ctx.createLinearGradient(x, 0, x + w, 0);
  grad.addColorStop(0, "rgba(255, 255, 255, 0.5)");
  grad.addColorStop(0.4, "rgba(255, 255, 255, 0)");
  grad.addColorStop(0.6, "rgba(255, 255, 255, 0)");
  grad.addColorStop(1, "rgba(255, 255, 255, 0.5)");

  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);

  ctx.restore();
}
