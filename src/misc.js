export function copyCircles(circles) {
  const newCircles = [];
  for (const row of circles)
    newCircles.push(row.slice());

  return newCircles;
}
