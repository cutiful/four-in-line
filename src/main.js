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
  drawCircles(ctx, width, height, [[1, 0, 1, 1, 0, 0], [0, 1, 0, 2, 1, 2]]);

  if (selectedColumn > 0) {
    highlightColumn(ctx, width, height, selectedColumn);
  }
};

draw();

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
