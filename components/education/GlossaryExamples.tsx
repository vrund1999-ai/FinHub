export function GlossaryExamples({
  examples,
}: {
  examples: { title: string; body: string }[];
}) {
  if (examples.length === 0) return null;
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
        EXAMPLES
      </h2>
      <ul className="flex flex-col gap-3">
        {examples.map((ex, i) => (
          <li
            key={i}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4"
          >
            <div className="text-sm font-semibold text-[var(--color-text)]">
              {ex.title}
            </div>
            <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
              {ex.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
