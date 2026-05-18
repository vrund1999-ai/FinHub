export const CATEGORIES = [
  "Investing basics",
  "Stocks & equities",
  "Bonds & fixed income",
  "Market structure & order types",
  "Financial statements",
  "Ratios & valuation",
  "Macro & monetary policy",
  "Options & derivatives",
  "ETFs & funds",
  "Technical analysis",
  "Corporate actions",
  "Crypto",
  "Behavioral finance",
  "Taxes & retirement",
  "Risk & portfolio management",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const DIFFICULTIES = ["Basic", "Beginner", "Intermediate", "Advanced"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];
