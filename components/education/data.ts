export type { Difficulty } from "@/lib/glossary/categories";
import type { Difficulty } from "@/lib/glossary/categories";

export type LearningTrack = {
  id: string;
  title: string;
  description: string;
  lessons: number;
  progressPct: number;
  accentColor: string;
  iconName: "TrendingUp" | "BarChart2" | "Landmark" | "Layers";
};

export type PopularGuide = {
  rank: number;
  title: string;
  difficulty: Difficulty;
  readTime: string;
};

export type TrendingTerm = { label: string; slug: string };

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

export const popularGuides: PopularGuide[] = [
  { rank: 1, title: "How to read a P&L statement", difficulty: "Beginner", readTime: "6 min read" },
  { rank: 2, title: "Dollar-cost averaging explained", difficulty: "Beginner", readTime: "4 min read" },
  { rank: 3, title: "How the Fed sets interest rates", difficulty: "Intermediate", readTime: "6 min read" },
  { rank: 4, title: "Portfolio diversification 101", difficulty: "Beginner", readTime: "5 min read" },
  { rank: 5, title: "Calls vs puts — a plain-language guide", difficulty: "Advanced", readTime: "10 min read" },
];

// Trending term slugs reference real entries seeded in 0003_glossary_terms_seed.sql.
export const trendingTerms: TrendingTerm[] = [
  { label: "Yield curve", slug: "yield-curve" },
  { label: "Quantitative easing", slug: "quantitative-easing" },
  { label: "Recession", slug: "recession" },
  { label: "Short selling", slug: "short-selling" },
  { label: "Implied volatility", slug: "implied-volatility" },
  { label: "EBITDA", slug: "ebitda" },
  { label: "Stock split", slug: "stock-split" },
];
