type Variant = "neutral" | "success" | "danger" | "warning";

const variantColors: Record<Variant, { color: string }> = {
  neutral: { color: "var(--color-text-muted)" },
  success: { color: "var(--color-success)" },
  danger: { color: "var(--color-danger)" },
  warning: { color: "#fbbf24" },
};

export function StatusBadge({
  label,
  variant,
}: {
  label: string;
  variant: Variant;
}) {
  const { color } = variantColors[variant];
  const bg =
    variant === "neutral"
      ? "color-mix(in srgb, var(--color-text-muted) 14%, transparent)"
      : `color-mix(in srgb, ${color} 18%, transparent)`;
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide"
      style={{ backgroundColor: bg, color }}
    >
      {label}
    </span>
  );
}
