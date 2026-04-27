export type TickerItem = {
  label: string;
  value: string;
  deltaPct: number;
};

export type MarketIndex = {
  name: string;
  value: string;
  deltaPct: number;
  spark: number[];
};

export type NewsCategory = "EARNINGS" | "FED" | "MACRO";

export type NewsArticle = {
  category: NewsCategory;
  headline: string;
  source: string;
  timeAgo: string;
};

export type Mover = {
  symbol: string;
  price: string;
  deltaPct: number;
};

export const tickerItems: TickerItem[] = [
  { label: "S&P 500", value: "5,312.48", deltaPct: 0.62 },
  { label: "NASDAQ", value: "18,764.20", deltaPct: -0.14 },
  { label: "DJIA", value: "39,887.11", deltaPct: 0.31 },
  { label: "BTC", value: "$67,420", deltaPct: 1.84 },
  { label: "10Y", value: "4.512%", deltaPct: -0.03 },
];

export const marketIndices: MarketIndex[] = [
  {
    name: "S&P 500",
    value: "5,312",
    deltaPct: 0.62,
    spark: [12, 14, 13, 16, 15, 18, 17, 20],
  },
  {
    name: "NASDAQ",
    value: "18,764",
    deltaPct: -0.14,
    spark: [20, 19, 21, 18, 17, 19, 16, 18],
  },
  {
    name: "Russell 2K",
    value: "2,043",
    deltaPct: 0.41,
    spark: [10, 12, 11, 14, 13, 15, 14, 17],
  },
  {
    name: "VIX",
    value: "14.82",
    deltaPct: 1.2,
    spark: [16, 15, 14, 13, 12, 11, 12, 14],
  },
];

export const newsArticles: NewsArticle[] = [
  {
    category: "EARNINGS",
    headline: "Nvidia beats expectations on data center revenue surge",
    source: "Reuters",
    timeAgo: "14 min ago",
  },
  {
    category: "FED",
    headline: "Powell signals patience on rate cuts amid sticky inflation",
    source: "Bloomberg",
    timeAgo: "1 hr ago",
  },
  {
    category: "MACRO",
    headline: "Jobs report shows labor market cooling faster than expected",
    source: "WSJ",
    timeAgo: "3 hr ago",
  },
];

export const topMovers: Mover[] = [
  { symbol: "NVDA", price: "$887.40", deltaPct: 6.42 },
  { symbol: "META", price: "$514.22", deltaPct: 3.18 },
  { symbol: "INTC", price: "$31.04", deltaPct: -4.77 },
];

export const concepts: string[] = [
  "P/E ratio",
  "Market cap",
  "Short selling",
  "ETFs",
  "Yield curve",
];
