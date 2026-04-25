export function ProgressBar({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
      <div
        className="h-full rounded-full bg-[var(--color-accent)] transition-[width]"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
