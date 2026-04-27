import type { Mover } from "./data";
import { Card } from "./Card";
import { MoverRow } from "./MoverRow";
import { ConceptPill } from "./ConceptPill";

export function MoversCard({
  movers,
  concepts,
}: {
  movers: Mover[];
  concepts: string[];
}) {
  return (
    <Card title="TOP MOVERS TODAY">
      <div className="flex flex-col gap-3">
        {movers.map((m) => (
          <MoverRow key={m.symbol} mover={m} />
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <h3 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
          LEARN A CONCEPT
        </h3>
        <div className="flex flex-wrap gap-2">
          {concepts.map((c) => (
            <ConceptPill key={c} label={c} />
          ))}
        </div>
      </div>
    </Card>
  );
}
