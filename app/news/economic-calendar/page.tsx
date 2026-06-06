import { SiteHeader } from "@/components/homepage/SiteHeader";
import { SiteFooter } from "@/components/homepage/SiteFooter";
import { TickerStrip } from "@/components/homepage/TickerStrip";
import { tickerItems } from "@/components/homepage/data";
import { getAllEconomicEvents } from "@/lib/economic/getAllEconomicEvents";
import { EconomicCalendarView } from "@/components/news/economic-calendar/EconomicCalendarView";

export default async function EconomicCalendarPage() {
  const rows = await getAllEconomicEvents();
  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader activeNavItem="News" />
      <TickerStrip items={tickerItems} />
      <main className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col gap-6 px-6 py-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">
            Economic calendar
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Browse upcoming and past US economic releases. Click any date to see
            what reports, with links to where each is published.
          </p>
        </header>
        <EconomicCalendarView rows={rows} todayIso={todayIso} />
      </main>
      <SiteFooter />
    </div>
  );
}
