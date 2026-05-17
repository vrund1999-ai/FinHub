import type { TrendingTickerRow } from "./data";
import { DeltaText } from "@/components/homepage/DeltaText";

export function TrendingTickers({ items }: { items: TrendingTickerRow[] }) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
        TRENDING TICKERS
      </h2>
      <ul className="flex flex-col">
        {items.map((row, i) => (
          <li
            key={row.symbol}
            className={
              i === 0
                ? "grid grid-cols-[auto_auto_1fr_auto_auto] items-center gap-3 py-2"
                : "grid grid-cols-[auto_auto_1fr_auto_auto] items-center gap-3 border-t border-[var(--color-border)] py-2"
            }
          >
            <span className="w-3 text-xs font-medium text-[var(--color-text-dim)]">
              {row.rank}
            </span>
            <span className="text-xs font-semibold tracking-wide text-[var(--color-accent)]">
              {row.symbol}
            </span>
            <span className="truncate text-sm text-[var(--color-text)]">
              {row.name}
            </span>
            <DeltaText value={row.deltaPct} />
            <span className="text-[11px] text-[var(--color-text-muted)]">
              {row.articleCount} articles
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
