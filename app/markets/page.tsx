import { SiteHeader } from "@/components/homepage/SiteHeader";
import { TickerStrip } from "@/components/homepage/TickerStrip";
import { SiteFooter } from "@/components/homepage/SiteFooter";
import { tickerItems } from "@/components/homepage/data";
import { IndexTabs } from "@/components/markets/IndexTabs";
import { FeaturedIndexPanel } from "@/components/markets/FeaturedIndexPanel";
import { GlobalIndicesTable } from "@/components/markets/GlobalIndicesTable";
import { SectorHeatmap } from "@/components/markets/SectorHeatmap";
import { MoversList } from "@/components/markets/MoversList";
import { MarketNewsCard } from "@/components/markets/MarketNewsCard";
import {
  INDEX_TABS,
  DEFAULT_INDEX_TAB,
  featuredIndices,
  globalIndices,
  sectors,
  topGainers,
  topLosers,
  marketNews,
} from "@/components/markets/data";

export default function MarketsPage() {
  const featured = featuredIndices[DEFAULT_INDEX_TAB];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader activeNavItem="Markets" />
      <TickerStrip items={tickerItems} />
      <main className="mx-auto grid w-full max-w-screen-xl flex-1 grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <IndexTabs tabs={INDEX_TABS} active={DEFAULT_INDEX_TAB} />
          <FeaturedIndexPanel index={featured} />
          <GlobalIndicesTable rows={globalIndices} />
          <SectorHeatmap sectors={sectors} />
        </div>
        <aside className="flex flex-col gap-6">
          <MoversList
            title="TOP GAINERS"
            items={topGainers}
            footerLabel="Screener"
            footerHref="/screener"
          />
          <MoversList title="TOP LOSERS" items={topLosers} />
          <MarketNewsCard items={marketNews} />
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}
