export function TimeRangeButtons({
  ranges,
  active,
}: {
  ranges: readonly string[];
  active: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {ranges.map((range) => {
        const isActive = range === active;
        return (
          <button
            key={range}
            type="button"
            aria-pressed={isActive}
            className={
              isActive
                ? "rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-4 py-1.5 text-xs font-semibold text-[var(--color-text)]"
                : "rounded-md border border-[var(--color-border)] bg-transparent px-4 py-1.5 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
            }
          >
            {range}
          </button>
        );
      })}
    </div>
  );
}
