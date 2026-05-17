export type FeaturedIndex = {
  name: string;
  value: string;
  delta: string;
  deltaPct: number;
  asOf: string;
  currency: string;
  series: number[];
  xLabels: string[];
};

export type GlobalIndexRow = {
  name: string;
  country: string;
  last: string;
  chg: string;
  deltaPct: number;
  low52: number;
  high52: number;
  current52: number;
};

export type Sector = {
  name: string;
  deltaPct: number;
};

export type Mover = {
  symbol: string;
  name: string;
  deltaPct: number;
};

export type MarketNewsCategory = "EARNINGS" | "FED" | "MACRO";

export type MarketNewsItem = {
  category: MarketNewsCategory;
  headline: string;
  source: string;
  timeAgo: string;
};

export const INDEX_TABS = ["S&P 500", "NASDAQ", "DJIA", "Russell 2K", "VIX"] as const;
export const TIME_RANGES = ["1D", "1W", "1M", "3M", "1Y", "5Y"] as const;
export const DEFAULT_INDEX_TAB = "S&P 500";
export const DEFAULT_TIME_RANGE = "1W";

export const featuredIndices: Record<string, FeaturedIndex> = {
  "S&P 500": {
    name: "S&P 500",
    value: "5,312.48",
    delta: "+32.80",
    deltaPct: 0.62,
    asOf: "Apr 24, 2026",
    currency: "USD",
    series: [5180, 5205, 5198, 5232, 5248, 5270, 5258, 5285, 5290, 5278, 5300, 5312],
    xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
  NASDAQ: {
    name: "NASDAQ",
    value: "18,764.20",
    delta: "-26.44",
    deltaPct: -0.14,
    asOf: "Apr 24, 2026",
    currency: "USD",
    series: [18800, 18820, 18790, 18810, 18770, 18750, 18780, 18760, 18745, 18768, 18772, 18764],
    xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
  DJIA: {
    name: "DJIA",
    value: "39,887.11",
    delta: "+122.30",
    deltaPct: 0.31,
    asOf: "Apr 24, 2026",
    currency: "USD",
    series: [39700, 39750, 39730, 39780, 39810, 39830, 39860, 39845, 39870, 39880, 39875, 39887],
    xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
  "Russell 2K": {
    name: "Russell 2K",
    value: "2,043.16",
    delta: "+8.40",
    deltaPct: 0.41,
    asOf: "Apr 24, 2026",
    currency: "USD",
    series: [2020, 2025, 2018, 2032, 2028, 2036, 2040, 2034, 2042, 2038, 2045, 2043],
    xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
  VIX: {
    name: "VIX",
    value: "14.82",
    delta: "+0.18",
    deltaPct: 1.2,
    asOf: "Apr 24, 2026",
    currency: "USD",
    series: [14.5, 14.6, 14.4, 14.7, 14.8, 14.65, 14.72, 14.78, 14.7, 14.82, 14.85, 14.82],
    xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
};

export const globalIndices: GlobalIndexRow[] = [
  {
    name: "S&P 500",
    country: "United States",
    last: "5,312.48",
    chg: "+32.80",
    deltaPct: 0.62,
    low52: 4103,
    high52: 5669,
    current52: 5312,
  },
  {
    name: "NASDAQ",
    country: "United States",
    last: "18,764",
    chg: "-26.44",
    deltaPct: -0.14,
    low52: 12543,
    high52: 20173,
    current52: 18764,
  },
  {
    name: "FTSE 100",
    country: "United Kingdom",
    last: "8,214.55",
    chg: "+41.20",
    deltaPct: 0.5,
    low52: 7402,
    high52: 8474,
    current52: 8214,
  },
  {
    name: "Nikkei 225",
    country: "Japan",
    last: "38,920",
    chg: "-112.40",
    deltaPct: -0.29,
    low52: 30487,
    high52: 42224,
    current52: 38920,
  },
  {
    name: "DAX",
    country: "Germany",
    last: "18,503",
    chg: "+88.34",
    deltaPct: 0.48,
    low52: 14458,
    high52: 19048,
    current52: 18503,
  },
];

export const sectors: Sector[] = [
  { name: "Tech", deltaPct: 1.84 },
  { name: "Health", deltaPct: 0.93 },
  { name: "Energy", deltaPct: -0.31 },
  { name: "Financials", deltaPct: 0.44 },
  { name: "Utilities", deltaPct: -0.77 },
  { name: "Cons Disc", deltaPct: 0.62 },
  { name: "Materials", deltaPct: -0.18 },
  { name: "Industrials", deltaPct: 0.37 },
  { name: "Real Est", deltaPct: -1.22 },
  { name: "Staples", deltaPct: -0.02 },
];

export const topGainers: Mover[] = [
  { symbol: "NVDA", name: "Nvidia", deltaPct: 6.42 },
  { symbol: "META", name: "Meta", deltaPct: 3.18 },
  { symbol: "PLTR", name: "Palantir", deltaPct: 2.91 },
  { symbol: "AMD", name: "AMD", deltaPct: 2.44 },
];

export const topLosers: Mover[] = [
  { symbol: "INTC", name: "Intel", deltaPct: -4.77 },
  { symbol: "PFE", name: "Pfizer", deltaPct: -3.02 },
  { symbol: "BA", name: "Boeing", deltaPct: -2.55 },
  { symbol: "DIS", name: "Disney", deltaPct: -1.88 },
];

export const marketNews: MarketNewsItem[] = [
  {
    category: "EARNINGS",
    headline: "Nvidia beats on data center revenue surge",
    source: "Reuters",
    timeAgo: "14m ago",
  },
  {
    category: "FED",
    headline: "Powell signals patience on rate cuts",
    source: "Bloomberg",
    timeAgo: "1h ago",
  },
  {
    category: "MACRO",
    headline: "Jobs report shows labor market cooling",
    source: "WSJ",
    timeAgo: "3h ago",
  },
];
