import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { useState } from "react";
import { CATEGORIES, PROJECTS, type Project } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";
import { CornerWeb } from "./WebGraphic";

const SFX = ["THWIP!", "ZAP!", "BAM!", "WHAM!", "POW!", "THWIP!"];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 180, damping: 18 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 50, rotate: index % 2 ? 2 : -2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="comic-panel group relative flex h-full flex-col overflow-hidden bg-card"
      >
        <div className="relative aspect-[16/10] overflow-hidden border-b-[3px] border-ink">
          <img
            src={project.image}
            alt={`${project.title} — ${project.tagline}`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="pointer-events-none absolute inset-0 halftone opacity-20 mix-blend-multiply" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          <CornerWeb className="pointer-events-none absolute right-0 top-0 size-24 -scale-x-100 text-silver/0 transition-colors duration-500 group-hover:text-silver/60" />
          <span className="absolute left-3 top-3 border-2 border-ink bg-silver px-2 py-0.5 font-display text-sm tracking-widest text-ink">
            {project.category}
          </span>
          <span
            className="pointer-events-none absolute bottom-3 right-3 rotate-[-8deg] scale-0 font-display text-4xl text-primary-glow opacity-0 drop-shadow-[2px_2px_0_var(--ink)] transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
            aria-hidden
          >
            {SFX[index % SFX.length]}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6" style={{ transform: "translateZ(30px)" }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">{project.tagline}</p>
          <h3 className="mt-1 font-display text-4xl">{project.title}</h3>
          <p className="mt-2 flex-1 text-muted-foreground">{project.description}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <li key={t} className="border border-border bg-muted px-2 py-0.5 font-mono text-xs text-silver">
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex gap-4 border-t border-dashed border-border pt-4">
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-display text-lg tracking-widest text-foreground transition-colors hover:text-primary"
            >
              <Github className="size-4" /> Code
            </a>
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-display text-lg tracking-widest text-foreground transition-colors hover:text-primary"
              >
                <ExternalLink className="size-4" /> Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("All");
  const shown = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <section id="projects" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute -left-40 top-40 size-[34rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading issue="Issue #03" kicker="Case files from the web" title="Projects" />

        <div className="mb-10 flex flex-wrap gap-3" role="tablist" aria-label="Filter projects">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={filter === c}
              onClick={() => setFilter(c)}
              className={cn(
                "relative border-2 px-4 py-1.5 font-display text-xl tracking-widest transition-colors",
                filter === c ? "border-ink text-primary-foreground" : "border-border text-muted-foreground hover:border-silver hover:text-foreground",
              )}
            >
              {filter === c && <motion.span layoutId="filter-pill" className="comic-panel absolute inset-0 -z-0 bg-crimson" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
              <span className="relative">{c}</span>
            </button>
          ))}
        </div>

        <motion.div layout className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => (
              <ProjectCard key={p.title} project={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
