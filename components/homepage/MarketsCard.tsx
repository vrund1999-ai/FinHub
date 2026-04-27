import type { MarketIndex } from "./data";
import { Card } from "./Card";
import { MarketRow } from "./MarketRow";

export function MarketsCard({ rows }: { rows: MarketIndex[] }) {
  return (
    <Card
      title="MARKETS OVERVIEW"
      footerLabel="View full markets"
      footerHref="#"
    >
      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <MarketRow key={row.name} row={row} />
        ))}
      </div>
    </Card>
  );
}
