import { motion } from "framer-motion";
import { useState } from "react";
import { SKILLS } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";
import { webPaths } from "./web-paths";

const { spokes, rings } = webPaths(12, 6, 95);
const NODE_R = [62, 80, 70, 85, 66, 76];

export function SkillWeb() {
  const [active, setActive] = useState<number | null>(null);
  const current = SKILLS[active ?? 0];

  const nodes = SKILLS.map((s, i) => {
    const a = (i / SKILLS.length) * Math.PI * 2 - Math.PI / 2;
    const r = NODE_R[i] ?? 70;
    return { ...s, x: 100 + Math.cos(a) * r, y: 100 + Math.sin(a) * r, spoke: i * 2 };
  });

  return (
    <section id="skills" className="relative overflow-hidden bg-midnight/40 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 halftone-red opacity-10" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading issue="Issue #02" kicker="Hover a node to tug the strand" title="Skill Web" />

        <div className="grid items-center gap-12 lg:grid-cols-[7fr_5fr]">
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotate: -30 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="relative mx-auto aspect-square w-full max-w-[560px]"
          >
            <svg viewBox="-10 -10 220 220" className="size-full overflow-visible">
              <defs>
                <filter id="node-glow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g className={cn("text-silver/35 transition-colors", active !== null && "animate-strand text-silver/55")} fill="none" stroke="currentColor" strokeWidth={0.45}>
                {spokes.map((d, i) => (
                  <path key={i} d={d} />
                ))}
                {rings.map((d, i) => (
                  <path key={`r${i}`} d={d} />
                ))}
              </g>
              {/* Active strand */}
              {nodes.map((n, i) => (
                <line
                  key={`l${n.name}`}
                  x1={100}
                  y1={100}
                  x2={n.x}
                  y2={n.y}
                  stroke="var(--primary-glow)"
                  strokeWidth={active === i ? 1.4 : 0}
                  className={cn("transition-all duration-300", active === i && "animate-strand")}
                  filter="url(#node-glow)"
                />
              ))}
              <circle cx={100} cy={100} r={3} fill="var(--primary)" filter="url(#node-glow)" />
              {nodes.map((n, i) => (
                <g
                  key={n.name}
                  data-cursor
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onClick={() => setActive(i)}
                  className="cursor-pointer"
                >
                  <motion.g
                    animate={active === i ? { scale: 1.25 } : { scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    style={{ originX: `${n.x}px`, originY: `${n.y}px`, transformBox: "view-box" }}
                    className={cn(active === i && "animate-strand")}
                  >
                    <circle cx={n.x} cy={n.y} r={13} fill="var(--background)" stroke={active === i ? "var(--primary-glow)" : "var(--silver)"} strokeWidth={1} filter={active === i ? "url(#node-glow)" : undefined} />
                    <circle cx={n.x} cy={n.y} r={10.5} fill={active === i ? "var(--primary)" : "var(--card)"} />
                    <text x={n.x} y={n.y + 2.6} textAnchor="middle" className="font-display" fontSize={n.name.length > 4 ? 6 : 7.5} fill="var(--foreground)">
                      {n.name}
                    </text>
                  </motion.g>
                </g>
              ))}
            </svg>
          </motion.div>

          <motion.div
            key={current?.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="comic-panel relative bg-card p-8"
          >
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{active === null ? "Spider-sense" : "Strand locked"}</p>
            <h3 className="mt-2 font-display text-6xl">{current?.name}</h3>
            <p className="mt-3 text-lg text-muted-foreground">{current?.note}</p>
            <div className="mt-6 h-3 w-full overflow-hidden border border-border bg-muted">
              <motion.div className="h-full bg-crimson" initial={{ width: 0 }} animate={{ width: `${current?.level ?? 0}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
            </div>
            <p className="mt-2 text-right font-mono text-sm text-silver">{current?.level}%</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SKILLS.map((s, i) => (
                <button
                  key={s.name}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={cn(
                    "border px-3 py-1 font-display text-lg tracking-wider transition-colors",
                    active === i ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
