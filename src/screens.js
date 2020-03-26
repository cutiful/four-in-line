export function getLargeTextSize(width) {
  if (width >= 420) {
    return 48;
  } else if (width >= 320) {
    return 32;
  }

  return 24;
}
