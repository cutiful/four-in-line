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

export function getSmallerTextSize(width) {
  if (width >= 520) {
    return 15;
  } else if (width >= 450) {
    return 13;
  } else if (width >= 420) {
    return 12;
  } else if (width >= 320) {
    return 9;
  }

  return 6;
}
