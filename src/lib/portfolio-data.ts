import codearena from "@/assets/project-codearena.jpg";
import visualizer from "@/assets/project-visualizer.jpg";
import attendance from "@/assets/project-attendance.jpg";
import library from "@/assets/project-library.jpg";
import campus from "@/assets/project-campus.jpg";
import pathfinder from "@/assets/project-pathfinder.jpg";

export const PROFILE = {
  name: "Krishna Sahu",
  roles: ["CSE Student", "Developer", "Problem Solver"],
  email: "krishna.sahu@example.com",
  github: "https://github.com/",
  linkedin: "https://www.linkedin.com/",
  instagram: "https://www.instagram.com/",
  resume: "/krishna-sahu-resume.pdf",
};

export const STATS = [
  { label: "Projects Built", value: 12, suffix: "+" },
  { label: "DSA Problems", value: 400, suffix: "+" },
  { label: "Hackathons", value: 5, suffix: "" },
  { label: "CGPA", value: 8.7, suffix: "", decimals: 1 },
];

export const TIMELINE = [
  {
    period: "2022 — 2026",
    title: "B.Tech, Computer Science & Engineering",
    detail: "Data structures, operating systems, DBMS, networks and software engineering.",
  },
  {
    period: "2023 — Now",
    title: "Competitive Programming",
    detail: "Daily problem solving in C++, contests and peer study circles.",
  },
  {
    period: "2022",
    title: "Higher Secondary (PCM)",
    detail: "Science stream with mathematics, where the love for logic began.",
  },
];

export type Skill = { name: string; level: number; note: string };

export const SKILLS: Skill[] = [
  { name: "C++", level: 90, note: "My go-to for DSA and competitive programming." },
  { name: "Java", level: 80, note: "OOP, collections and backend fundamentals." },
  { name: "Python", level: 85, note: "Scripting, automation and machine learning." },
  { name: "React", level: 78, note: "Component-driven, animated web interfaces." },
  { name: "DSA", level: 88, note: "Graphs, DP, trees — 400+ problems solved." },
  { name: "SQL", level: 75, note: "Schema design, joins and query optimisation." },
];

export type Category = "Web" | "AI/ML" | "DSA" | "Database";
export const CATEGORIES: ("All" | Category)[] = ["All", "Web", "AI/ML", "DSA", "Database"];

export type Project = {
  title: string;
  tagline: string;
  description: string;
  image: string;
  tech: string[];
  category: Category;
  github: string;
  live?: string;
};

export const PROJECTS: Project[] = [
  {
    title: "CodeArena",
    tagline: "Competitive coding platform",
    description: "Live code editor, test-case runner and a real-time leaderboard for college contests.",
    image: codearena,
    tech: ["React", "Node.js", "MongoDB"],
    category: "Web",
    github: "https://github.com/",
    live: "https://example.com/",
  },
  {
    title: "AlgoVision",
    tagline: "Algorithm visualizer",
    description: "Watch sorting and pathfinding algorithms run step by step with speed controls.",
    image: visualizer,
    tech: ["React", "TypeScript", "DSA"],
    category: "DSA",
    github: "https://github.com/",
    live: "https://example.com/",
  },
  {
    title: "FaceMark",
    tagline: "Smart attendance",
    description: "Face-recognition attendance that marks a full classroom in seconds.",
    image: attendance,
    tech: ["Python", "OpenCV", "Flask"],
    category: "AI/ML",
    github: "https://github.com/",
  },
  {
    title: "ShelfDB",
    tagline: "Library management",
    description: "Track books, members and loans with a normalised SQL schema and reports.",
    image: library,
    tech: ["Java", "SQL", "JDBC"],
    category: "Database",
    github: "https://github.com/",
  },
  {
    title: "CampusLoop",
    tagline: "Campus social hub",
    description: "Events, notices and group chats for students — on phone and laptop.",
    image: campus,
    tech: ["React", "Firebase", "Tailwind"],
    category: "Web",
    github: "https://github.com/",
    live: "https://example.com/",
  },
  {
    title: "WebRoute",
    tagline: "City shortest-path router",
    description: "Dijkstra and A* routing across a city grid, written from scratch in C++.",
    image: pathfinder,
    tech: ["C++", "Graphs", "STL"],
    category: "DSA",
    github: "https://github.com/",
  },
];
