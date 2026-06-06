export const NEWS_CATEGORIES = [
  "All news",
  "Earnings",
  "Fed & rates",
  "Macro",
  "Markets",
  "Technology",
  "IPOs",
  "M&A",
  "Crypto",
] as const;
export type NewsCategory = (typeof NEWS_CATEGORIES)[number];
export const DEFAULT_NEWS_CATEGORY: NewsCategory = "All news";

export const SORT_OPTIONS = ["Latest", "Trending", "By ticker"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

// Categories actually used as article-card tags (subset of NEWS_CATEGORIES — "All news" is a filter, not an article tag).
export type ArticleCategory = Exclude<NewsCategory, "All news">;

export type CategoryStyle = {
  tileBg: string;
  tileFg: string;
  chipBg: string;
  chipFg: string;
};

// Subtle on-theme tints using color-mix against the existing palette tokens in app/globals.css.
// Tile = larger left rail, slightly stronger tint. Chip = inline pill, lighter tint.
export const categoryStyles: Record<ArticleCategory, CategoryStyle> = {
  Earnings: {
    tileBg: "color-mix(in srgb, var(--color-accent) 18%, var(--color-surface-2))",
    tileFg: "var(--color-accent)",
    chipBg: "color-mix(in srgb, var(--color-accent) 16%, transparent)",
    chipFg: "var(--color-accent)",
  },
  "Fed & rates": {
    tileBg: "color-mix(in srgb, #fbbf24 18%, var(--color-surface-2))",
    tileFg: "#fbbf24",
    chipBg: "color-mix(in srgb, #fbbf24 16%, transparent)",
    chipFg: "#fbbf24",
  },
  Macro: {
    tileBg: "color-mix(in srgb, #22d3ee 16%, var(--color-surface-2))",
    tileFg: "#22d3ee",
    chipBg: "color-mix(in srgb, #22d3ee 16%, transparent)",
    chipFg: "#22d3ee",
  },
  Technology: {
    tileBg: "color-mix(in srgb, #a78bfa 18%, var(--color-surface-2))",
    tileFg: "#a78bfa",
    chipBg: "color-mix(in srgb, #a78bfa 16%, transparent)",
    chipFg: "#a78bfa",
  },
  Markets: {
    tileBg: "color-mix(in srgb, #60a5fa 18%, var(--color-surface-2))",
    tileFg: "#60a5fa",
    chipBg: "color-mix(in srgb, #60a5fa 16%, transparent)",
    chipFg: "#60a5fa",
  },
  IPOs: {
    tileBg: "color-mix(in srgb, var(--color-success) 18%, var(--color-surface-2))",
    tileFg: "var(--color-success)",
    chipBg: "color-mix(in srgb, var(--color-success) 16%, transparent)",
    chipFg: "var(--color-success)",
  },
  "M&A": {
    tileBg: "color-mix(in srgb, #f472b6 18%, var(--color-surface-2))",
    tileFg: "#f472b6",
    chipBg: "color-mix(in srgb, #f472b6 16%, transparent)",
    chipFg: "#f472b6",
  },
  Crypto: {
    tileBg: "color-mix(in srgb, #fb923c 18%, var(--color-surface-2))",
    tileFg: "#fb923c",
    chipBg: "color-mix(in srgb, #fb923c 16%, transparent)",
    chipFg: "#fb923c",
  },
};

// Label shown inside the colored tile and inline chip — short upper-case form of the category.
export const categoryDisplayLabel: Record<ArticleCategory, string> = {
  Earnings: "EARNINGS",
  "Fed & rates": "FED & RATES",
  Macro: "MACRO",
  Technology: "TECHNOLOGY",
  Markets: "MARKETS",
  IPOs: "IPO",
  "M&A": "M&A",
  Crypto: "CRYPTO",
};

export type NewsArticle = {
  id: string;
  category: ArticleCategory;
  source: string;
  timeAgo: string;
  headline: string;
  summary?: string;
  tickers: string[];
  readTime: string;
  url: string;
};

export type EarningsStatus = "Pending" | "Beat" | "Miss";
export type EarningsRow = {
  symbol: string;
  name: string;
  day: string;
  date: string;
  when: string;
  status: EarningsStatus;
};

export type TrendingTickerRow = {
  rank: number;
  symbol: string;
  name: string;
  deltaPct: number;
  articleCount: number;
};

export const trendingTickers: TrendingTickerRow[] = [
  { rank: 1, symbol: "NVDA", name: "Nvidia Corp.", deltaPct: 6.42, articleCount: 48 },
  { rank: 2, symbol: "AAPL", name: "Apple Inc.", deltaPct: 0.74, articleCount: 31 },
  { rank: 3, symbol: "TSLA", name: "Tesla Inc.", deltaPct: -1.22, articleCount: 27 },
  { rank: 4, symbol: "META", name: "Meta Platforms", deltaPct: 3.18, articleCount: 19 },
  { rank: 5, symbol: "BTC", name: "Bitcoin", deltaPct: 1.84, articleCount: 16 },
];

export type EventImportance = "HIGH" | "MED";
export type EconomicEvent = {
  importance: EventImportance;
  name: string;
  day: string;
  time: string;
};

export const economicCalendar: EconomicEvent[] = [
  { importance: "HIGH", name: "Core PCE deflator", day: "Today", time: "8:30am ET" },
  { importance: "MED", name: "Initial jobless claims", day: "Thu", time: "8:30am ET" },
  { importance: "HIGH", name: "Non-farm payrolls", day: "Fri", time: "8:30am ET" },
];
