import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import skyline from "@/assets/hero-skyline.jpg";
import { Button } from "@/components/ui/button";
import { PROFILE } from "@/lib/portfolio-data";
import { INTRO_DELAY } from "./Loader";
import { CornerWeb, WebGraphic } from "./WebGraphic";

/** Deterministic skyline silhouette path for a 1600x400 viewBox. */
function buildings(seed: number, minH: number, maxH: number) {
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  let x = 0;
  let d = "M0 400";
  while (x < 1600) {
    const w = 40 + rnd() * 70;
    const h = minH + rnd() * (maxH - minH);
    const top = 400 - h;
    d += ` L${x.toFixed(0)} ${top.toFixed(0)}`;
    if (rnd() > 0.7) {
      const sw = w * 0.3;
      d += ` L${(x + w / 2 - sw / 2).toFixed(0)} ${top.toFixed(0)} L${(x + w / 2).toFixed(0)} ${(top - 30 - rnd() * 40).toFixed(0)} L${(x + w / 2 + sw / 2).toFixed(0)} ${top.toFixed(0)}`;
    }
    d += ` L${(x + w).toFixed(0)} ${top.toFixed(0)}`;
    x += w;
  }
  return `${d} L1600 400 Z`;
}
const MID = buildings(7, 90, 230);
const FRONT = buildings(42, 40, 150);

function useTypewriter(words: string[], startDelay: number) {
  const [text, setText] = useState("");
  useEffect(() => {
    let wi = 0;
    let ci = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      const word = words[wi] ?? "";
      if (!deleting) {
        ci++;
        setText(word.slice(0, ci));
        if (ci === word.length) {
          deleting = true;
          timer = setTimeout(step, 1500);
          return;
        }
        timer = setTimeout(step, 85);
      } else {
        ci--;
        setText(word.slice(0, ci));
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
          timer = setTimeout(step, 350);
          return;
        }
        timer = setTimeout(step, 40);
      }
    };
    timer = setTimeout(step, startDelay * 1000);
    return () => clearTimeout(timer);
  }, [words, startDelay]);
  return text;
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const midY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const bgX = useTransform(sx, (v) => v * -18);
  const bgMy = useTransform(sy, (v) => v * -10);
  const midX = useTransform(sx, (v) => v * -34);
  const frontX = useTransform(sx, (v) => v * -60);

  const typed = useTypewriter(PROFILE.roles, INTRO_DELAY + 2.2);
  const [shooting, setShooting] = useState(false);

  const onMouse = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const swing = () => {
    if (shooting) return;
    setShooting(true);
    setTimeout(() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }), 450);
    setTimeout(() => setShooting(false), 1400);
  };

  return (
    <section id="top" ref={ref} onMouseMove={onMouse} className="relative h-[100svh] min-h-[640px] overflow-hidden">
      {/* Layer 1: photographic skyline */}
      <motion.div className="absolute -inset-[6%]" style={{ y: bgY }}>
        <motion.img
          src={skyline}
          alt="City skyline at dusk under a crimson sky"
          className="size-full object-cover"
          style={{ x: bgX, y: bgMy }}
          initial={{ scale: 1.25 }}
          animate={{ scale: 1.08 }}
          transition={{ duration: 3.5, ease: "easeOut", delay: INTRO_DELAY - 0.6 }}
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/10 to-background" />

      {/* Lens flares */}
      <div className="lens-flare absolute left-[8%] top-[42%] size-72 rounded-full" />
      <div className="lens-flare absolute right-[18%] top-[20%] size-24 rounded-full opacity-60" />

      {/* Layer 2 & 3: silhouettes */}
      <motion.svg viewBox="0 0 1600 400" preserveAspectRatio="none" className="absolute -left-[5%] bottom-0 h-[38%] w-[110%] text-midnight" style={{ x: midX, y: midY }} aria-hidden>
        <path d={MID} fill="currentColor" opacity="0.92" />
      </motion.svg>
      <motion.svg viewBox="0 0 1600 400" preserveAspectRatio="none" className="absolute -left-[8%] -bottom-1 h-[24%] w-[116%] text-ink" style={{ x: frontX }} aria-hidden>
        <path d={FRONT} fill="currentColor" />
      </motion.svg>

      {/* Comic overlays */}
      <div className="pointer-events-none absolute inset-0 halftone opacity-30 mix-blend-multiply" />
      <CornerWeb className="pointer-events-none absolute left-0 top-0 size-56 text-silver/40 sm:size-80" />
      <CornerWeb className="pointer-events-none absolute right-0 top-0 size-40 -scale-x-100 text-silver/25 sm:size-64" />

      {/* Content */}
      <motion.div style={{ y: contentY, opacity: fade }} className="relative z-10 flex h-full flex-col items-center px-5">
        {/* Web swing: thread + name swing as one pendulum from the top edge */}
        <motion.div
          className="flex flex-col items-center"
          style={{ transformOrigin: "50% 0%" }}
          initial={{ rotate: -38, y: "-110%" }}
          animate={{ rotate: [-38, 24, -13, 7, -3, 0], y: "0%" }}
          transition={{ delay: INTRO_DELAY, duration: 2.4, ease: "easeOut", y: { delay: INTRO_DELAY, duration: 0.7, ease: "easeOut" } }}
        >
          <div className="h-[18svh] w-px bg-gradient-to-b from-silver/0 via-silver/70 to-silver sm:h-[22svh]" />
          <WebGraphic className="-mt-1 size-8 text-silver" spokes={8} rings={3} strokeWidth={5} />
          <div className="mt-3 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-silver/80 sm:text-sm">Your friendly neighbourhood developer</p>
            <h1 data-tour="name" data-text="KRISHNA SAHU" className="glitch mt-3 font-display text-[18vw] leading-[0.85] text-silver-metal drop-shadow-[0_6px_30px_var(--ink)] sm:text-[13vw] lg:text-[11rem]">
              KRISHNA SAHU
            </h1>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: INTRO_DELAY + 1.9, duration: 0.7 }} className="mt-5 flex flex-col items-center gap-8">
          <p className="flex h-8 items-center font-mono text-lg text-foreground sm:text-2xl">
            <span className="mr-2 text-primary">&gt;</span>
            {typed}
            <span className="ml-1 inline-block h-6 w-2.5 animate-caret bg-primary" />
          </p>
          <p className="-mt-5 hidden font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground sm:block">
            {PROFILE.roles.join("  |  ")}
          </p>

          <div className="relative" data-tour="swing">
            <Button variant="hero" size="xl" onClick={swing}>
              Swing Into My Work <ArrowDown className="size-5" />
            </Button>
            {shooting && (
              <>
                <motion.span
                  className="pointer-events-none absolute left-1/2 top-full w-0.5 origin-top bg-gradient-to-b from-silver to-silver/0"
                  initial={{ height: 0, opacity: 1 }}
                  animate={{ height: "70vh", opacity: [1, 1, 0] }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                />
                <motion.span
                  className="pointer-events-none absolute left-1/2 top-1/2 -ml-12 -mt-12 size-24 text-silver"
                  initial={{ scale: 0.2, opacity: 1, rotate: 0 }}
                  animate={{ scale: 2.4, opacity: 0, rotate: 40 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <WebGraphic className="size-full" strokeWidth={1.4} />
                </motion.span>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: INTRO_DELAY + 2.6, y: { repeat: Infinity, duration: 1.8 } }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 font-mono text-xs uppercase tracking-[0.3em] text-silver/70"
      >
        Scroll
      </motion.a>
    </section>
  );
}
