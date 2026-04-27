export function ConceptPill({
  label,
  href = "#",
}: {
  label: string;
  href?: string;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-1 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]"
    >
      {label}
    </a>
  );
}
