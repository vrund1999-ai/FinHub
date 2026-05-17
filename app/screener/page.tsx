import { SiteHeader } from "@/components/homepage/SiteHeader";
import { TickerStrip } from "@/components/homepage/TickerStrip";
import { SiteFooter } from "@/components/homepage/SiteFooter";
import { tickerItems } from "@/components/homepage/data";
import { AssetClassTabs } from "@/components/screener/AssetClassTabs";
import { PresetChips } from "@/components/screener/PresetChips";
import { FilterSidebar } from "@/components/screener/FilterSidebar";
import { ResultsToolbar } from "@/components/screener/ResultsToolbar";
import { StockTable } from "@/components/screener/StockTable";
import { Pagination } from "@/components/screener/Pagination";
import {
  ASSET_CLASS_TABS,
  DEFAULT_ASSET_CLASS,
  PRESET_FILTERS,
  DEFAULT_PRESET,
  SECTORS,
  DEFAULT_SELECTED_SECTORS,
  EXCHANGES,
  COUNTRIES,
  PERFORMANCE_OPTIONS,
  screenerStocks,
} from "@/components/screener/data";

export default function ScreenerPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader activeNavItem="Screener" />
      <TickerStrip items={tickerItems} />
      <main className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col gap-4 px-6 py-6">
        <AssetClassTabs tabs={ASSET_CLASS_TABS} active={DEFAULT_ASSET_CLASS} />
        <PresetChips presets={PRESET_FILTERS} active={DEFAULT_PRESET} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <FilterSidebar
            sectors={SECTORS}
            selectedSectors={DEFAULT_SELECTED_SECTORS}
            exchanges={EXCHANGES}
            countries={COUNTRIES}
            performanceOptions={PERFORMANCE_OPTIONS}
          />
          <div className="flex flex-col gap-4">
            <ResultsToolbar totalResults={847} showing={10} />
            <StockTable rows={screenerStocks} />
            <Pagination currentPage={1} totalPages={85} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
