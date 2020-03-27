import { fillField, drawBorders, highlightColumn } from "./field.js";
import { drawCircles, animateCircle } from "./circles.js";
import { rows, columns } from "./config.js";
import { checkWinningCombinations, checkAvailableMoves } from "./rules.js";
import { drawWinnerScreen, drawText } from "./text.js";

const canvasEl = document.getElementById("game"),
  containerEl = document.getElementsByClassName("subcontainer")[0],
  ctx = canvasEl.getContext("2d"),
  dpr = window.devicePixelRatio || 1;

const hasHover = !("ontouchstart" in document.documentElement ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0);

let width = containerEl.clientWidth,
  height = width / columns * rows; // containerEl.clientHeight;
canvasEl.width = width * dpr;
canvasEl.height = height * dpr;

if (dpr !== 1) {
  canvasEl.style.width = width + "px";
  canvasEl.style.height = height + "px";
  ctx.scale(dpr, dpr);
}

const circles = [];
let selectedColumn = 0;
let currentMove = 1;
let active = true;

const reset = () => {
  currentMove = 1;
  active = true;

  for (let i = 0, l = circles.length; i < l; i++) {
    circles.pop();
  }

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let i = 0; i < columns; i++) {
      row.push(0);
    }

    circles.push(row);
  }
};

const draw = () => {
  fillField(ctx, width, height);
  drawBorders(ctx, width, height);

  if (selectedColumn > 0 && hasHover)
    highlightColumn(ctx, width, height, selectedColumn);

  drawCircles(ctx, width, height, circles);
};

const win = team => {
  drawWinnerScreen(ctx, width, height, team);

  const clickListener = e => {
    canvasEl.removeEventListener("click", clickListener);

    reset();
    draw();
    active = true;
  };

  canvasEl.addEventListener("click", clickListener);
};

const noMoves = () => {
  drawText(ctx, width, height, "No moves left!", 32, "white", "black");

  const clickListener = e => {
    canvasEl.removeEventListener("click", clickListener);

    reset();
    draw();
    active = true;
  };

  canvasEl.addEventListener("click", clickListener);
};

canvasEl.addEventListener("mousemove", e => {
  const column = Math.ceil(e.offsetX / (width / columns));
  if (column !== selectedColumn) {
    selectedColumn = column;
    if (!active) return;

    draw();
  }
});

canvasEl.addEventListener("mouseleave", e => {
  selectedColumn = 0;
  if (!active) return;

  draw();
});

canvasEl.addEventListener("click", e => {
  if (!active) return;

  const col = selectedColumn - 1;
  for (let i = circles.length - 1; i >= 0; i--) {
    if (circles[i][col]) continue;

    active = false;
    animateCircle(ctx, width, height, i, col, currentMove, draw, () => {
      circles[i][col] = currentMove;
      currentMove = currentMove === 1 ? 2 : 1;
      draw();

      const wins = checkWinningCombinations(circles);
      if (wins)
        win(wins);
      else if (!checkAvailableMoves(circles))
        noMoves();
      else
        active = true;
    });

    break;
  }
});

reset();
draw();
