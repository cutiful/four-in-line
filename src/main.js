import { fillField, drawBorders, highlightColumn } from "./field.js";
import { drawCircles } from "./circles.js";
import { rows, columns } from "./config.js";

const canvasEl = document.getElementById("game"),
  containerEl = document.getElementsByClassName("subcontainer")[0],
  ctx = canvasEl.getContext("2d"); 

let width = containerEl.clientWidth,
  height = width / columns * rows; // containerEl.clientHeight;
canvasEl.width = width;
canvasEl.height = height;

const circles = [];
let selectedColumn = 0;
let currentMove = 1;
let active = true;

for (let i = 0; i < rows; i++) {
  const row = [];
  for (let i = 0; i < columns; i++) {
    row.push(0);
  }

  circles.push(row);
}

const draw = () => {
  fillField(ctx, width, height);
  drawBorders(ctx, width, height);

  if (selectedColumn > 0)
    highlightColumn(ctx, width, height, selectedColumn);

  drawCircles(ctx, width, height, circles);
};

canvasEl.addEventListener("mousemove", e => {
  const column = Math.ceil(e.offsetX / (width / columns));
  if (column !== selectedColumn) {
    selectedColumn = column;
    draw();
  }
});

canvasEl.addEventListener("mouseleave", e => {
  selectedColumn = 0;
  draw();
});

canvasEl.addEventListener("click", e => {
  if (!active) return;

  for (let i = circles.length - 1; i >= 0; i--) {
    if (circles[i][selectedColumn - 1]) continue;

    circles[i][selectedColumn - 1] = currentMove;
    currentMove = currentMove === 1 ? 2 : 1;
    break;
  }

  draw();
});

draw();
