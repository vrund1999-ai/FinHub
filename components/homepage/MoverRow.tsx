import type { Mover } from "./data";
import { DeltaText } from "./DeltaText";

export function MoverRow({ mover }: { mover: Mover }) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
      <span className="text-sm font-semibold text-[var(--color-accent)]">
        {mover.symbol}
      </span>
      <span className="text-sm tabular-nums text-[var(--color-text)]">
        {mover.price}
      </span>
      <DeltaText value={mover.deltaPct} />
    </div>
  );
}
