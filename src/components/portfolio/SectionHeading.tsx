import { motion } from "framer-motion";

export function SectionHeading({ issue, title, kicker }: { issue: string; title: string; kicker: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="mb-12 sm:mb-16"
    >
      <div className="flex items-center gap-3">
        <span className="comic-panel -rotate-2 bg-primary px-3 py-1 font-display text-lg tracking-widest text-primary-foreground">{issue}</span>
        <span className="font-mono text-xs uppercase tracking-[0.35em] text-muted-foreground">{kicker}</span>
      </div>
      <h2 className="mt-4 font-display text-6xl text-foreground sm:text-8xl">{title}</h2>
    </motion.div>
  );
}
