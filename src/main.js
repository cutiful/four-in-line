import { rows, columns } from "./config.js";
import { showHelp } from "./help.js";
import { rulesText, creditsText } from "./texts.js";
import { getSmallerTextSize } from "./screens.js";
import Menu from "./menu.js";
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

let installedSw = false;

const game = new FourInLine(ctx, width, height);
game.paused = true;
game.installHandlers();

const menu = new Menu(ctx, width, height);
menu.addOptions([
  {
    text: "Play!",
    callback: () => {
      menu.active = false;
      game.paused = false;
      game.draw();
    }
  },
  {
    text: "Rules",
    callback: () => {
      menu.active = false;
      showHelp(canvasEl, ctx, width, height, rulesText, getSmallerTextSize(width))
        .then(() => {
          menu.active = true;
          menu.draw();
        });
    }
  },
  {
    text: "Credits",
    callback: () => {
      menu.active = false;
      showHelp(canvasEl, ctx, width, height, creditsText, getSmallerTextSize(width))
        .then(() => {
          menu.active = true;
          menu.draw();
        });
    }
  },
  {
    text: "Save for offline",
    callback: () => {
      menu.active = false;

      const cb = () => {
        menu.active = true;
        menu.draw();
      };

      if (!('serviceWorker' in navigator)) {
        showHelp(canvasEl,
          ctx, width, height,
          "Sorry, your browser doesn't support service workers!",
          getSmallerTextSize(width))
          .then(cb);

        return;
      }

      if (installedSw || navigator.serviceWorker.controller) {
        showHelp(canvasEl,
          ctx, width, height,
          "You have already registered a service worker before. The game should work even if your internet cable is unplugged!",
          getSmallerTextSize(width))
          .then(cb);

        return;
      }

      navigator.serviceWorker.register("sw.js")
        .then(registration => {
          installedSw = true;
          showHelp(canvasEl,
            ctx, width, height,
            "Successfully installed a service worker! Now the game should work even if your internet cable is unplugged!",
            getSmallerTextSize(width))
            .then(cb);
        })
        .catch(e => {
          showHelp(canvasEl,
            ctx, width, height,
            "Sorry, something went wrong! " + e.toString(),
            getSmallerTextSize(width))
            .then(cb);
        });
    }
  }
]);

menu.onBeforeRedraw = game.draw.bind(game);
menu.installHandlers();
menu.draw();

document.addEventListener("keyup", e => {
  if (e.key == "Escape") {
    if (game.paused && menu.active) {
      menu.active = false;
      game.paused = false;
      game.draw();
    } else if (!game.paused) {
      game.waitForAnimation().then(() => {
        game.paused = true;
        menu.active = true;
        menu.draw();
      });
    }
  }
});
