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
  newsArticles,
  trendingTickers,
} from "@/components/news/data";
import { getEarningsThisWeek } from "@/lib/earnings/getEarningsThisWeek";
import { getEconomicEventsThisWeek } from "@/lib/economic/getEconomicEventsThisWeek";

export default async function NewsPage() {
  const earningsThisWeek = await getEarningsThisWeek();
  const economicEvents = await getEconomicEventsThisWeek();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader activeNavItem="News" />
      <TickerStrip items={tickerItems} />
      <main className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col gap-4 px-6 py-6">
        <CategoryTabs tabs={NEWS_CATEGORIES} active={DEFAULT_NEWS_CATEGORY} />
        <NewsToolbar sortOptions={SORT_OPTIONS} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-3">
            {newsArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <aside className="flex flex-col gap-6">
            <EarningsThisWeek items={earningsThisWeek} />
            <TrendingTickers items={trendingTickers} />
            <EconomicCalendar items={economicEvents} />
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
