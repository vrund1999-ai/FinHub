import "server-only";

const FINNHUB_BASE = "https://finnhub.io/api/v1";

export type FinnhubNews = {
  id: string;
  headline: string;
  summary: string;
  url: string;
  source: string;
  image: string | null;
  category: string; // raw finnhub bucket: general | crypto | merger | company
  related: string[]; // tickers parsed from the comma-separated `related` field
  datetime: number; // unix seconds
};

type FinnhubNewsResponse = Array<{
  category?: string;
  datetime?: number;
  headline?: string;
  id?: number;
  image?: string;
  related?: string;
  source?: string;
  summary?: string;
  url?: string;
}>;

function requireKey(): string {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) throw new Error("FINNHUB_API_KEY is not set");
  return key;
}

// Finnhub returns `related` as a comma-separated string that may include
// exchange-prefixed pairs (e.g. 'BINANCE:BTCUSDT'). Keep only clean,
// equity-style symbols, uppercased and deduped.
function parseRelated(related: string | undefined): string[] {
  if (!related) return [];
  const seen = new Set<string>();
  for (const raw of related.split(",")) {
    const symbol = raw.trim().toUpperCase();
    if (/^[A-Z][A-Z.\-]{0,5}$/.test(symbol)) seen.add(symbol);
  }
  return Array.from(seen);
}

function normalizeRows(
  json: FinnhubNewsResponse,
  opts: { fallbackCategory: string; symbol?: string },
): FinnhubNews[] {
  return json
    .filter((r) => r.headline && r.url && r.id != null && r.datetime)
    .map((r) => {
      const related = parseRelated(r.related);
      // company-news rows are about a specific symbol; guarantee it's tagged
      // even when the API's own `related` field is empty or malformed.
      if (opts.symbol) {
        const sym = opts.symbol.toUpperCase();
        if (!related.includes(sym)) related.unshift(sym);
      }
      return {
        id: String(r.id),
        headline: r.headline!.trim(),
        summary: (r.summary ?? "").trim(),
        url: r.url!,
        source: r.source ?? "",
        image: r.image ? r.image : null,
        category: r.category ?? opts.fallbackCategory,
        related,
        datetime: r.datetime!,
      };
    });
}

// Broad market news. Finnhub categories: general | crypto | merger | forex.
// These rarely carry ticker tags — used to populate macro/markets/crypto/M&A.
export async function fetchMarketNews(category: string): Promise<FinnhubNews[]> {
  const token = requireKey();
  const url = `${FINNHUB_BASE}/news?category=${encodeURIComponent(category)}&token=${encodeURIComponent(token)}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Finnhub news fetch failed: ${res.status} ${res.statusText}`);
  }
  return normalizeRows((await res.json()) as FinnhubNewsResponse, {
    fallbackCategory: category,
  });
}

// Company-specific news for a single symbol over [from, to] (YYYY-MM-DD). Every
// row is tagged with the symbol, which is what powers By-ticker and Trending.
export async function fetchCompanyNews(
  symbol: string,
  from: string,
  to: string,
): Promise<FinnhubNews[]> {
  const token = requireKey();
  const url = `${FINNHUB_BASE}/company-news?symbol=${encodeURIComponent(symbol)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&token=${encodeURIComponent(token)}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(
      `Finnhub company-news fetch failed for ${symbol}: ${res.status} ${res.statusText}`,
    );
  }
  return normalizeRows((await res.json()) as FinnhubNewsResponse, {
    fallbackCategory: "company",
    symbol,
  });
}
