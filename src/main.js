import { fillField, drawBorders, highlightColumn } from "./field.js";
import { drawCircles, animateCircle, strikethroughCircles } from "./circles.js";
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
let selectedColumn = 0,
  currentMove = 1,
  active = true,
  winner = { team: 0, first: [], last: [] },
  noMoves = false;

const reset = () => {
  currentMove = 1;
  active = true;
  winner = { team: 0, first: [], last: [] };
  noMoves = false;

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

  if (winner.team) {
    strikethroughCircles(ctx, width, height, winner.first, winner.last);
    drawWinnerScreen(ctx, width, height, winner.team);
  }

  if (noMoves)
    drawText(ctx, width, height, "No moves left!", 32, "white", "black");
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
  if (noMoves || winner.team) {
    reset();
    draw();
    active = true;
    return;
  }

  if (!active) return;

  const col = selectedColumn - 1;
  let row = -1;
  for (let i = circles.length - 1; i >= 0; i--) {
    if (circles[i][col]) continue;

    row = i;
    break;
  }

  if (row === -1) return;
  active = false;

  animateCircle(ctx, width, height, row, col, currentMove, draw, () => {
    circles[row][col] = currentMove;
    currentMove = currentMove === 1 ? 2 : 1;
    const localWinner = checkWinningCombinations(circles);
    if (localWinner.team)
      winner = localWinner;
    else if (!checkAvailableMoves(circles))
      noMoves = true;
    else
      active = true;

    draw();
  });
});

reset();
draw();
