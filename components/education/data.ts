export type Difficulty = "Basic" | "Beginner" | "Intermediate" | "Advanced";

export type LearningTrack = {
  id: string;
  title: string;
  description: string;
  lessons: number;
  progressPct: number;
  accentColor: string;
  iconName: "TrendingUp" | "BarChart2" | "Landmark" | "Layers";
};

export type GlossaryEntry = {
  term: string;
  difficulty: Difficulty;
  definition: string;
};

export type PopularGuide = {
  rank: number;
  title: string;
  difficulty: Difficulty;
  readTime: string;
};

export type QuizQuestion = {
  questionNumber: number;
  totalQuestions: number;
  prompt: string;
  choices: string[];
};

export type TrendingTerm = { label: string };

export const ALPHABET = [
  "A","B","C","D","E","F","G","H","I","J","K","L","M",
  "N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
] as const;

export const ACTIVE_LETTERS: ReadonlySet<string> = new Set([
  "A","B","C","D","E",
]);

export const DEFAULT_SELECTED_LETTER = "A";

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

export const glossaryEntries: Record<string, GlossaryEntry[]> = {
  A: [
    {
      term: "Alpha",
      difficulty: "Intermediate",
      definition:
        "Excess return of an investment relative to a benchmark index, after adjusting for risk.",
    },
    {
      term: "Arbitrage",
      difficulty: "Advanced",
      definition:
        "Simultaneously buying and selling an asset in different markets to profit from price differences.",
    },
    {
      term: "Asset allocation",
      difficulty: "Basic",
      definition:
        "The strategy of dividing a portfolio among different asset classes like stocks, bonds, and cash.",
    },
  ],
};

export const popularGuides: PopularGuide[] = [
  { rank: 1, title: "How to read a P&L statement", difficulty: "Beginner", readTime: "6 min read" },
  { rank: 2, title: "Dollar-cost averaging explained", difficulty: "Beginner", readTime: "4 min read" },
  { rank: 3, title: "How the Fed sets interest rates", difficulty: "Intermediate", readTime: "6 min read" },
  { rank: 4, title: "Portfolio diversification 101", difficulty: "Beginner", readTime: "5 min read" },
  { rank: 5, title: "Calls vs puts — a plain-language guide", difficulty: "Advanced", readTime: "10 min read" },
];

export const dailyQuiz: QuizQuestion = {
  questionNumber: 1,
  totalQuestions: 3,
  prompt: "What does a company's P/E ratio measure?",
  choices: [
    "Its profit margin vs expenses",
    "Price relative to earnings per share",
    "Price relative to total equity",
    "Its dividend yield percentage",
  ],
};

export const trendingTerms: TrendingTerm[] = [
  { label: "Yield curve" },
  { label: "Quantitative easing" },
  { label: "Bear market" },
  { label: "Short interest" },
  { label: "Margin call" },
  { label: "EBITDA" },
  { label: "Stock split" },
];
