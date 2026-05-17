export function PresetChips({
  presets,
  active,
}: {
  presets: readonly string[];
  active: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {presets.map((preset) => {
          const isActive = preset === active;
          return (
            <button
              key={preset}
              type="button"
              aria-current={isActive ? "true" : undefined}
              className={
                isActive
                  ? "rounded-full bg-[var(--color-accent)] px-3.5 py-1 text-xs font-semibold text-white"
                  : "rounded-full border border-[var(--color-border)] px-3.5 py-1 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]"
              }
            >
              {preset}
            </button>
          );
        })}
      </div>
      <span className="shrink-0 text-[11px] text-[var(--color-text-muted)]">
        Delayed 15 min
      </span>
    </div>
  );
}
