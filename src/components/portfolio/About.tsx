import { motion } from "framer-motion";
import avatar from "@/assets/avatar.jpg";
import { STATS, TIMELINE } from "@/lib/portfolio-data";
import { Counter } from "./Counter";
import { SectionHeading } from "./SectionHeading";
import { CornerWeb } from "./WebGraphic";

export function About() {
  return (
    <section id="about" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute -right-40 top-20 size-[36rem] rounded-full bg-accent/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading issue="Issue #01" kicker="Origin story" title="About Me" />

        <div className="grid items-start gap-14 lg:grid-cols-[5fr_7fr] lg:gap-20">
          {/* Avatar frame */}
          <motion.div
            initial={{ opacity: 0, rotate: -8, x: -60 }}
            whileInView={{ opacity: 1, rotate: -3, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 70, damping: 14 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="comic-panel relative overflow-hidden bg-card">
              <img src={avatar} alt="Portrait of Krishna Sahu on a rooftop at dusk" loading="lazy" className="aspect-[4/5] w-full object-cover" />
              <div className="pointer-events-none absolute inset-0 halftone opacity-25 mix-blend-multiply" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              <CornerWeb className="pointer-events-none absolute right-0 top-0 size-32 -scale-x-100 text-silver/50" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-silver/80">Subject file</p>
                <p className="font-display text-4xl">Krishna Sahu</p>
              </div>
            </div>
            <div className="comic-panel absolute -right-4 -top-5 rotate-6 bg-silver px-4 py-2 font-display text-xl text-ink sm:-right-8">
              B.Tech CSE!
            </div>
          </motion.div>

          {/* Bio, timeline, stats */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-xl leading-relaxed text-muted-foreground sm:text-2xl"
            >
              I'm a <span className="font-semibold text-foreground">Computer Science & Engineering</span> student who swings between
              algorithms and interfaces. I love untangling hard problems in <span className="text-primary">C++</span>, then turning
              the solutions into fast, good-looking apps people actually enjoy using.
            </motion.p>

            <ol className="relative mt-12 space-y-8 border-l-2 border-dashed border-silver/30 pl-8">
              {TIMELINE.map((t, i) => (
                <motion.li
                  key={t.title}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  className="relative"
                >
                  <span className="absolute -left-[41px] top-1 grid size-5 place-items-center rounded-full border-2 border-primary bg-background">
                    <span className="size-2 rounded-full bg-primary" />
                  </span>
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{t.period}</p>
                  <h3 className="mt-1 font-display text-3xl">{t.title}</h3>
                  <p className="mt-1 text-muted-foreground">{t.detail}</p>
                </motion.li>
              ))}
            </ol>

            <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 120 }}
                  className="relative overflow-hidden border border-border bg-card/70 p-4 text-center"
                >
                  <div className="pointer-events-none absolute inset-0 halftone-red opacity-20" />
                  <p className="relative font-display text-5xl text-crimson">
                    <Counter value={s.value} decimals={s.decimals ?? 0} suffix={s.suffix} />
                  </p>
                  <p className="relative mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
