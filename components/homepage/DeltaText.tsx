export function DeltaText({
  value,
  suffix = "%",
}: {
  value: number;
  suffix?: string;
}) {
  const isPositive = value >= 0;
  const sign = isPositive ? "+" : "";
  const color = isPositive
    ? "var(--color-success)"
    : "var(--color-danger)";
  return (
    <span
      className="text-xs font-medium tabular-nums"
      style={{ color }}
    >
      {sign}
      {value.toFixed(2)}
      {suffix}
    </span>
  );
}
