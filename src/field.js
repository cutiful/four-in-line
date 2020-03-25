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
