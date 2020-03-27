import { getSmallTextSize } from "./screens.js";

export function showHelp(canvasEl, ctx, width, height, text) {
  let _resolve;

  const clickHandler = e => {
    canvasEl.removeEventListener("click", clickHandler);
    _resolve();
  };

  ctx.save();

  const padding = width / 20;
  ctx.fillStyle = "#000000aa";
  ctx.fillRect(padding, padding, width - 2 * padding, height - 2 * padding);

  const lines = text.split("\n");
  const size = getSmallTextSize(width);
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillStyle = "white";
  ctx.font = `${size}px monospace`;

  let n = 0;
  for (let line of lines) {
    let fits = line.length;
    while (line) {
      if (ctx.measureText(line.slice(0, fits)).width <= width - padding * 4) {
        ctx.fillText(line.slice(0, fits), padding * 2, padding * 2 + size * 1.2 * n);
        line = line.slice(fits);
        n++;
      }

      fits--;
    }
  }

  ctx.textAlign = "center";
  ctx.fillText("(click anywhere to continue)", width / 2, padding * 2 + size * 1.2 * (n + 2));

  ctx.restore();

  return new Promise(resolve => {
    _resolve = resolve;
    canvasEl.addEventListener("click", clickHandler);
  });
}