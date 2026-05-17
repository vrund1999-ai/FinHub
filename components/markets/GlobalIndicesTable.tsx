import type { GlobalIndexRow } from "./data";
import { DeltaText } from "@/components/homepage/DeltaText";
import { RangeBar } from "./RangeBar";

export function GlobalIndicesTable({ rows }: { rows: GlobalIndexRow[] }) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
          GLOBAL INDICES
        </h2>
        <span className="text-[11px] text-[var(--color-text-muted)]">
          Delayed 15 min
        </span>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs font-medium text-[var(--color-text-muted)]">
            <th className="pb-2 font-medium">Index</th>
            <th className="pb-2 text-right font-medium">Last</th>
            <th className="pb-2 text-right font-medium">Chg</th>
            <th className="pb-2 text-right font-medium">% Chg</th>
            <th className="pb-2 pl-6 text-left font-medium">52W range</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const positive = row.deltaPct >= 0;
            const chgColor = positive
              ? "var(--color-success)"
              : "var(--color-danger)";
            return (
              <tr
                key={row.name}
                className="border-t border-[var(--color-border)]"
              >
                <td className="py-3">
                  <div className="font-medium text-[var(--color-text)]">
                    {row.name}
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)]">
                    {row.country}
                  </div>
                </td>
                <td className="py-3 text-right tabular-nums text-[var(--color-text)]">
                  {row.last}
                </td>
                <td
                  className="py-3 text-right tabular-nums"
                  style={{ color: chgColor }}
                >
                  {row.chg}
                </td>
                <td className="py-3 text-right">
                  <div className="inline-flex justify-end">
                    <DeltaText value={row.deltaPct} />
                  </div>
                </td>
                <td className="py-3 pl-6">
                  <RangeBar
                    low={row.low52}
                    high={row.high52}
                    current={row.current52}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
