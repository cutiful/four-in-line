import { rows, columns } from "./config.js";
import FourInLine from "./game.js";

const canvasEl = document.getElementById("game"),
  containerEl = document.getElementsByClassName("subcontainer")[0],
  ctx = canvasEl.getContext("2d"),
  dpr = window.devicePixelRatio || 1;

let width = containerEl.clientWidth,
  height = width / columns * rows; // containerEl.clientHeight;
canvasEl.width = width * dpr;
canvasEl.height = height * dpr;

if (dpr !== 1) {
  canvasEl.style.width = width + "px";
  canvasEl.style.height = height + "px";
  ctx.scale(dpr, dpr);
}

const game = new FourInLine(ctx, width, height);
game.installHandlers(canvasEl);
game.draw();
