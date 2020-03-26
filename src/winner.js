import { alphaColor2, betaColor2 } from "./config.js";
import { getLargeTextSize } from "./screens.js";

export function drawWinnerScreen(ctx, width, height, team) {
  drawText(ctx, width, height, `Team ${team} wins!`, getLargeTextSize(width), "white", team === 1 ? alphaColor2 : betaColor2);
}

export function drawText(ctx, width, height, text, size, color, background) {
  ctx.save();

  ctx.font = `${size}px monospace`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  ctx.shadowBlur = 4;
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";

  const t = ctx.measureText(text, width / 2, height / 2);
  ctx.fillStyle = background;
  ctx.fillRect(width / 2 - t.width / 2 - 10, height / 2 - size / 2 - 10, t.width + 20, size + 20);

  ctx.shadowBlur = 2;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  ctx.fillStyle = color;
  ctx.fillText(text, width / 2, height / 2);

  ctx.restore();
}
