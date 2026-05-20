import Link from "next/link";

export function DailyQuizLoggedOut() {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
        DAILY QUIZ
      </h2>
      <div className="flex flex-col gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
        <p className="text-sm leading-snug text-[var(--color-text)]">
          Test what you&apos;re learning. 3 new questions every day, picked just
          for you.
        </p>
        <Link
          href="/login?redirect=/education"
          className="inline-flex items-center justify-center rounded-md bg-[var(--color-accent)] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
        >
          Log in to take today&apos;s quiz
        </Link>
      </div>
    </section>
  );
}
