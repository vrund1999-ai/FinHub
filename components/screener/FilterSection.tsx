import type { ReactNode } from "react";
import { Minus } from "lucide-react";

export function FilterSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3 border-b border-[var(--color-border)] pb-5">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
          {title}
        </h3>
        <Minus className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
      </div>
      <div className="flex flex-col gap-2.5">{children}</div>
    </section>
  );
}
