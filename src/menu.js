import { getSmallTextSize } from "./screens.js";

class Menu {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.containerWidth = width;
    this.containerHeight = height;

    this._options = [];
    this._beforeRedraw = null;

    this._renderedOptions = [];
  }

  addOption(text, callback) {
    this._options.push({ text, callback });
    this._prepare.call(this);
  }

  addOptions(options) {
    for (const opt of options) {
      this.addOption.call(this, opt.text, opt.callback);
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

    if (space < buttonHeight * 1.5) {
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

  draw() {
    if (this._beforeRedraw) this._beforeRedraw();
    this.ctx.save();

    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";

    for (const opt of this._renderedOptions) {
      this.ctx.fillStyle = "black";
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
}

export default Menu;
