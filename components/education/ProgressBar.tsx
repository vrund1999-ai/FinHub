export function ProgressBar({
  pct,
  color,
}: {
  pct: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 w-20 overflow-hidden rounded-full bg-[var(--color-border)]">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] tabular-nums" style={{ color }}>
        {pct}%
      </span>
    </div>
  );
}
