import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { INTRO_DELAY } from "./Loader";
import { WebGraphic } from "./WebGraphic";

export const TOUR_EVENT = "krishna:start-tour";
const SEEN_KEY = "ks-tour-seen";
const STEP_MS = 4600;
const ACTION_MS = 1700;

type Step = {
  target: string;
  title: string;
  text: string;
  scroll?: boolean;
  action?: (el: HTMLElement) => void;
  leave?: (el: HTMLElement) => void;
};

// React derives enter/leave from mouseout pairs, so simulate moving from <body> onto the element.
const hover = (el: HTMLElement) => document.body.dispatchEvent(new MouseEvent("mouseout", { bubbles: true, relatedTarget: el }));
const unhover = (el: HTMLElement) => el.dispatchEvent(new MouseEvent("mouseout", { bubbles: true, relatedTarget: document.body }));
const tour = (id: string) => `[data-tour="${id}"]`;

const STEPS: Step[] = [
  { target: tour("name"), title: "Hey, I'm your guide!", text: "Let me swing you through Krishna's corner of the web." },
  { target: tour("swing"), title: "Swing into the work", text: "One click shoots a web and drops you right at the projects." },
  { target: tour("about"), title: "Origin story", text: "Who Krishna is, where he studies and how the journey began." },
  { target: tour("stats"), title: "Power levels", text: "Projects built, problems solved and more — counting up live." },
  { target: tour("skill-2"), title: "The skill web", text: "Every node is a skill. Hover one and its strand starts to vibrate.", action: hover, leave: unhover },
  { target: tour("filter-Web"), title: "Filter the case files", text: "Pick a category to see only those projects.", action: (el) => el.click() },
  {
    target: "#projects article",
    title: "Comic project panels",
    text: "Tilt a card with your mouse, then open its code or live demo.",
    leave: () => findVisible(tour("filter-All"))?.click(),
  },
  { target: tour("contact-form"), title: "Send a web signal", text: "Drop a message and it opens straight in your email app." },
  { target: tour("resume"), title: "Grab the resume", text: "Download Krishna's resume in a single click." },
  { target: tour("replay"), title: "That's the tour!", text: "Replay it any time from this button. Happy swinging!", scroll: false },
];

function findVisible(selector: string) {
  const all = Array.from(document.querySelectorAll<HTMLElement>(selector));
  return all.find((el) => el.getBoundingClientRect().width > 0) ?? null;
}

