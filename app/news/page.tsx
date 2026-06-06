import { SiteHeader } from "@/components/homepage/SiteHeader";
import { TickerStrip } from "@/components/homepage/TickerStrip";
import { SiteFooter } from "@/components/homepage/SiteFooter";
import { tickerItems } from "@/components/homepage/data";
import { CategoryTabs } from "@/components/news/CategoryTabs";
import { NewsToolbar } from "@/components/news/NewsToolbar";
import { ArticleCard } from "@/components/news/ArticleCard";
import { EarningsThisWeek } from "@/components/news/EarningsThisWeek";
import { TrendingTickers } from "@/components/news/TrendingTickers";
import { EconomicCalendar } from "@/components/news/EconomicCalendar";
import {
  NEWS_CATEGORIES,
  DEFAULT_NEWS_CATEGORY,
  SORT_OPTIONS,
  trendingTickers,
  economicCalendar,
  type NewsCategory,
  type SortOption,
} from "@/components/news/data";
import { getEarningsThisWeek } from "@/lib/earnings/getEarningsThisWeek";
import { getTopStories } from "@/lib/news/getTopStories";

function parseView(value: string | undefined): SortOption {
  return (SORT_OPTIONS as readonly string[]).includes(value ?? "")
    ? (value as SortOption)
    : "Latest";
}

function parseCategory(value: string | undefined): NewsCategory {
  return (NEWS_CATEGORIES as readonly string[]).includes(value ?? "")
    ? (value as NewsCategory)
    : DEFAULT_NEWS_CATEGORY;
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; category?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const view = parseView(sp.view);
  const category = parseCategory(sp.category);
  const query = sp.q?.trim() || undefined;

  const [articles, earningsThisWeek] = await Promise.all([
    getTopStories({ view, category, query }),
    getEarningsThisWeek(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader activeNavItem="News" />
      <TickerStrip items={tickerItems} />
      <main className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col gap-4 px-6 py-6">
        <CategoryTabs tabs={NEWS_CATEGORIES} active={category} params={{ view, q: query }} />
        <NewsToolbar
          sortOptions={SORT_OPTIONS}
          activeView={view}
          params={{ category, q: query }}
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-3">
            {articles.length > 0 ? (
              articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            ) : (
              <p className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center text-sm text-[var(--color-text-muted)]">
                No stories match these filters yet. Check back soon.
              </p>
            )}
          </div>
          <aside className="flex flex-col gap-6">
            <EarningsThisWeek items={earningsThisWeek} />
            <TrendingTickers items={trendingTickers} />
            <EconomicCalendar items={economicCalendar} />
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
