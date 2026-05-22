"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Guide } from "@/lib/guides/queries";
import { useEducationSearch } from "./EducationSearchProvider";

export function PopularGuides({ guides }: { guides: Guide[] }) {
  const { query, filteredGuides } = useEducationSearch();
  const isSearching = query.trim().length > 0;
  const visible = isSearching ? filteredGuides : guides;

  return (
    <section className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
          POPULAR GUIDES
        </h2>
        <Link
          href="/education/guides"
          className="inline-flex items-center gap-0.5 text-xs font-medium text-[var(--color-accent)] hover:underline"
        >
          All guides <ArrowUpRight size={12} />
        </Link>
      </div>
      {visible.length === 0 ? (
        <p className="py-2 text-xs text-[var(--color-text-muted)]">
          {isSearching
            ? `No guides match "${query.trim()}".`
            : "No featured guides yet."}
        </p>
      ) : (
        <ul className="flex flex-col">
          {visible.map((guide, i) => (
            <li
              key={guide.id}
              className={
                i === 0
                  ? "grid grid-cols-[auto_1fr] items-start gap-3 py-2"
                  : "grid grid-cols-[auto_1fr] items-start gap-3 border-t border-[var(--color-border)] py-2"
              }
            >
              <span className="text-xs font-medium tabular-nums text-[var(--color-text-dim)]">
                {String(
                  isSearching ? i + 1 : guide.featured_rank ?? i + 1,
                ).padStart(2, "0")}
              </span>
              <a
                href={guide.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group min-w-0"
              >
                <div className="text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent)] group-hover:underline">
                  {guide.title}
                </div>
                <div className="text-[11px] text-[var(--color-text-muted)]">
                  {guide.source} · {guide.difficulty} · {guide.read_time_minutes} min read
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
