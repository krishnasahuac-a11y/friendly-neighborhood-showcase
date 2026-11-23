import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { WebGraphic } from "./WebGraphic";

export const INTRO_DELAY = 2.2;

export function Loader() {
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(100, Math.round(((t - start) / 1900) * 100));
      setPct(p);
      if (p < 100) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] grid place-items-center bg-background"
          exit={{ opacity: 0, scale: 1.08, filter: "blur(6px)" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="pointer-events-none absolute inset-0 halftone-red opacity-20" />
          <div className="relative flex flex-col items-center gap-8">
            <div className="relative size-40 sm:size-52">
              <div className="absolute inset-0 rounded-full shadow-glow" />
              <WebGraphic className="absolute inset-0 animate-web-spin text-silver" strokeWidth={0.7} />
              <motion.div
                className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-glow"
                animate={{ scale: [1, 1.6, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
            <div className="text-center">
              <p className="font-display text-4xl text-silver-metal">Spinning the web</p>
              <p className="mt-2 font-mono text-sm text-muted-foreground">{pct.toString().padStart(3, "0")}%</p>
            </div>
            <div className="h-0.5 w-56 overflow-hidden bg-muted">
              <div className="h-full bg-crimson" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
