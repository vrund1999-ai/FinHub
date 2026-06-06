import "server-only";
import type { ArticleCategory } from "@/components/news/data";

// Keyword → category rules, evaluated in order (most specific first). The first
// matching rule wins; anything unmatched falls back to "Markets". Mirrors the
// whitelist style of the economic-calendar classifier, but always resolves a
// category since news_articles.category is NOT NULL with a CHECK constraint.
const RULES: Array<{
  category: ArticleCategory;
  finnhub?: string;
  keywords: string[];
}> = [
  {
    category: "Crypto",
    finnhub: "crypto",
    keywords: ["crypto", "bitcoin", "ethereum", "blockchain", "stablecoin", "coinbase", " btc ", " eth ", "binance"],
  },
  {
    category: "M&A",
    finnhub: "merger",
    keywords: ["acquire", "acquisition", "merger", "takeover", "buyout", "to buy", "deal to buy"],
  },
  {
    category: "IPOs",
    keywords: ["ipo", "initial public offering", "goes public", "public offering", "stock market debut", "to go public"],
  },
  {
    category: "Earnings",
    keywords: ["earnings", "quarterly results", "beats estimates", "misses estimates", "tops estimates", "guidance", "revenue", " eps ", "per share"],
  },
  {
    category: "Fed & rates",
    keywords: ["federal reserve", "the fed", "powell", "fomc", "rate cut", "rate hike", "interest rate", "monetary policy", "treasury yield", "basis points"],
  },
  {
    category: "Macro",
    keywords: ["inflation", "cpi", "consumer price", "ppi", "producer price", "gdp", "jobs report", "payrolls", "unemployment", "labor market", "recession", "retail sales"],
  },
  {
    category: "Technology",
    keywords: ["artificial intelligence", " ai ", "chip", "semiconductor", "software", "cloud", "data center", "nvidia", "openai", "smartphone"],
  },
];

export function classifyArticle(article: {
  headline: string;
  summary: string;
  category: string;
}): ArticleCategory {
  const text = ` ${article.headline} ${article.summary} `.toLowerCase();
  const bucket = article.category.toLowerCase();
  for (const rule of RULES) {
    if (rule.finnhub && bucket === rule.finnhub) return rule.category;
    if (rule.keywords.some((k) => text.includes(k))) return rule.category;
  }
  return "Markets";
}
