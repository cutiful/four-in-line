import { rows, columns } from "./config.js";

export function checkWinningCombinations(circles) {
  // horizontal
  for (let row = 0; row < rows; row++) {
    let streak = 0;
    let team = 0;

    for (let column = 0; column < columns; column++) {
      if (circles[row][column] !== team) {
        streak = 1;
        team = circles[row][column];
      } else if (team != 0) {
        streak++;
      }

      if (streak >= 4)
        return team;
    }
  }

  // vertical
  for (let column = 0; column < columns; column++) {
    let streak = 0;
    let team = 0;

    for (let row = 0; row < rows; row++) {
      if (circles[row][column] !== team) {
        streak = 1;
        team = circles[row][column];
      } else if (team != 0) {
        streak++;
      }

      if (streak >= 4)
        return team;
    }
  }

  // diagonal to the top-right
  for (let y = 0; y < rows; y++) {
    let streak = 0;
    let team = 0;

    // console.log("First pass");
    for (let offset = 0; offset <= y && offset <= columns; offset++) {
      // console.log(y-offset, offset);

      if (circles[y-offset][offset] !== team) {
        streak = 1;
        team = circles[y-offset][offset];
      } else if (team != 0) {
        streak++;
      }

      if (streak >= 4)
        return team;
    }

    streak = 0;
    team = 0;

    // console.log("Second pass");
    for (let offset = 0; offset <= (rows - 1 - y) && offset <= columns; offset++) {
      // console.log(y+offset, columns-1-offset);

      if (circles[y+offset][columns-1-offset] !== team) {
        streak = 1;
        team = circles[y+offset][columns-1-offset];
      } else if (team != 0) {
        streak++;
      }

      if (streak >= 4)
        return team;
    }
  }

  // diagonal to the bottom-right
  for (let y = 0; y < rows; y++) {
    let streak = 0;
    let team = 0;
  
    // console.log("Third pass");
    for (let offset = 0; offset <= y && offset <= columns; offset++) {
      // console.log(y-offset, columns-1-offset);

      if (circles[y-offset][columns-1-offset] !== team) {
        streak = 1;
        team = circles[y-offset][columns-1-offset];
      } else if (team != 0) {
        streak++;
      }
  
      if (streak >= 4)
        return team;
    }

    streak = 0;
    team = 0;

    // console.log("Fourth pass");
    for (let offset = 0; offset <= (rows - 1 - y) && offset <= columns; offset++) {
      // console.log(y+offset, offset);

      if (circles[y+offset][offset] !== team) {
        streak = 1;
        team = circles[y+offset][offset];
      } else if (team != 0) {
        streak++;
      }

      if (streak >= 4)
        return team;
    }
  }

  return 0;
}

export function checkAvailableMoves(circles) {
  for (let i = 0; i < circles.length; i++) {
    for (let j = 0; j < circles[i].length; j++) {
      if (circles[i][j] === 0)
        return true;
    }
  }

  return false;
}
