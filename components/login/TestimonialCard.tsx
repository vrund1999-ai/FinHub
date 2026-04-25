export function TestimonialCard({
  quote,
  initials,
  name,
  meta,
  avatarBg = "#3b4252",
  avatarFg = "#e7e9ee",
}: {
  quote: string;
  initials: string;
  name: string;
  meta: string;
  avatarBg?: string;
  avatarFg?: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)]/60 p-4">
      <p className="font-display text-xs leading-relaxed text-[var(--color-text-muted)] italic">
        {quote}
      </p>
      <div className="mt-3 flex items-center gap-3">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold"
          style={{ backgroundColor: avatarBg, color: avatarFg }}
        >
          {initials}
        </span>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-[var(--color-text)]">
            {name}
          </span>
          <span className="text-[10px] text-[var(--color-text-dim)]">
            {meta}
          </span>
        </div>
      </div>
    </div>
  );
}
