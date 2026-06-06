import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  fetchCompanyNews,
  fetchMarketNews,
  type FinnhubNews,
} from "@/lib/news/finnhub";
import { classifyArticle } from "@/lib/news/classify";
import { isLikelyEnglish } from "@/lib/news/language";
import type { ArticleCategory } from "@/components/news/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Broad market buckets (rarely ticker-tagged) for macro/markets/crypto/M&A.
const CATEGORIES = ["general", "crypto", "merger"];

// Watchlist of liquid names whose company-news is fetched to give real ticker
// coverage (powers By-ticker + Trending) and company-specific earnings/tech
// stories. Curated, like the economic-calendar release whitelist.
const WATCHLIST = [
  "AAPL", "MSFT", "NVDA", "GOOGL", "AMZN", "META", "TSLA", "AMD", "INTC", "AVGO",
  "ORCL", "CRM", "ADBE", "NFLX", "JPM", "BAC", "GS", "V", "MA", "DIS",
  "BA", "XOM", "WMT", "UNH", "PFE", "COIN", "MSTR", "SPY", "QQQ", "BRK.B",
];

const COMPANY_NEWS_DAYS = 3;
const PER_SYMBOL = 6; // freshest N per symbol — caps volume + noise
const FETCH_CHUNK = 6; // company-news calls per batch (Finnhub rate limit)
const PRUNE_AFTER_DAYS = 30;

type Row = {
  id: string;
  category: ArticleCategory;
  headline: string;
  summary: string | null;
  url: string;
  source: string;
  image_url: string | null;
  tickers: string[];
  published_at: string;
  fetched_at: string;
};

function authorize(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function GET(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const now = new Date();

  // 1. Broad market news.
  let market: FinnhubNews[];
  try {
    market = (await Promise.all(CATEGORIES.map((c) => fetchMarketNews(c)))).flat();
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }

  // 2. Company news per watchlist symbol — chunked for the rate limit and
  // resilient (a failing symbol contributes nothing rather than failing the run).
  const to = isoDate(now);
  const from = isoDate(new Date(now.getTime() - COMPANY_NEWS_DAYS * 86_400_000));
  const company: FinnhubNews[] = [];
  for (let i = 0; i < WATCHLIST.length; i += FETCH_CHUNK) {
    const slice = WATCHLIST.slice(i, i + FETCH_CHUNK);
    const batches = await Promise.all(
      slice.map((s) =>
        fetchCompanyNews(s, from, to).catch(() => [] as FinnhubNews[]),
      ),
    );
    for (const batch of batches) {
      company.push(
        ...batch.sort((a, b) => b.datetime - a.datetime).slice(0, PER_SYMBOL),
      );
    }
  }

  // 3. Merge, drop non-English, dedupe on id (merging tickers when the same
  // story surfaced under multiple symbols) so a single upsert never self-conflicts.
  const fetchedAt = now.toISOString();
  const byId = new Map<string, Row>();
  for (const a of [...market, ...company]) {
    if (!isLikelyEnglish(a.headline, a.summary)) continue;
    const id = `finnhub-${a.id}`;
    const existing = byId.get(id);
    if (existing) {
      existing.tickers = Array.from(new Set([...existing.tickers, ...a.related]));
      continue;
    }
    byId.set(id, {
      id,
      category: classifyArticle(a),
      headline: a.headline,
      summary: a.summary || null,
      url: a.url,
      source: a.source,
      image_url: a.image,
      tickers: a.related,
      published_at: new Date(a.datetime * 1000).toISOString(),
      fetched_at: fetchedAt,
    });
  }
  const rows = Array.from(byId.values());

  const supabase = createAdminClient();

  if (rows.length > 0) {
    const { error } = await supabase
      .from("news_articles")
      .upsert(rows, { onConflict: "id" });
    if (error) {
      return NextResponse.json(
        { ok: false, error: `news_articles upsert failed: ${error.message}` },
        { status: 500 },
      );
    }
  }

  // Keep the table (and the trending window) bounded.
  const cutoff = new Date(
    now.getTime() - PRUNE_AFTER_DAYS * 86_400_000,
  ).toISOString();
  const { error: pruneError } = await supabase
    .from("news_articles")
    .delete()
    .lt("published_at", cutoff);
  if (pruneError) {
    return NextResponse.json(
      { ok: false, error: `news_articles prune failed: ${pruneError.message}` },
      { status: 500 },
    );
  }

  const tickered = rows.filter((r) => r.tickers.length > 0).length;
  return NextResponse.json({ ok: true, fetched: rows.length, tickered });
}
