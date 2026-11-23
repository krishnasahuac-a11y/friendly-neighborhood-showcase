import { webPaths } from "./web-paths";

type Props = { className?: string; spokes?: number; rings?: number; strokeWidth?: number };

export function WebGraphic({ className, spokes = 12, rings = 6, strokeWidth = 0.8 }: Props) {
  const { spokes: s, rings: r } = webPaths(spokes, rings);
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} aria-hidden>
      {s.map((d, i) => (
        <path key={`s${i}`} d={d} />
      ))}
      {r.map((d, i) => (
        <path key={`r${i}`} d={d} />
      ))}
    </svg>
  );
}

/** Quarter web anchored in a corner. */
export function CornerWeb({ className }: { className?: string }) {
  const lines = [0, 15, 30, 45, 60, 75, 90].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return `M0 0 L${(Math.cos(a) * 200).toFixed(1)} ${(Math.sin(a) * 200).toFixed(1)}`;
  });
  const arcs = [40, 75, 110, 145, 180].map((rr) => {
    let d = `M${rr} 0`;
    for (let deg = 15; deg <= 90; deg += 15) {
      const a = (deg * Math.PI) / 180;
      const m = ((deg - 7.5) * Math.PI) / 180;
      d += ` Q${(Math.cos(m) * rr * 0.9).toFixed(1)} ${(Math.sin(m) * rr * 0.9).toFixed(1)} ${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)}`;
    }
    return d;
  });
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" stroke="currentColor" strokeWidth={0.9} aria-hidden>
      {lines.map((d, i) => (
        <path key={`l${i}`} d={d} />
      ))}
      {arcs.map((d, i) => (
        <path key={`a${i}`} d={d} />
      ))}
    </svg>
  );
}
