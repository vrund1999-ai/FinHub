export type ScreenerStock = {
  symbol: string;
  name: string;
  price: string;
  chgPct: number;
  mktCap: string;
  peRatio: string;
  eps: string;
  revGrowthPct: number;
  volume: string;
  favorited: boolean;
};

export type SelectOption = { value: string; label: string };

export const ASSET_CLASS_TABS = ["Equities", "ETFs", "Crypto"] as const;
export type AssetClass = (typeof ASSET_CLASS_TABS)[number];
export const DEFAULT_ASSET_CLASS: AssetClass = "Equities";

export const PRESET_FILTERS = [
  "All",
  "Top gainers",
  "Top losers",
  "High volume",
  "Value picks",
  "Dividend",
] as const;
export type PresetFilter = (typeof PRESET_FILTERS)[number];
export const DEFAULT_PRESET: PresetFilter = "All";

export const SECTORS = [
  "Technology",
  "Healthcare",
  "Financials",
  "Energy",
  "Industrials",
  "Cons. Disc.",
  "Utilities",
  "Real Estate",
  "Materials",
] as const;
export type Sector = (typeof SECTORS)[number];
export const DEFAULT_SELECTED_SECTORS: readonly Sector[] = [
  "Technology",
  "Healthcare",
];

export const EXCHANGES: SelectOption[] = [
  { value: "all", label: "All exchanges" },
  { value: "nyse", label: "NYSE" },
  { value: "nasdaq", label: "NASDAQ" },
  { value: "amex", label: "AMEX" },
  { value: "lse", label: "LSE" },
  { value: "tse", label: "TSE" },
];

export const COUNTRIES: SelectOption[] = [
  { value: "all", label: "All countries" },
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "jp", label: "Japan" },
  { value: "de", label: "Germany" },
  { value: "ca", label: "Canada" },
];

export const PERFORMANCE_OPTIONS: SelectOption[] = [
  { value: "above-50", label: "Above 50% mark" },
  { value: "below-50", label: "Below 50% mark" },
  { value: "near-high", label: "Near 52W high" },
  { value: "near-low", label: "Near 52W low" },
  { value: "any", label: "Any" },
];

export const screenerStocks: ScreenerStock[] = [
  {
    symbol: "NVDA",
    name: "Nvidia Corp.",
    price: "$887.42",
    chgPct: 6.42,
    mktCap: "$2.18T",
    peRatio: "34.2",
    eps: "$26.10",
    revGrowthPct: 122,
    volume: "48.2M",
    favorited: true,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: "$415.08",
    chgPct: 0.82,
    mktCap: "$3.09T",
    peRatio: "35.8",
    eps: "$11.40",
    revGrowthPct: 17,
    volume: "22.1M",
    favorited: true,
  },
  {
    symbol: "GOOG",
    name: "Alphabet Inc.",
    price: "$178.91",
    chgPct: 1.24,
    mktCap: "$2.21T",
    peRatio: "22.4",
    eps: "$7.92",
    revGrowthPct: 15,
    volume: "18.4M",
    favorited: true,
  },
  {
    symbol: "META",
    name: "Meta Platforms",
    price: "$514.66",
    chgPct: 3.18,
    mktCap: "$1.31T",
    peRatio: "27.5",
    eps: "$18.74",
    revGrowthPct: 27,
    volume: "14.9M",
    favorited: true,
  },
  {
    symbol: "LLY",
    name: "Eli Lilly & Co.",
    price: "$791.20",
    chgPct: -1.62,
    mktCap: "$753B",
    peRatio: "58.3",
    eps: "$13.58",
    revGrowthPct: 52,
    volume: "3.8M",
    favorited: true,
  },
  {
    symbol: "UNH",
    name: "UnitedHealth Group",
    price: "$491.04",
    chgPct: -0.41,
    mktCap: "$454B",
    peRatio: "20.2",
    eps: "$24.30",
    revGrowthPct: 8,
    volume: "2.6M",
    favorited: true,
  },
  {
    symbol: "AMZN",
    name: "Amazon Inc.",
    price: "$188.27",
    chgPct: -1.72,
    mktCap: "$1.97T",
    peRatio: "40.1",
    eps: "$4.69",
    revGrowthPct: 13,
    volume: "31.5M",
    favorited: true,
  },
  {
    symbol: "ISRG",
    name: "Intuitive Surgical",
    price: "$416.55",
    chgPct: 0.91,
    mktCap: "$147B",
    peRatio: "61.2",
    eps: "$6.80",
    revGrowthPct: 14,
    volume: "1.2M",
    favorited: true,
  },
  {
    symbol: "ADBE",
    name: "Adobe Inc.",
    price: "$464.18",
    chgPct: 0.55,
    mktCap: "$209B",
    peRatio: "28.7",
    eps: "$16.18",
    revGrowthPct: 11,
    volume: "4.1M",
    favorited: true,
  },
  {
    symbol: "ABBV",
    name: "AbbVie Inc.",
    price: "$168.35",
    chgPct: 0.31,
    mktCap: "$297B",
    peRatio: "18.1",
    eps: "$9.30",
    revGrowthPct: 6,
    volume: "5.7M",
    favorited: true,
  },
];
