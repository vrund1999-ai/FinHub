import { Check } from "lucide-react";

type State = "completed" | "active" | "inactive";

export function StepperItem({
  step,
  title,
  subtitle,
  state,
}: {
  step: number;
  title: string;
  subtitle: string;
  state: State;
}) {
  const isCompleted = state === "completed";
  const isActive = state === "active";
  const isInactive = state === "inactive";

  return (
    <li className="flex items-start gap-3">
      <span
        className={[
          "mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold",
          isCompleted && "bg-[var(--color-accent)] text-white",
          isActive &&
            "bg-[var(--color-accent)] text-white ring-4 ring-[var(--color-accent)]/15",
          isInactive &&
            "border border-[var(--color-border-strong)] bg-transparent text-[var(--color-text-muted)]",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {isCompleted ? <Check size={14} strokeWidth={3} /> : step}
      </span>
      <span className="flex flex-col">
        <span
          className={`text-sm font-semibold ${
            isInactive
              ? "text-[var(--color-text-muted)]"
              : "text-[var(--color-text)]"
          }`}
        >
          {title}
        </span>
        <span className="text-xs text-[var(--color-text-muted)]">
          {subtitle}
        </span>
      </span>
    </li>
  );
}
