import Link from "next/link";
import type { GlossaryListItem } from "@/lib/glossary/queries";
import { DifficultyBadge } from "./DifficultyBadge";

export function GlossaryEntry({
  entry,
  isFirst,
}: {
  entry: GlossaryListItem;
  isFirst?: boolean;
}) {
  return (
    <Link
      href={`/education/glossary/${entry.slug}`}
      className={`group grid grid-cols-1 gap-2 py-3 transition-colors sm:grid-cols-[180px_1fr] sm:gap-4 ${
        isFirst ? "" : "border-t border-[var(--color-border)]"
      }`}
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
          {entry.term}
        </span>
        <span className="inline-flex">
          <DifficultyBadge difficulty={entry.difficulty} />
        </span>
      </div>
      <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
        {entry.definition}
      </p>
    </Link>
  );
}
