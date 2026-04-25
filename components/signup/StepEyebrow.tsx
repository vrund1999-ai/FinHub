export function StepEyebrow({
  step,
  title,
}: {
  step: 1 | 2 | 3;
  title?: string;
}) {
  const base = `STEP ${step} OF 3`;
  return (
    <p className="text-xs font-semibold tracking-[0.12em] text-[var(--color-accent)] uppercase">
      {title ? `${base} — ${title}` : base}
    </p>
  );
}
