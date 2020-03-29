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

let installedSw = false,
  initializedGame = false;

const game = new FourInLine(ctx, width, height);
game.paused = true;
game.installHandlers();

const loadAi = level => {
  const aiWorker = new Worker("./ai.js");
  aiWorker.postMessage(["setLevel", level]);

  game.setExternalPlayer(2, (circles) => {
    return new Promise(resolve => {
      const listener = e => {
        if (e.data[0] !== "move")
          return;

        aiWorker.removeEventListener("message", listener);
        resolve(e.data[1]);
      };

      aiWorker.addEventListener("message", listener);
      aiWorker.postMessage(["move", circles]);
    });
  });
}

const aiLevelMenu = new Menu(ctx, width, height);
aiLevelMenu.addOptions([
  {
    text: "Easy",
    callback: () => {
      loadAi(4);
      aiLevelMenu.deactivate();
      initializedGame = true;
      game.paused = false;
      game.draw();
    }
  },
  {
    text: "Medium",
    callback: () => {
      loadAi(6);
      aiLevelMenu.deactivate();
      initializedGame = true;
      game.paused = false;
      game.draw();
    }
  },
  {
    text: "Hard",
    callback: () => {
      loadAi(8);
      aiLevelMenu.deactivate();
      initializedGame = true;
      game.paused = false;
      game.draw();
    }
  }
]);

aiLevelMenu.onBeforeRedraw = game.draw.bind(game);

const vsMenu = new Menu(ctx, width, height);
vsMenu.addOptions([
  {
    text: "2 Players",
    callback: () => {
      vsMenu.deactivate();
      initializedGame = true;
      game.paused = false;
      game.draw();
    }
  },
  {
    text: "Player vs Computer",
    callback: () => {
      vsMenu.deactivate();
      aiLevelMenu.activate();
    }
  }
]);

vsMenu.onBeforeRedraw = game.draw.bind(game);

const menu = new Menu(ctx, width, height);
menu.addOptions([
  {
    text: "Play!",
    callback: () => {
      if (!initializedGame) {
        menu.deactivate();
        vsMenu.activate();
        return;
      }

      menu.deactivate();
      game.paused = false;
      game.draw();
    }
  },
  {
    text: "Rules",
    callback: () => {
      menu.deactivate();
      showHelp(canvasEl, ctx, width, height, rulesText, getSmallerTextSize(width))
        .then(() => menu.activate());
    }
  },
  {
    text: "Credits",
    callback: () => {
      menu.deactivate();
      showHelp(canvasEl, ctx, width, height, creditsText, getSmallerTextSize(width))
        .then(() => menu.activate());
    }
  },
  {
    text: "Save for offline",
    callback: () => {
      menu.deactivate();

      const cb = () => menu.activate();

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
menu.activate();

document.addEventListener("keyup", e => {
  if (e.key == "Escape") {
    if (!initializedGame) return;

    if (game.paused && menu.active) {
      menu.deactivate();
      game.paused = false;
      game.draw();
    } else if (!game.paused) {
      game.waitForAnimation().then(() => {
        game.paused = true;
        menu.activate();
      });
    }
  }
});
