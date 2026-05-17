export function IndexTabs({
  tabs,
  active,
}: {
  tabs: readonly string[];
  active: string;
}) {
  return (
    <div className="flex items-center gap-6 border-b border-[var(--color-border)]">
      {tabs.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            type="button"
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "-mb-px border-b-2 border-[var(--color-accent)] pb-3 text-sm font-semibold text-[var(--color-accent)]"
                : "-mb-px border-b-2 border-transparent pb-3 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
            }
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
