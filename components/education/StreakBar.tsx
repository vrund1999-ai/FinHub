export function StreakBar({
  streakDays,
  pointsThisWeek,
}: {
  streakDays: number;
  pointsThisWeek: number;
}) {
  return (
    <section className="grid grid-cols-2 items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-[var(--color-accent)] tabular-nums">
          {streakDays}
        </span>
        <span className="text-xs text-[var(--color-text-muted)]">day streak</span>
      </div>
      <div className="flex flex-col items-end border-l border-[var(--color-border)] pl-3">
        <span className="text-sm font-semibold tabular-nums text-[var(--color-text)]">
          {pointsThisWeek} pts
        </span>
        <span className="text-[11px] text-[var(--color-text-muted)]">this week</span>
      </div>
    </section>
  );
}
