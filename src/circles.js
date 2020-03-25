import { rows, columns, alphaColor1, alphaColor2, betaColor1, betaColor2, circleOffset } from "./config.js";

export function drawCircles(ctx, width, height, circles) {
  ctx.save();

  for (let row = 0; row < circles.length; row++) {
    for (let circle = 0; circle < circles[row].length; circle++) {
      if (!circles[row][circle]) continue;

      const x = width / columns * (circle + 0.5);
      const y = height / rows * (row + 0.5);
      const rad = width / columns / 2 - circleOffset;
      const grad = ctx.createRadialGradient(x - 5, y - 5, rad / 2.5, x, y, rad);

      if (circles[row][circle] === 1) {
        grad.addColorStop(0, alphaColor1);
        grad.addColorStop(1, alphaColor2);
      } else {
        grad.addColorStop(0, betaColor1);
        grad.addColorStop(1, betaColor2);
      }

      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.arc(x, y, rad, 0, 2 * Math.PI, false);
      ctx.fill();
    }
  }

  ctx.restore();
}
