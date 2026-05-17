export function TickerChip({ symbol }: { symbol: string }) {
  return (
    <span className="rounded border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">
      {symbol}
    </span>
  );
}
