import type { Sector } from "./data";

function tintFor(deltaPct: number): string {
  const magnitude = Math.min(Math.abs(deltaPct) / 2, 1);
  const alpha = 12 + magnitude * 22;
  const base = deltaPct >= 0 ? "var(--color-success)" : "var(--color-danger)";
  return `color-mix(in oklab, ${base} ${alpha.toFixed(0)}%, transparent)`;
}

export function SectorHeatmap({ sectors }: { sectors: Sector[] }) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
          S&amp;P 500 SECTOR HEATMAP
        </h2>
        <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-muted)]">
          <span className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ background: "var(--color-success)", opacity: 0.6 }}
              aria-hidden="true"
            />
            Gain
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ background: "var(--color-danger)", opacity: 0.6 }}
              aria-hidden="true"
            />
            Loss
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
        {sectors.map((sector) => {
          const positive = sector.deltaPct >= 0;
          const sign = positive ? "+" : "";
          return (
            <div
              key={sector.name}
              className="rounded-md border border-[var(--color-border)] px-3 py-2.5"
              style={{ background: tintFor(sector.deltaPct) }}
            >
              <div className="text-sm font-medium text-[var(--color-text)]">
                {sector.name}
              </div>
              <div className="text-xs tabular-nums text-[var(--color-text-muted)]">
                {sign}
                {sector.deltaPct.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
