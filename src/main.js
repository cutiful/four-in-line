import { drawBorders } from "./field.js";
import { drawCircles } from "./circles.js";
import { rows, columns } from "./config.js";

const canvasEl = document.getElementById("game"),
  containerEl = document.getElementsByClassName("subcontainer")[0],
  ctx = canvasEl.getContext("2d"); 

let width = containerEl.clientWidth,
  height = width / columns * rows; // containerEl.clientHeight;
canvasEl.width = width;
canvasEl.height = height;

ctx.save();
ctx.fillStyle = "#ddebff";
ctx.fillRect(0, 0, width, height);
ctx.restore();

drawBorders(ctx, width, height);
drawCircles(ctx, width, height, [[1, 0, 1, 1, 0, 0], [0, 1, 0, 2, 1, 2]]);
