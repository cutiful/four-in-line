export function getLargeTextSize(width) {
  if (width >= 420) {
    return 48;
  } else if (width >= 320) {
    return 32;
  }

  return 24;
}

export function getSmallTextSize(width) {
  if (width >= 420) {
    return 24;
  } else if (width >= 320) {
    return 20;
  }

  return 16;
}
