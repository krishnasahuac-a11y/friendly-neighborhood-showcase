import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/components/portfolio/About";
import { Contact } from "@/components/portfolio/Contact";
import { Hero } from "@/components/portfolio/Hero";
import { Loader } from "@/components/portfolio/Loader";
import { Nav } from "@/components/portfolio/Nav";
import { Projects } from "@/components/portfolio/Projects";
import { SkillWeb } from "@/components/portfolio/SkillWeb";
import { Tour } from "@/components/portfolio/Tour";
import { WebCursor } from "@/components/portfolio/WebCursor";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Krishna Sahu — B.Tech CSE Developer Portfolio" },
      { name: "description", content: "Portfolio of Krishna Sahu, B.Tech Computer Science & Engineering student, developer and problem solver." },
      { property: "og:title", content: "Krishna Sahu — Developer Portfolio" },
      { property: "og:description", content: "CSE student, developer and problem solver. Projects, skills and contact." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative">
      <Loader />
      <WebCursor />
      <Nav />
      <Hero />
      <About />
      <SkillWeb />
      <Projects />
      <Contact />
      <Tour />
    </main>
  );
}
