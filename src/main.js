import { rows, columns, drawBorders } from "./field.js";

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
