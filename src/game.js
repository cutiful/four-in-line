import { fillField, drawBorders, highlightColumn } from "./field.js";
import { drawCircles, animateCircle, strikethroughCircles } from "./circles.js";
import { rows, columns } from "./config.js";
import { checkWinningCombinations, checkAvailableMoves } from "./rules.js";
import { drawWinnerScreen, drawText } from "./text.js";
import { hasHover } from "./window.js";

class FourInLine {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.circles = [];

    this.selectedColumn = 0;
    this.currentMove = 1;
    this.active = true;
    this.winner = { team: 0, first: [], last: [] };
    this.noMoves = false;

    this.listeners = [];

    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let i = 0; i < columns; i++) {
        row.push(0);
      }

      this.circles.push(row);
    }
  }

  reset() {
    this.currentMove = 1;
    this.active = true;
    this.winner = { team: 0, first: [], last: [] };
    this.noMoves = false;

    for (let i = 0, l = this.circles.length; i < l; i++) {
      this.circles.pop();
    }

    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let i = 0; i < columns; i++) {
        row.push(0);
      }

      this.circles.push(row);
    }
  }

  draw() {
    fillField(this.ctx, this.width, this.height);
    drawBorders(this.ctx, this.width, this.height);

    if (this.selectedColumn > 0 && hasHover())
      highlightColumn(this.ctx, this.width, this.height, this.selectedColumn);

    drawCircles(this.ctx, this.width, this.height, this.circles);

    if (this.winner.team) {
      strikethroughCircles(this.ctx, this.width, this.height, this.winner.first, this.winner.last);
      drawWinnerScreen(this.ctx, this.width, this.height, this.winner.team);
    }

    if (this.noMoves)
      drawText(this.ctx, this.width, this.height, "No moves left!", 32, "white", "black");
  }

  _clickHandler(e) {
    if (this.noMoves || this.winner.team) {
      this.reset.call(this);
      this.draw.call(this);
      this.active = true;
      return;
    }

    if (!this.active) return;

    const col = this.selectedColumn - 1;
    let row = -1;
    for (let i = this.circles.length - 1; i >= 0; i--) {
      if (this.circles[i][col]) continue;

      row = i;
      break;
    }

    if (row === -1) return;
    this.active = false;

    animateCircle(this.ctx, this.width, this.height, row, col, this.currentMove, this.draw.bind(this), () => {
      this.circles[row][col] = this.currentMove;
      this.currentMove = this.currentMove === 1 ? 2 : 1;
      const localWinner = checkWinningCombinations(this.circles);
      if (localWinner.team)
        this.winner = localWinner;
      else if (!checkAvailableMoves(this.circles))
        this.noMoves = true;
      else
        this.active = true;

      this.draw.call(this);
    });
  }

  _mousemoveHandler(e) {
    const column = Math.ceil(e.offsetX / (this.width / columns));
    if (column !== this.selectedColumn) {
      this.selectedColumn = column;
      if (!this.active) return;

      this.draw.call(this);
    }
  }

  _mouseleaveHandler(e) {
    this.selectedColumn = 0;
    if (!this.active) return;

    this.draw.call(this);
  }

  installHandlers(canvasEl) {
    const onclick = { on: "click", fn: this._clickHandler.bind(this) };
    const onmousemove = { on: "mousemove", fn: this._mousemoveHandler.bind(this) };
    const onmouseleave = { on: "mouseleave", fn: this._mouseleaveHandler.bind(this) };

    this.listeners.push(onclick);
    this.listeners.push(onmousemove);
    this.listeners.push(onmouseleave);

    canvasEl.addEventListener("click", onclick.fn);
    canvasEl.addEventListener("mousemove", onmousemove.fn);
    canvasEl.addEventListener("mouseleave", onmouseleave.fn);
  }

  removeHandlers(canvasEl) {
    for (const l of this.listeners) {
      canvasEl.removeEventListener(l.on, l.fn);
    }
  }
}

export default FourInLine;
