import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";
import { TOUR_EVENT } from "./Tour";
import { WebGraphic } from "./WebGraphic";
import { INTRO_DELAY } from "./Loader";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: INTRO_DELAY + 1.6, duration: 0.6 }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled ? "border-b border-border bg-background/80 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2">
          <WebGraphic className="size-7 text-primary" spokes={8} rings={4} strokeWidth={5} />
          <span className="font-display text-2xl tracking-widest">
            K<span className="text-primary">.</span>SAHU
          </span>
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="group relative font-display text-lg tracking-widest text-muted-foreground transition-colors hover:text-foreground">
                {l.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
          <li>
            <TourButton />
          </li>
        </ul>
        <div className="flex items-center gap-4 md:hidden">
          <TourButton />
          <a href="#contact" className="font-display text-lg tracking-widest text-primary">
            Contact
          </a>
        </div>
      </nav>
    </motion.header>
  );
}

function TourButton() {
  return (
    <button
      data-tour="replay"
      onClick={() => window.dispatchEvent(new Event(TOUR_EVENT))}
      className="flex items-center gap-1.5 border-2 border-primary px-3 py-0.5 font-display text-lg tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
    >
      <Play className="size-3.5" /> Tour
    </button>
  );
}
