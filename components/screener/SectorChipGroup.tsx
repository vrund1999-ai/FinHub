export function SectorChipGroup({
  sectors,
  selected,
}: {
  sectors: readonly string[];
  selected: readonly string[];
}) {
  const selectedSet = new Set(selected);
  return (
    <div className="flex flex-wrap gap-1.5">
      {sectors.map((sector) => {
        const isSelected = selectedSet.has(sector);
        return (
          <button
            key={sector}
            type="button"
            aria-pressed={isSelected}
            className={
              isSelected
                ? "rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-semibold text-white"
                : "rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]"
            }
          >
            {sector}
          </button>
        );
      })}
    </div>
  );
}
