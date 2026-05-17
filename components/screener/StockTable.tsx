import { Star } from "lucide-react";
import { DeltaText } from "@/components/homepage/DeltaText";
import type { ScreenerStock } from "./data";

export function StockTable({ rows }: { rows: ScreenerStock[] }) {
  return (
    <section className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs font-medium text-[var(--color-text-muted)]">
            <th className="w-8 py-3 pl-4"></th>
            <th className="py-3 pr-3 font-medium">Company</th>
            <th className="py-3 pr-3 text-right font-medium">
              <span className="inline-flex items-center gap-1 text-[var(--color-accent)]">
                Price <span aria-hidden>▲</span>
              </span>
            </th>
            <th className="py-3 pr-3 text-right font-medium">Chg %</th>
            <th className="py-3 pr-3 text-right font-medium">Mkt cap</th>
            <th className="py-3 pr-3 text-right font-medium">P/E</th>
            <th className="py-3 pr-3 text-right font-medium">EPS</th>
            <th className="py-3 pr-3 text-right font-medium">Rev gth</th>
            <th className="py-3 pr-4 text-right font-medium">Vol</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const revPositive = row.revGrowthPct >= 0;
            const revColor = revPositive
              ? "var(--color-success)"
              : "var(--color-danger)";
            const revSign = revPositive ? "+" : "";
            return (
              <tr
                key={row.symbol}
                className="border-t border-[var(--color-border)]"
              >
                <td className="py-3 pl-4">
                  <Star
                    className="h-4 w-4"
                    fill={row.favorited ? "var(--color-accent)" : "none"}
                    stroke={
                      row.favorited
                        ? "var(--color-accent)"
                        : "var(--color-text-dim)"
                    }
                    strokeWidth={1.5}
                  />
                </td>
                <td className="py-3 pr-3">
                  <div className="text-xs font-semibold text-[var(--color-accent)]">
                    {row.symbol}
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)]">
                    {row.name}
                  </div>
                </td>
                <td className="py-3 pr-3 text-right tabular-nums text-[var(--color-text)]">
                  {row.price}
                </td>
                <td className="py-3 pr-3 text-right">
                  <div className="inline-flex justify-end">
                    <DeltaText value={row.chgPct} />
                  </div>
                </td>
                <td className="py-3 pr-3 text-right tabular-nums text-[var(--color-text)]">
                  {row.mktCap}
                </td>
                <td className="py-3 pr-3 text-right tabular-nums text-[var(--color-text)]">
                  {row.peRatio}
                </td>
                <td className="py-3 pr-3 text-right tabular-nums text-[var(--color-text)]">
                  {row.eps}
                </td>
                <td
                  className="py-3 pr-3 text-right text-xs font-medium tabular-nums"
                  style={{ color: revColor }}
                >
                  {revSign}
                  {row.revGrowthPct}%
                </td>
                <td className="py-3 pr-4 text-right tabular-nums text-[var(--color-text)]">
                  {row.volume}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
