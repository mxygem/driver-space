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

// Connects waypoints with straight segments and rounds off each interior
// corner with a short quadratic curve — a "rounded rectangle" look, for
// freeways (like the Loop 101/202 system) that are mostly straight runs
// meeting at distinct turns rather than a continuously curving road.
export function roundedPolylineD(points, radius) {
  if (points.length < 2) {
    return points.map(({ x, y }, i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
  }

  const first = points[0];
  let d = `M${first.x},${first.y}`;

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];

    const v1x = curr.x - prev.x;
    const v1y = curr.y - prev.y;
    const v2x = next.x - curr.x;
    const v2y = next.y - curr.y;
    const len1 = Math.hypot(v1x, v1y) || 1;
    const len2 = Math.hypot(v2x, v2y) || 1;
    const r = Math.min(radius, len1 / 2, len2 / 2);

    const inX = curr.x - (v1x / len1) * r;
    const inY = curr.y - (v1y / len1) * r;
    const outX = curr.x + (v2x / len2) * r;
    const outY = curr.y + (v2y / len2) * r;

    d += ` L${inX},${inY} Q${curr.x},${curr.y} ${outX},${outY}`;
  }

  const last = points[points.length - 1];
  d += ` L${last.x},${last.y}`;
  return d;
}
