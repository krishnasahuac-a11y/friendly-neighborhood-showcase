import { motion } from "framer-motion";
import { Download, Github, Instagram, Linkedin, Mail, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import rooftop from "@/assets/rooftop-rain.jpg";
import { Button } from "@/components/ui/button";
import { buildMailto, contactSchema } from "@/lib/contact";
import { PROFILE } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";
import { CornerWeb, WebGraphic } from "./WebGraphic";

const SOCIALS = [
  { href: PROFILE.github, label: "GitHub", Icon: Github },
  { href: PROFILE.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: PROFILE.instagram, label: "Instagram", Icon: Instagram },
  { href: `mailto:${PROFILE.email}`, label: "Email", Icon: Mail },
];

type Field = "name" | "email" | "message";

const fieldClass =
  "w-full border-2 border-border bg-background/70 px-4 py-3 text-foreground placeholder:text-muted-foreground/70 outline-none transition-all focus:border-primary focus:shadow-glow";

export function Contact() {
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parsed = contactSchema.safeParse({ name: fd.get("name"), email: fd.get("email"), message: fd.get("message") });
    if (!parsed.success) {
      const next: Partial<Record<Field, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as Field;
        next[key] ??= issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    window.location.href = buildMailto(PROFILE.email, parsed.data);
    toast.success("Web signal sent!", { description: "Your email app should open with the message ready to send." });
    form.reset();
  };

  return (
    <section id="contact" className="relative overflow-hidden">
      {/* Rainy rooftop backdrop */}
      <div className="absolute inset-0">
        <img src={rooftop} alt="Rain-soaked rooftop overlooking the city at night" loading="lazy" className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
        <div className="rain pointer-events-none absolute inset-0 opacity-40" />
        <div className="rain rain-far pointer-events-none absolute inset-0 opacity-25" />
        <div className="lightning pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 halftone opacity-20 mix-blend-multiply" />
      </div>
      <CornerWeb className="pointer-events-none absolute left-0 top-0 size-48 text-silver/30 sm:size-72" />

      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading issue="Issue #04" kicker="Send up the signal" title="Contact" />

        <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}>
            <div className="relative mb-8 grid size-32 place-items-center">
              <div className="animate-signal absolute inset-0 rounded-full bg-primary/30 blur-2xl" />
              <WebGraphic className="relative size-28 text-primary-glow" strokeWidth={1.6} />
            </div>
            <p className="text-xl leading-relaxed text-muted-foreground">
              Got an internship, a hackathon team or a wild idea that needs building? Drop a message — I usually swing back within a day.
            </p>
            <a href={`mailto:${PROFILE.email}`} className="mt-6 inline-block font-mono text-lg text-foreground underline decoration-primary decoration-2 underline-offset-4 hover:text-primary">
              {PROFILE.email}
            </a>

            <ul className="mt-8 flex gap-4">
              {SOCIALS.map(({ href, label, Icon }, i) => (
                <motion.li key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.08 }}>
                  <a
                    href={href}
                    target={href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noreferrer"
                    aria-label={label}
                    className="comic-panel grid size-12 place-items-center bg-card text-silver transition-all hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground"
                  >
                    <Icon className="size-5" />
                  </a>
                </motion.li>
              ))}
            </ul>

            <Button asChild variant="hero" size="xl" className="mt-10" data-tour="resume">
              <a href={PROFILE.resume} download>
                Download Resume <Download className="size-5" />
              </a>
            </Button>
          </motion.div>

          <motion.form
            noValidate
            data-tour="contact-form"
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 40, rotate: 1.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 70, damping: 14 }}
            className="comic-panel relative space-y-5 bg-card/85 p-6 backdrop-blur-sm sm:p-10"
          >
            <span className="comic-panel absolute -right-3 -top-5 rotate-6 bg-silver px-3 py-1 font-display text-lg text-ink">Hey, Krishna!</span>
            {(
              [
                { id: "name", label: "Your name", type: "text", placeholder: "Peter P." },
                { id: "email", label: "Email", type: "email", placeholder: "you@daily-bugle.com" },
              ] as const
            ).map((f) => (
              <div key={f.id}>
                <label htmlFor={f.id} className="mb-1.5 block font-display text-xl tracking-widest">
                  {f.label}
                </label>
                <input id={f.id} name={f.id} type={f.type} placeholder={f.placeholder} maxLength={f.id === "name" ? 100 : 255} className={cn(fieldClass, errors[f.id] && "border-destructive")} aria-invalid={!!errors[f.id]} />
                {errors[f.id] && <p className="mt-1 font-mono text-xs text-destructive">{errors[f.id]}</p>}
              </div>
            ))}
            <div>
              <label htmlFor="message" className="mb-1.5 block font-display text-xl tracking-widest">
                Message
              </label>
              <textarea id="message" name="message" rows={5} maxLength={1000} placeholder="Tell me about your project…" className={cn(fieldClass, "resize-none", errors.message && "border-destructive")} aria-invalid={!!errors.message} />
              {errors.message && <p className="mt-1 font-mono text-xs text-destructive">{errors.message}</p>}
            </div>
            <Button type="submit" variant="hero" size="xl" className="w-full">
              Send Web Signal <Send className="size-5" />
            </Button>
          </motion.form>
        </div>
      </div>

      <footer className="relative border-t border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 sm:flex-row sm:px-8">
          <p className="font-display text-xl tracking-widest">
            K<span className="text-primary">.</span>SAHU
          </p>
          <p className="font-mono text-xs text-muted-foreground">© {new Date().getFullYear()} Krishna Sahu · With great code comes great responsibility.</p>
          <a href="#top" className="font-display text-lg tracking-widest text-primary hover:text-primary-glow">
            Back to top ↑
          </a>
        </div>
      </footer>
    </section>
  );
}
