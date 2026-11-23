/** Builds SVG path data for an original radial spider-web graphic (viewBox 0 0 200 200). */
export function webPaths(spokes = 12, rings = 6, r = 95, cx = 100, cy = 100) {
  const angles = Array.from({ length: spokes }, (_, i) => (i / spokes) * Math.PI * 2 - Math.PI / 2);
  const pt = (a: number, rr: number) => `${(cx + Math.cos(a) * rr).toFixed(2)} ${(cy + Math.sin(a) * rr).toFixed(2)}`;
  const spokePaths = angles.map((a) => `M${cx} ${cy} L${pt(a, r)}`);
  const ringPaths = Array.from({ length: rings }, (_, k) => {
    const rr = (r * (k + 1)) / rings;
    let d = `M${pt(angles[0] ?? 0, rr)}`;
    angles.forEach((a, i) => {
      const next = angles[(i + 1) % spokes] ?? 0;
      const end = i === spokes - 1 ? next + Math.PI * 2 : next;
      const mid = (a + end) / 2;
      d += ` Q${pt(mid, rr * 0.86)} ${pt(next, rr)}`;
    });
    return d;
  });
  return { spokes: spokePaths, rings: ringPaths };
}
