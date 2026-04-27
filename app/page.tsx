import { SiteHeader } from "@/components/homepage/SiteHeader";
import { TickerStrip } from "@/components/homepage/TickerStrip";
import { Hero } from "@/components/homepage/Hero";
import { DashboardGrid } from "@/components/homepage/DashboardGrid";
import { MarketsCard } from "@/components/homepage/MarketsCard";
import { NewsCard } from "@/components/homepage/NewsCard";
import { MoversCard } from "@/components/homepage/MoversCard";
import { SiteFooter } from "@/components/homepage/SiteFooter";
import {
  tickerItems,
  marketIndices,
  newsArticles,
  topMovers,
  concepts,
} from "@/components/homepage/data";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <TickerStrip items={tickerItems} />
      <main className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col gap-12 px-6 py-12">
        <Hero />
        <DashboardGrid>
          <MarketsCard rows={marketIndices} />
          <NewsCard items={newsArticles} />
          <MoversCard movers={topMovers} concepts={concepts} />
        </DashboardGrid>
      </main>
      <SiteFooter />
    </div>
  );
}
