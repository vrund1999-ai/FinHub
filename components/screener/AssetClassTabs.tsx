export function AssetClassTabs({
  tabs,
  active,
}: {
  tabs: readonly string[];
  active: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {tabs.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            type="button"
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "rounded-md bg-[var(--color-accent)] px-4 py-1.5 text-sm font-semibold text-white"
                : "rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1.5 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]"
            }
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