export function Tour() {
  const [step, setStep] = useState(-1);
  const [paused, setPaused] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [small, setSmall] = useState(false);
  const running = step >= 0;
  const current = STEPS[step];
  const stepRef = useRef(step);
  stepRef.current = step;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const fx = useMotionValue(0);
  const fy = useMotionValue(0);
  const fw = useMotionValue(0);
  const fh = useMotionValue(0);
  const glide = { stiffness: 55, damping: 16, mass: 0.9 };
  const sx = useSpring(mx, glide);
  const sy = useSpring(my, glide);
  const sfx = useSpring(fx, glide);
  const sfy = useSpring(fy, glide);
  const sfw = useSpring(fw, glide);
  const sfh = useSpring(fh, glide);

  const bubbleX = useTransform(sx, (v) => {
    if (typeof window === "undefined") return 0;
    const w = 320;
    return v + 40 + w > window.innerWidth - 12 ? Math.max(12, v - 40 - w) : v + 40;
  });
  const bubbleY = useTransform(sy, (v) => (typeof window === "undefined" ? 0 : Math.min(Math.max(80, v + 24), window.innerHeight - 240)));

  const start = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    sx.jump(w + 60);
    sy.jump(h + 60);
    mx.set(w + 60);
    my.set(h + 60);
    sfx.jump(w / 2);
    sfy.jump(h / 2);
    sfw.jump(0);
    sfh.jump(0);
    setPaused(false);
    setStep(0);
  }, [mx, my, sx, sy, sfx, sfy, sfw, sfh]);

  const finish = useCallback(() => {
    const s = STEPS[stepRef.current];
    const el = s && findVisible(s.target);
    if (s?.leave && el) s.leave(el);
    findVisible(tour("filter-All"))?.click();
    localStorage.setItem(SEEN_KEY, "1");
    setStep(-1);
  }, []);

  const go = useCallback(
    (next: number) => {
      if (next >= STEPS.length) return finish();
      setStep(Math.max(0, next));
    },
    [finish],
  );

  // Auto-start once on the first visit, after the intro animation; replay via event.
  useEffect(() => {
    setSmall(window.innerWidth < 640);
    const onResize = () => setSmall(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    window.addEventListener(TOUR_EVENT, start);
    const t = localStorage.getItem(SEEN_KEY) ? undefined : setTimeout(start, (INTRO_DELAY + 3.4) * 1000);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener(TOUR_EVENT, start);
      if (t) clearTimeout(t);
    };
  }, [start]);

  // Follow the target every frame so the cursor glides along while the page scrolls.
  useEffect(() => {
    if (!current) return;
    let raf = 0;
    const loop = () => {
      const el = findVisible(current.target);
      if (el) {
        const r = el.getBoundingClientRect();
        mx.set(r.left + r.width * 0.5);
        my.set(r.top + r.height * 0.55);
        fx.set(r.left - 8);
        fy.set(r.top - 8);
        fw.set(r.width + 16);
        fh.set(r.height + 16);
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [current, mx, my, fx, fy, fw, fh]);

  // Slide to the section, then perform the step's click/hover.
  useEffect(() => {
    if (!current) return;
    const el = findVisible(current.target);
    if (el && current.scroll !== false) el.scrollIntoView({ behavior: "smooth", block: "center" });
    const t = setTimeout(() => {
      if (!current.action) return;
      const target = findVisible(current.target);
      if (!target) return;
      setClicks((c) => c + 1);
      current.action(target);
    }, ACTION_MS);
    return () => {
      clearTimeout(t);
      const target = findVisible(current.target);
      if (current.leave && target) current.leave(target);
    };
  }, [current]);

  // Auto-advance.
  useEffect(() => {
    if (!running || paused) return;
    const t = setTimeout(() => go(step + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [running, paused, step, go]);

  // Keyboard controls.
  useEffect(() => {
    if (!running) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
      if (e.key === "ArrowRight") go(stepRef.current + 1);
      if (e.key === "ArrowLeft") go(stepRef.current - 1);
      if (e.key === " ") {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running, go, finish]);

  return (
    <AnimatePresence>
      {running && current && (
        <motion.div key="tour" className="pointer-events-none fixed inset-0 z-[90]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {/* Spotlight frame */}
          <motion.div
            className="absolute left-0 top-0 border-2 border-primary-glow shadow-glow"
            style={{ x: sfx, y: sfy, width: sfw, height: sfh, boxShadow: "0 0 0 9999px color-mix(in oklab, var(--ink) 45%, transparent), var(--shadow-glow)" }}
          />

          {/* Guide cursor */}
          <motion.div className="absolute left-0 top-0" style={{ x: sx, y: sy }}>
            <AnimatePresence>
              <motion.span
                key={clicks}
                className="absolute -left-10 -top-10 size-20 text-primary-glow"
                initial={{ scale: 0.2, opacity: clicks ? 1 : 0 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <WebGraphic className="size-full" strokeWidth={2} />
              </motion.span>
            </AnimatePresence>
            <motion.svg
              key={`press-${clicks}`}
              viewBox="0 0 32 32"
              className="size-9 drop-shadow-[0_0_10px_var(--primary)]"
              animate={clicks ? { scale: [1, 0.78, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              aria-hidden
            >
              <path d="M3 2 L27 15 L16 17.5 L11 29 Z" fill="var(--primary)" stroke="var(--ink)" strokeWidth={2.2} strokeLinejoin="round" />
              <path d="M7 8 L19 15 M8.5 13 L13 24" stroke="var(--silver)" strokeWidth={0.9} opacity={0.7} />
            </motion.svg>
          </motion.div>

          {/* Caption bubble */}
          <motion.div
            className={cn("pointer-events-auto absolute", small ? "inset-x-3 bottom-3" : "left-0 top-0 w-[320px]")}
            style={small ? {} : { x: bubbleX, y: bubbleY }}
            onMouseEnter={() => setPaused(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 12, rotate: -2, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="comic-panel relative overflow-hidden bg-silver p-4 text-ink"
                role="dialog"
                aria-live="polite"
                aria-label="Website tour"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
                    Tour · {String(step + 1).padStart(2, "0")}/{String(STEPS.length).padStart(2, "0")}
                  </span>
                  <button onClick={finish} aria-label="Skip tour" className="grid size-6 place-items-center hover:text-primary">
                    <X className="size-4" />
                  </button>
                </div>
                <p className="mt-1 font-display text-3xl">{current.title}</p>
                <p className="mt-1 text-sm leading-snug">{current.text}</p>

                <div className="mt-3 flex items-center gap-2">
                  <button onClick={() => go(step - 1)} disabled={step === 0} aria-label="Previous step" className="grid size-8 place-items-center border-2 border-ink disabled:opacity-30 hover:bg-ink hover:text-silver">
                    <ChevronLeft className="size-4" />
                  </button>
                  <button onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play tour" : "Pause tour"} className="grid size-8 place-items-center border-2 border-ink hover:bg-ink hover:text-silver">
                    {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
                  </button>
                  <button onClick={() => go(step + 1)} className="ml-auto flex h-8 items-center gap-1 border-2 border-ink bg-crimson px-3 font-display text-lg tracking-widest text-primary-foreground">
                    {step === STEPS.length - 1 ? "Finish" : "Next"} <ChevronRight className="size-4" />
                  </button>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-1 bg-ink/15">
                  <motion.div
                    key={`${step}-${paused}`}
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={paused ? { width: "0%" } : { width: "100%" }}
                    transition={{ duration: paused ? 0 : STEP_MS / 1000, ease: "linear" }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
