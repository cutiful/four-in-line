import { getSmallTextSize } from "./screens.js";
import { hasHover } from "./window.js";

class Menu {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.containerWidth = width;
    this.containerHeight = height;

    this._active = false;

    this._options = [];
    this._beforeRedraw = null;

    this._renderedOptions = [];
    this._selectedOption = -1;
    this._listeners = [];
  }

  addOption(text, callback) {
    this._options.push({ text, callback });
    this._prepare();
  }

  addOptions(options) {
    for (const opt of options) {
      this.addOption(opt.text, opt.callback);
    }
  }

  _prepare() {
    const textSize = getSmallTextSize(this.containerWidth);

    this.ctx.save();

    this.ctx.font = `${textSize}px monospace`;
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";

    const longest = this._options.reduce((a, b) => a.text.length > b.text.length ? a : b);
    const maxTextWidth = this.ctx.measureText(longest.text, this.containerWidth / 2, this.containerHeight / 2).width;
    const buttonWidth = maxTextWidth * 1.4;
    const buttonHeight = textSize * 2.4;
    const space = this.containerHeight / this._options.length;

    if (space < buttonHeight * 1.2) {
      this.ctx.restore();
      throw new Error("Too many options don't fit in container");
    }

    this._renderedOptions = [];

    for (let i = 0; i < this._options.length; i++)
      this._renderedOptions.push({
        button: {
          x: this.containerWidth / 2 - buttonWidth / 2,
          y: space * (i + 0.5) - buttonHeight / 2,
          width: buttonWidth,
          height: buttonHeight
        },
        label: {
          text: this._options[i].text,
          size: textSize,
          x: this.containerWidth / 2,
          y: space * (i + 0.5)
        },
        callback: this._options[i].callback
      });

    this.ctx.restore();
  }

  _draw() {
    if (this._beforeRedraw)
      this._beforeRedraw();
    else
      this.ctx.clearRect(0, 0, this.containerWidth, this.containerHeight);

    this.ctx.save();

    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";

    for (let i = 0; i < this._renderedOptions.length; i++) {
      const opt = this._renderedOptions[i];

      this.ctx.fillStyle = !hasHover() || i !== this._selectedOption ? "#0f1743" : "#1f295d";
      this.ctx.fillRect(opt.button.x, opt.button.y, opt.button.width, opt.button.height);

      this.ctx.fillStyle = "white";
      this.ctx.font = `${opt.label.size}px monospace`;
      this.ctx.fillText(opt.label.text, opt.label.x, opt.label.y);
    }

    this.ctx.restore();
  }

  set onBeforeRedraw(fn) {
    this._beforeRedraw = fn;
  }

  _clickHandler(e) {
    if (this._selectedOption !== -1)
      this._renderedOptions[this._selectedOption].callback();
  }

  _mousemoveHandler(e) {
    let selected = -1;
    for (let i = 0; i < this._renderedOptions.length; i++) {
      const opt = this._renderedOptions[i];
      if (e.offsetX >= opt.button.x &&
        e.offsetX <= opt.button.x + opt.button.width &&
        e.offsetY >= opt.button.y &&
        e.offsetY <= opt.button.y + opt.button.height) {
        selected = i;
        break;
      }
    }

    if (this._selectedOption !== selected) {
      this._selectedOption = selected;
      this._draw.call(this);
    }
  }

  _installHandlers() {
    const onclick = { on: "click", fn: this._clickHandler.bind(this) };
    const onmousemove = { on: "mousemove", fn: this._mousemoveHandler.bind(this) };

    this._listeners.push(onclick);
    this._listeners.push(onmousemove);

    this.ctx.canvas.addEventListener("click", onclick.fn);
    this.ctx.canvas.addEventListener("mousemove", onmousemove.fn);
  }

  _removeHandlers() {
    for (const l of this._listeners) {
      this.ctx.canvas.removeEventListener(l.on, l.fn);
    }

    this._listeners = [];
  }

  get active() {
    return this._active;
  }

  activate() {
    this._installHandlers();
    this._draw();
    this._active = true;
  }

  deactivate() {
    this._removeHandlers();
    this._active = false;
  }
}

export default Menu;
