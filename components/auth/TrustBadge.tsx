export function TrustBadge({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
      <span>{label}</span>
    </li>
  );
}
