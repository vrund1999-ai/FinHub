export type { Difficulty } from "@/lib/glossary/categories";

export type LearningTrack = {
  id: string;
  title: string;
  description: string;
  lessons: number;
  progressPct: number;
  accentColor: string;
  iconName: "TrendingUp" | "BarChart2" | "Landmark" | "Layers";
};

export const ALPHABET = [
  "A","B","C","D","E","F","G","H","I","J","K","L","M",
  "N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
] as const;

export const learningTracks: LearningTrack[] = [
  {
    id: "investing-basics",
    title: "Investing basics",
    description:
      "Stocks, bonds, ETFs, and how markets work — the essentials for first-time investors.",
    lessons: 12,
    progressPct: 48,
    accentColor: "var(--color-accent)",
    iconName: "TrendingUp",
  },
  {
    id: "reading-financials",
    title: "Reading financials",
    description:
      "Income statements, balance sheets, and cash flow — how to read what companies actually report.",
    lessons: 9,
    progressPct: 22,
    accentColor: "var(--color-success)",
    iconName: "BarChart2",
  },
  {
    id: "macro-and-fed",
    title: "Macro & the Fed",
    description:
      "Interest rates, inflation, GDP, and how central bank decisions ripple through markets.",
    lessons: 8,
    progressPct: 0,
    accentColor: "#fbbf24",
    iconName: "Landmark",
  },
  {
    id: "options-derivatives",
    title: "Options & derivatives",
    description:
      "Calls, puts, Greeks, and options strategies — for investors ready to go beyond stocks.",
    lessons: 14,
    progressPct: 0,
    accentColor: "#a78bfa",
    iconName: "Layers",
  },
];

