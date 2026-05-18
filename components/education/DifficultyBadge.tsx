import type { Difficulty } from "./data";

type Variant = "neutral" | "success" | "warning" | "danger";

const variantByDifficulty: Record<Difficulty, Variant> = {
  Basic: "neutral",
  Beginner: "success",
  Intermediate: "warning",
  Advanced: "danger",
};

const variantColors: Record<Variant, string> = {
  neutral: "var(--color-text-muted)",
  success: "var(--color-success)",
  warning: "#fbbf24",
  danger: "var(--color-danger)",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const variant = variantByDifficulty[difficulty];
  const color = variantColors[variant];
  const bg =
    variant === "neutral"
      ? "color-mix(in srgb, var(--color-text-muted) 14%, transparent)"
      : `color-mix(in srgb, ${color} 18%, transparent)`;
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide"
      style={{ backgroundColor: bg, color }}
    >
      {difficulty}
    </span>
  );
}
