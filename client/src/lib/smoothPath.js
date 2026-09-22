// Turns a sparse list of waypoints into a smooth curve (Catmull-Rom spline,
// converted to cubic Beziers) instead of the straight-segment jagged look
// you get from connecting hand-placed waypoints with a polyline.
export function smoothPathD(points) {
  if (points.length === 0) return '';
  if (points.length < 3) {
    return points.map(({ x, y }, i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
  }

  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}
