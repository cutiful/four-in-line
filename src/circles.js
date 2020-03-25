import { rows, columns, alphaColor, betaColor, circleOffset } from "./config.js";

export function drawCircles(ctx, width, height, circles) {
  ctx.save();

  for (let row = 0; row < circles.length; row++) {
    for (let circle = 0; circle < circles[row].length; circle++) {
      if (!circles[row][circle]) continue;

      if (circles[row][circle] === 1)
        ctx.fillStyle = alphaColor;
      else
        ctx.fillStyle = betaColor;

      ctx.beginPath();
      ctx.arc(width / columns * (circle + 0.5), height / rows * (row + 0.5), width / columns / 2 - circleOffset, 0, 2 * Math.PI, false);
      ctx.fill();

      const oldCompositeOperation = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = "multiply";

      ctx.beginPath();
      ctx.arc(width / columns * (circle + 0.5), height / rows * (row + 0.5), width / columns / 2 - circleOffset - 4, 0, 2 * Math.PI, false);
      ctx.fill();

      ctx.globalCompositeOperation = oldCompositeOperation;
    }
  }

  ctx.restore();
}
