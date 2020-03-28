import { rows, columns, alphaColor1, alphaColor2, betaColor1, betaColor2, circleOffset } from "./config.js";
import { getSmallerTextSize } from "./screens.js";

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

export function drawCircle(ctx, width, height, x, y, team) {
  ctx.save();

  const rad = width / columns / 2 - circleOffset;
  const grad = ctx.createRadialGradient(x - 5, y - 5, rad / 2.5, x, y, rad);

  if (team === 1) {
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

  ctx.restore();
}

export function animateCircle(ctx, width, height, row, column, team, draw) {
  let ts = 0,
    y = 0,
    done = false;

  const x = width / columns * (column + 0.5),
    targetY = height / rows * (row + 0.5),
    speed = height * 3;

  return new Promise(resolve => {
    const func = time => {
      let diff;

      if (ts === 0) {
        diff = 0;
        ts = time;
      } else {
        diff = time - ts;
        ts = time;
      }

      y += diff / 1000 * speed;
      if (y >= targetY) {
        y = targetY;
        done = true;
      }

      draw();
      drawCircle(ctx, width, height, x, y, team);

      if (!done)
        requestAnimationFrame(func);
      else
        resolve();
    };

    requestAnimationFrame(func);
  });
}

export function strikethroughCircles(ctx, width, height, first, last) {
  ctx.save();

  const x1 = width / columns * (first[1] + 0.5),
    y1 = height / rows * (first[0] + 0.5),
    x2 = width / columns * (last[1] + 0.5),
    y2 = height / rows * (last[0] + 0.5);

  ctx.lineWidth = 4;
  ctx.strokeStyle = alphaColor2;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();

  ctx.restore();
}

export function drawCurrentTurn(ctx, width, height, team) {
  ctx.save();

  const size = getSmallerTextSize(width);
  ctx.fillStyle = "#222";
  ctx.font = `${size}px monospace`;
  ctx.textBaseline = "top";
  ctx.textAlign = "left";

  const tw = ctx.measureText("Current turn: ", 0, 0).width;
  ctx.fillText("Current turn: ", 4, 4);

  ctx.fillStyle = team === 1 ? alphaColor2 : betaColor2;

  ctx.beginPath();
  ctx.arc(tw + size / 2, size / 2 + 4, size / 2, 0, Math.PI * 2, false);
  ctx.fill();

  ctx.restore();
}
