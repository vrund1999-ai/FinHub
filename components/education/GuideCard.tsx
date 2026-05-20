import { ArrowUpRight } from "lucide-react";
import type { Guide } from "@/lib/guides/queries";
import { DifficultyBadge } from "./DifficultyBadge";

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <a
      href={guide.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-colors hover:border-[var(--color-accent)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold tracking-[0.14em] text-[var(--color-text-muted)]">
            {guide.source.toUpperCase()}
          </div>
          <h3 className="mt-1 text-base font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
            {guide.title}
          </h3>
        </div>
        <ArrowUpRight
          size={16}
          className="shrink-0 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)]"
        />
      </div>
      {guide.description && (
        <p className="text-sm text-[var(--color-text-muted)]">{guide.description}</p>
      )}
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--color-text-muted)]">
        <DifficultyBadge difficulty={guide.difficulty} />
        <span className="rounded-md border border-[var(--color-border)] px-2 py-0.5">
          {guide.category}
        </span>
        <span>{guide.read_time_minutes} min read</span>
      </div>
    </a>
  );
}
