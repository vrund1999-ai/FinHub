import type { ReactNode } from "react";

export function AuthShell({
  sidebar,
  children,
}: {
  sidebar: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-4 md:p-8">
      <div className="grid w-full max-w-[960px] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <aside className="flex flex-col gap-8 border-b border-[var(--color-border)] p-8 md:border-b-0 md:border-r">
          {sidebar}
        </aside>
        <section className="flex flex-col gap-6 p-8">{children}</section>
      </div>
    </main>
  );
}
