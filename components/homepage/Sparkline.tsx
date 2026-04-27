export function Sparkline({
  values,
  width = 56,
  height = 20,
}: {
  values: number[];
  width?: number;
  height?: number;
}) {
  if (values.length === 0) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const gap = 1;
  const barWidth = (width - gap * (values.length - 1)) / values.length;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-hidden="true"
    >
      {values.map((v, i) => {
        const h = Math.max(2, ((v - min) / range) * height);
        const x = i * (barWidth + gap);
        const y = height - h;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={h}
            rx={1}
            fill="var(--color-accent)"
            opacity={0.65 + (i / values.length) * 0.35}
          />
        );
      })}
    </svg>
  );
}
