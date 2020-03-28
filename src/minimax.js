import { rows, columns } from "./config.js";
import { checkWinningCombinations, checkAvailableMoves } from "./rules.js";
import { copyCircles } from "./misc.js";

const aiTeam = 2,
  playerTeam = 1;

export function calculateBestMove(circles, depth) {
  const availableMoves = getAvailableMoves(circles);
  const values = [];
  for (const col of availableMoves) {
    const newCircles = makeMove(circles, col, aiTeam);
    const moveValue = alphabeta(newCircles, depth, -Infinity, Infinity, false);
    values.push([col, moveValue]);
  }

  return values.sort((a, b) => a[1] === b[1] ? 0 : a[1] > b[1] ? -1 : 1)[0][0];
}

function alphabeta(circles, depth, a, b, ourMove) {
  let alpha = a, beta = b;

  const winner = checkWinningCombinations(circles);
  if (winner.team !== 0) { // terminal node
    if (winner.team === aiTeam)
      return 10000000000000;
    else
      return -10000000000000;
  } else if (!checkAvailableMoves(circles)) { // terminal node
    return 0;
  } else if (depth === 0) {
    return evaluatePositions(circles)[aiTeam];
  }

  const availableMoves = getAvailableMoves(circles);
  if (ourMove) {
    let value = -10000000000000;
    for (const col of availableMoves) {
      const newCircles = makeMove(circles, col, aiTeam);
      const moveValue = alphabeta(newCircles, depth - 1, alpha, beta, false);
      value = moveValue > value ? moveValue : value;

      alpha = value > alpha ? value : alpha;
      if (alpha >= beta)
        break;
    }

    return value;
  } else {
    let value = 10000000000000;
    for (const col of availableMoves) {
      const newCircles = makeMove(circles, col, playerTeam);
      const moveValue = alphabeta(newCircles, depth - 1, alpha, beta, true);
      value = moveValue < value ? moveValue : value;
      beta = value < beta ? value : beta;
      if (alpha >= beta)
        break;
    }

    return value;
  }
}

function getAvailableMoves(circles) {
  const cols = [];
  for (let i = 0; i < circles[0].length; i++) {
    if (!circles[0][i])
      cols.push(i);
  }

  return cols;
}

function makeMove(circles, column, team) {
  const newCircles = copyCircles(circles);
  for (let i = circles.length - 1; i >= 0; i--) {
    if (newCircles[i][column]) continue;

    newCircles[i][column] = team;
    return newCircles;
  }
}

function evaluatePositions(circles) {
  const scores = {
    1: 0,
    2: 0
  };

  // horizontal
  for (let row = 0; row < rows; row++) {
    let streak = 0;
    let team = 0;

    for (let column = 0; column < columns; column++) {
      if (circles[row][column] !== team) {
        scores[team] += streak * streak;

        streak = 1;
        team = circles[row][column];
      } else if (team != 0) {
        streak++;
      }
    }
  }

  // vertical
  for (let column = 0; column < columns; column++) {
    let streak = 0;
    let team = 0;

    for (let row = 0; row < rows; row++) {
      if (circles[row][column] !== team) {
        scores[team] += streak * streak;

        streak = 1;
        team = circles[row][column];
      } else if (team != 0) {
        streak++;
      }
    }
  }

  // diagonal to the top-right
  for (let y = 0; y < rows; y++) {
    let streak = 0;
    let team = 0;

    for (let offset = 0; offset <= y && offset <= columns; offset++) {
      if (circles[y-offset][offset] !== team) {
        scores[team] += streak * streak;

        streak = 1;
        team = circles[y-offset][offset];
      } else if (team != 0) {
        streak++;
      }
    }

    streak = 0;
    team = 0;

    for (let offset = 0; offset <= (rows - 1 - y) && offset <= columns; offset++) {
      if (circles[y+offset][columns-1-offset] !== team) {
        scores[team] += streak * streak;

        streak = 1;
        team = circles[y+offset][columns-1-offset];
      } else if (team != 0) {
        streak++;
      }
    }
  }

  // diagonal to the bottom-right
  for (let y = 0; y < rows; y++) {
    let streak = 0;
    let team = 0;
  
    for (let offset = 0; offset <= y && offset <= columns; offset++) {
      if (circles[y-offset][columns-1-offset] !== team) {
        scores[team] += streak * streak;

        streak = 1;
        team = circles[y-offset][columns-1-offset];
      } else if (team != 0) {
        streak++;
      }
    }

    streak = 0;
    team = 0;

    for (let offset = 0; offset <= (rows - 1 - y) && offset <= columns; offset++) {
      if (circles[y+offset][offset] !== team) {
        scores[team] += streak * streak;

        streak = 1;
        team = circles[y+offset][offset];
      } else if (team != 0) {
        streak++;
      }
    }
  }

  return scores;
}
