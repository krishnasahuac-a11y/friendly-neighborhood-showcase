import { useEffect, useRef, useState } from "react";
import { WebGraphic } from "./WebGraphic";

type Pt = { x: number; y: number; t: number };
const LIFE = 650;

export function WebCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    setEnabled(mq.matches && !reduce.matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    const cursor = cursorRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !cursor || !ctx) return;
    document.documentElement.classList.add("web-cursor-on");

    const styles = getComputedStyle(document.documentElement);
    const silver = styles.getPropertyValue("--silver").trim() || "white";
    const crimson = styles.getPropertyValue("--primary-glow").trim() || "red";
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const pts: Pt[] = [];
    const onMove = (e: PointerEvent) => {
      pts.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      const hot = (e.target as HTMLElement | null)?.closest("a, button, [role=tab], input, textarea, [data-cursor]");
      cursor.dataset["hot"] = hot ? "1" : "0";
    };
    const onLeave = () => (cursor.style.opacity = "0");
    const onEnter = () => (cursor.style.opacity = "1");

    let raf = 0;
    const draw = () => {
      const now = performance.now();
      while (pts.length && now - (pts[0]?.t ?? now) > LIFE) pts.shift();
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.lineCap = "round";
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        if (!a || !b) continue;
        const life = 1 - (now - b.t) / LIFE;
        ctx.globalAlpha = Math.max(0, life) * 0.85;
        ctx.strokeStyle = silver;
        ctx.lineWidth = 0.4 + life * 1.4;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        if (i % 6 === 0) {
          ctx.globalAlpha = Math.max(0, life) * 0.5;
          ctx.strokeStyle = crimson;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(b.x + (a.y - b.y) * 2.5, b.y - (a.x - b.x) * 2.5);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("resize", resize);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("web-cursor-on");
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[90] h-screen w-screen" aria-hidden />
      <div ref={cursorRef} className="group pointer-events-none fixed left-0 top-0 z-[95]" style={{ transform: "translate3d(-100px,-100px,0)" }} aria-hidden>
        <div className="-ml-4 -mt-4 size-8 text-silver transition-transform duration-200 group-data-[hot=1]:scale-150 group-data-[hot=1]:text-primary-glow">
          <WebGraphic className="size-full drop-shadow-[0_0_6px_var(--primary)]" spokes={8} rings={3} strokeWidth={6} />
        </div>
      </div>
    </>
  );
}
