import type { Mover } from "./data";
import { Card } from "@/components/homepage/Card";
import { DeltaText } from "@/components/homepage/DeltaText";

export function MoversList({
  title,
  items,
  footerLabel,
  footerHref,
}: {
  title: string;
  items: Mover[];
  footerLabel?: string;
  footerHref?: string;
}) {
  return (
    <Card title={title} footerLabel={footerLabel} footerHref={footerHref}>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li
            key={item.symbol}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-3"
          >
            <span className="text-xs font-semibold tracking-wide text-[var(--color-accent)]">
              {item.symbol}
            </span>
            <span className="text-sm text-[var(--color-text)]">
              {item.name}
            </span>
            <DeltaText value={item.deltaPct} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
