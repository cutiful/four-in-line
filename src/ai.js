import { calculateBestMove } from "./minimax.js";

let level = 4;

onmessage = e => {
  if (e.data.length < 2)
    return;

  switch (e.data[0]) {
    case "move":
      postMessage(["move", calculateBestMove(e.data[1], level)]);
      break;

    case "setLevel":
      if (typeof e.data[1] !== "Number" || e.data[1] < 4 || e.data[1] > 8) {
        postMessage(["error", "AI level should be in the range of 3 to 7"]);
        break;
      }

      level = e.data[1];
      break;
  }
};
