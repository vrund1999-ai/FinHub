export function MinMaxRow({
  label,
  defaultMin,
  defaultMax,
}: {
  label: string;
  defaultMin?: string;
  defaultMax?: string;
}) {
  return (
    <div className="grid grid-cols-[80px_1fr_1fr] items-center gap-2">
      <span className="text-xs text-[var(--color-text-muted)]">{label}</span>
      <input
        type="text"
        defaultValue={defaultMin ?? ""}
        placeholder="Min"
        className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 py-1.5 text-xs text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
      />
      <input
        type="text"
        defaultValue={defaultMax ?? ""}
        placeholder="Max"
        className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 py-1.5 text-xs text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
      />
    </div>
  );
}
