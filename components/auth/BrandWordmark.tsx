type Size = "sm" | "md" | "lg";

const sizeClasses: Record<Size, string> = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-3xl",
};

export function BrandWordmark({ size = "lg" }: { size?: Size }) {
  return (
    <span
      className={`font-display font-semibold tracking-tight ${sizeClasses[size]}`}
    >
      <span className="text-[var(--color-text)]">Fin</span>
      <span className="text-[var(--color-accent)]">Hub</span>
    </span>
  );
}
