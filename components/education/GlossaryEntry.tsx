import type { GlossaryEntry as Entry } from "./data";
import { DifficultyBadge } from "./DifficultyBadge";

export function GlossaryEntry({
  entry,
  isFirst,
}: {
  entry: Entry;
  isFirst?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-1 gap-2 py-3 sm:grid-cols-[180px_1fr] sm:gap-4 ${
        isFirst ? "" : "border-t border-[var(--color-border)]"
      }`}
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-[var(--color-text)]">
          {entry.term}
        </span>
        <span className="inline-flex">
          <DifficultyBadge difficulty={entry.difficulty} />
        </span>
      </div>
      <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
        {entry.definition}
      </p>
    </div>
  );
}
