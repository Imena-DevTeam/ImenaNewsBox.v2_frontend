/**
 * SVG path for a scalloped "verified" badge — the rosette social platforms put
 * next to verified accounts. Rounded lobes come from |cos|, which peaks
 * smoothly and dips to a crisp valley between lobes.
 *
 * `size` is the edge of the square the badge fills, so `badgePath(1)` suits a
 * `clipPathUnits="objectBoundingBox"` clip and `badgePath(100)` a 0–100 viewBox.
 */
export function badgePath(size = 1, lobes = 10, depth = 0.08, steps = 360) {
  const center = size / 2;
  const points: string[] = [];

  for (let step = 0; step < steps; step++) {
    const angle = (step / steps) * Math.PI * 2;
    const lobe = Math.abs(Math.cos((lobes * angle) / 2));
    const radius = center * (1 - depth + depth * lobe);
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    points.push(`${x.toFixed(4)} ${y.toFixed(4)}`);
  }

  return `M${points.join("L")}Z`;
}
