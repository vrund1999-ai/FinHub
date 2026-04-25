import type { ReactNode } from "react";

export function ExperienceCard({
  icon,
  title,
  description,
  selected,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors ${
        selected
          ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
          : "border-[var(--color-border)] bg-[var(--color-surface-2)] hover:border-[var(--color-border-strong)]"
      }`}
    >
      <span
        className={`${
          selected
            ? "text-[var(--color-accent)]"
            : "text-[var(--color-text-muted)]"
        }`}
      >
        {icon}
      </span>
      <span
        className={`text-sm font-semibold ${
          selected ? "text-[var(--color-accent)]" : "text-[var(--color-text)]"
        }`}
      >
        {title}
      </span>
      <span className="text-xs leading-relaxed text-[var(--color-text-muted)]">
        {description}
      </span>
    </button>
  );
}
