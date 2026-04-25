export function FeatureBullet({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <li className="flex gap-3">
      <span className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/15">
        <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
      </span>
      <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
        <span className="font-semibold text-[var(--color-text)]">{title}</span>{" "}
        — {description}
      </p>
    </li>
  );
}
