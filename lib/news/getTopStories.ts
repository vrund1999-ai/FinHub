import "server-only";
import { createClient } from "@/lib/supabase/server";
import type {
  ArticleCategory,
  NewsArticle,
  NewsCategory,
  SortOption,
} from "@/components/news/data";
import { estimateReadTime, formatTimeAgo } from "./format";

export type StoryFilters = {
  view: SortOption; // "Latest" | "Trending" | "By ticker"
  category: NewsCategory; // "All news" filters nothing
  query?: string; // search box text (a symbol when view is "By ticker")
  limit?: number;
};

type Row = {
  id: string;
  category: ArticleCategory;
  headline: string;
  summary: string | null;
  url: string;
  source: string;
  tickers: string[];
  published_at: string;
};

const COLUMNS = "id, category, headline, summary, url, source, tickers, published_at";
const TRENDING_WINDOW_HOURS = 48;
const TRENDING_POOL = 200;

function toArticle(row: Row, now: Date): NewsArticle {
  return {
    id: row.id,
    category: row.category,
    source: row.source,
    timeAgo: formatTimeAgo(row.published_at, now),
    headline: row.headline,
    summary: row.summary ?? undefined,
    tickers: row.tickers,
    readTime: estimateReadTime(row.summary ?? row.headline),
    url: row.url,
  };
}

export async function getTopStories(filters: StoryFilters): Promise<NewsArticle[]> {
  const { view, category, query, limit = 25 } = filters;
  const supabase = await createClient();
  const now = new Date();

  // Trending: rank a recent window by ticker-mention velocity — an article
  // scores by how heavily its tickers are covered across the window.
  if (view === "Trending") {
    const sinceIso = new Date(
      now.getTime() - TRENDING_WINDOW_HOURS * 3_600_000,
    ).toISOString();

    let q = supabase.from("news_articles").select(COLUMNS).gte("published_at", sinceIso);
    if (category !== "All news") q = q.eq("category", category);

    const { data, error } = await q
      .order("published_at", { ascending: false })
      .limit(TRENDING_POOL);
    if (error || !data) return [];

    const rows = data as Row[];
    const counts = new Map<string, number>();
    for (const row of rows) {
      for (const ticker of row.tickers) {
        counts.set(ticker, (counts.get(ticker) ?? 0) + 1);
      }
    }

    return rows
      .map((row, order) => ({
        row,
        order, // rows are already newest-first → stable recency tiebreak
        score: row.tickers.reduce((sum, t) => sum + (counts.get(t) ?? 0), 0),
      }))
      .sort((a, b) => b.score - a.score || a.order - b.order)
      .slice(0, limit)
      .map((s) => toArticle(s.row, now));
  }

  let q = supabase.from("news_articles").select(COLUMNS);
  if (category !== "All news") q = q.eq("category", category);

  if (query) {
    // "By ticker" treats the query as a symbol and filters on the tickers
    // array; otherwise it's a free-text headline search.
    if (view === "By ticker") {
      q = q.contains("tickers", [query.trim().toUpperCase()]);
    } else {
      q = q.ilike("headline", `%${query.trim()}%`);
    }
  }

  const { data, error } = await q
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];

  return (data as Row[]).map((row) => toArticle(row, now));
}
