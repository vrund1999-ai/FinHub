export function MiniChart({
  series,
  xLabels,
  height = 180,
}: {
  series: number[];
  xLabels?: string[];
  height?: number;
}) {
  if (series.length < 2) return null;

  const width = 600;
  const padX = 8;
  const padTop = 8;
  const padBottom = xLabels && xLabels.length > 0 ? 22 : 8;
  const innerW = width - padX * 2;
  const innerH = height - padTop - padBottom;

  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;

  const points = series.map((v, i) => {
    const x = padX + (i / (series.length - 1)) * innerW;
    const y = padTop + innerH - ((v - min) / range) * innerH;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  const gridRows = 4;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      width="100%"
      height={height}
      role="img"
      aria-label="Price chart"
    >
      {Array.from({ length: gridRows + 1 }).map((_, i) => {
        const y = padTop + (i / gridRows) * innerH;
        return (
          <line
            key={`grid-${i}`}
            x1={padX}
            x2={width - padX}
            y1={y}
            y2={y}
            stroke="var(--color-border)"
            strokeWidth={1}
            opacity={0.5}
          />
        );
      })}

      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {xLabels?.map((label, i) => {
        const x = padX + (i / (xLabels.length - 1)) * innerW;
        return (
          <text
            key={label + i}
            x={x}
            y={height - 4}
            textAnchor={i === 0 ? "start" : i === xLabels.length - 1 ? "end" : "middle"}
            fontSize={11}
            fill="var(--color-text-muted)"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}
