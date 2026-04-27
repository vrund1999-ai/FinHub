import type { MarketIndex } from "./data";
import { Sparkline } from "./Sparkline";
import { DeltaText } from "./DeltaText";

export function MarketRow({ row }: { row: MarketIndex }) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3">
      <span className="text-sm text-[var(--color-text)]">{row.name}</span>
      <Sparkline values={row.spark} />
      <span className="text-sm tabular-nums text-[var(--color-text)]">
        {row.value}
      </span>
      <DeltaText value={row.deltaPct} />
    </div>
  );
}
