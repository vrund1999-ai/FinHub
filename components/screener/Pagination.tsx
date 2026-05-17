export function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const pageButtons = [1, 2, 3];
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-[var(--color-text-muted)]">
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className="rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]"
        >
          ← Prev
        </button>
        {pageButtons.map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "min-w-[32px] rounded-md bg-[var(--color-accent)] px-2.5 py-1.5 text-xs font-semibold text-white"
                  : "min-w-[32px] rounded-md border border-[var(--color-border)] px-2.5 py-1.5 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]"
              }
            >
              {page}
            </button>
          );
        })}
        <button
          type="button"
          className="rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
