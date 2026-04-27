import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

export function Card({
  title,
  footerLabel,
  footerHref,
  children,
}: {
  title?: string;
  footerLabel?: string;
  footerHref?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      {title ? (
        <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
          {title}
        </h2>
      ) : null}
      <div className="flex flex-1 flex-col gap-4">{children}</div>
      {footerLabel ? (
        <a
          href={footerHref ?? "#"}
          className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-accent)] hover:underline"
        >
          {footerLabel} <ArrowRight size={12} />
        </a>
      ) : null}
    </section>
  );
}
