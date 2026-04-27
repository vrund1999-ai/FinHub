import type { TickerItem } from "./data";

function deltaLabel(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function TickerStrip({ items }: { items: TickerItem[] }) {
  return (
    <div className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="mx-auto flex max-w-screen-xl items-center gap-8 overflow-x-auto whitespace-nowrap px-6 py-2.5 text-xs">
        {items.map((item) => {
          const positive = item.deltaPct >= 0;
          return (
            <div key={item.label} className="flex items-center gap-2">
              <span className="font-semibold text-[var(--color-text-muted)]">
                {item.label}
              </span>
              <span className="tabular-nums text-[var(--color-text)]">
                {item.value}
              </span>
              <span
                className="font-medium tabular-nums"
                style={{
                  color: positive
                    ? "var(--color-success)"
                    : "var(--color-danger)",
                }}
              >
                {deltaLabel(item.deltaPct)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
