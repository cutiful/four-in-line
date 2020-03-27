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

    this.paused = false;

    this._circles = [];
    this._selectedColumn = 0;

    this._active = true;
    this._currentMove = 1;
    this._noMoves = false;
    this._winner = { team: 0, first: [], last: [] };

    this._listeners = [];
    this._animating = false;
    this._animationWaiters = [];

    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let i = 0; i < columns; i++) {
        row.push(0);
      }

      this._circles.push(row);
    }
  }

  reset() {
    this._active = true;
    this._currentMove = 1;
    this._noMoves = false;
    this._winner = { team: 0, first: [], last: [] };

    this.animating = false;

    for (let i = 0, l = this._circles.length; i < l; i++) {
      this._circles.pop();
    }

    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let i = 0; i < columns; i++) {
        row.push(0);
      }

      this._circles.push(row);
    }
  }

  draw() {
    fillField(this.ctx, this.width, this.height);
    drawBorders(this.ctx, this.width, this.height);

    if (!this.paused &&
      (this._active || this._animating) &&
      this._selectedColumn > 0
      && hasHover())
      highlightColumn(this.ctx, this.width, this.height, this._selectedColumn);

    drawCircles(this.ctx, this.width, this.height, this._circles);

    if (this._winner.team) {
      strikethroughCircles(this.ctx, this.width, this.height, this._winner.first, this._winner.last);
      drawWinnerScreen(this.ctx, this.width, this.height, this._winner.team);
    }

    if (this._noMoves)
      drawText(this.ctx, this.width, this.height, "No moves left!", 32, "white", "black");
  }

  _clickHandler(e) {
    if (this.paused) return;

    if (this._noMoves || this._winner.team) {
      this.reset.call(this);
      this.draw.call(this);
      this._active = true;
      return;
    }

    if (!this._active) return;

    const col = this._selectedColumn - 1;
    let row = -1;
    for (let i = this._circles.length - 1; i >= 0; i--) {
      if (this._circles[i][col]) continue;

      row = i;
      break;
    }

    if (row === -1) return;
    this._active = false;
    this.animating = true;

    animateCircle(this.ctx, this.width, this.height, row, col, this._currentMove, this.draw.bind(this), () => {
      this._circles[row][col] = this._currentMove;
      this._currentMove = this._currentMove === 1 ? 2 : 1;
      const localWinner = checkWinningCombinations(this._circles);
      if (localWinner.team)
        this._winner = localWinner;
      else if (!checkAvailableMoves(this._circles))
        this._noMoves = true;
      else
        this._active = true;

      this.animating = false;
      this.draw.call(this);
    });
  }

  _mousemoveHandler(e) {
    if (this.paused) return;

    const column = Math.ceil(e.offsetX / (this.width / columns));
    if (column !== this._selectedColumn) {
      this._selectedColumn = column;
      if (!this._active) return;

      this.draw.call(this);
    }
  }

  _mouseleaveHandler(e) {
    if (this.paused) return;

    this._selectedColumn = 0;
    if (!this._active) return;

    this.draw.call(this);
  }

  installHandlers(canvasEl) {
    const onclick = { on: "click", fn: this._clickHandler.bind(this) };
    const onmousemove = { on: "mousemove", fn: this._mousemoveHandler.bind(this) };
    const onmouseleave = { on: "mouseleave", fn: this._mouseleaveHandler.bind(this) };

    this._listeners.push(onclick);
    this._listeners.push(onmousemove);
    this._listeners.push(onmouseleave);

    canvasEl.addEventListener("click", onclick.fn);
    canvasEl.addEventListener("mousemove", onmousemove.fn);
    canvasEl.addEventListener("mouseleave", onmouseleave.fn);
  }

  removeHandlers(canvasEl) {
    for (const l of this._listeners) {
      canvasEl.removeEventListener(l.on, l.fn);
    }

    this._listeners = [];
  }

  get animating() {
    return this._animating;
  }

  set animating(val) {
    this._animating = val;

    if (!val) {
      for (const p of this._animationWaiters)
        p();

      this._animationWaiters = [];
    }
  }

  waitForAnimation() {
    if (!this.animating)
      return Promise.resolve();

    return new Promise(resolve => {
      this._animationWaiters.push(resolve);
    });
  }
}

export default FourInLine;
