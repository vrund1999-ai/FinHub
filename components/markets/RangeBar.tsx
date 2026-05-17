export function RangeBar({
  low,
  high,
  current,
}: {
  low: number;
  high: number;
  current: number;
}) {
  const range = high - low || 1;
  const clamped = Math.min(Math.max(current, low), high);
  const pct = ((clamped - low) / range) * 100;

  return (
    <div className="flex items-center gap-2 text-[11px] tabular-nums text-[var(--color-text-muted)]">
      <span>{low.toLocaleString()}</span>
      <div className="relative h-px flex-1 bg-[var(--color-border-strong)]">
        <span
          className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)]"
          style={{ left: `${pct}%` }}
          aria-hidden="true"
        />
      </div>
      <span>{high.toLocaleString()}</span>
    </div>
  );
}
