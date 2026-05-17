import type { FeaturedIndex } from "./data";
import { TIME_RANGES, DEFAULT_TIME_RANGE } from "./data";
import { MiniChart } from "./MiniChart";
import { TimeRangeButtons } from "./TimeRangeButtons";

export function FeaturedIndexPanel({ index }: { index: FeaturedIndex }) {
  const positive = index.deltaPct >= 0;
  const deltaColor = positive ? "var(--color-success)" : "var(--color-danger)";
  const sign = positive ? "+" : "";

  return (
    <section className="flex flex-col gap-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-4">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">
            {index.name}
          </h2>
          <span className="text-3xl font-semibold tabular-nums text-[var(--color-text)]">
            {index.value}
          </span>
        </div>
        <div
          className="text-sm font-medium tabular-nums"
          style={{ color: deltaColor }}
        >
          {index.delta} ({sign}
          {index.deltaPct.toFixed(2)}%)
        </div>
      </div>

      <p className="text-xs text-[var(--color-text-muted)]">
        {index.asOf} · Delayed 15 min · {index.currency}
      </p>

      <MiniChart series={index.series} xLabels={index.xLabels} />

      <TimeRangeButtons ranges={TIME_RANGES} active={DEFAULT_TIME_RANGE} />
    </section>
  );
}
