export function OrDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
      <span className="h-px flex-1 bg-[var(--color-border)]" />
      <span>{label}</span>
      <span className="h-px flex-1 bg-[var(--color-border)]" />
    </div>
  );
}
