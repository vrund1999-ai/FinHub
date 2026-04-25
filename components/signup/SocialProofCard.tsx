import { JOINED_THIS_WEEK } from "@/lib/avatars";

export function SocialProofCard() {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)]/60 p-4">
      <p className="mb-3 text-[10px] font-semibold tracking-[0.12em] text-[var(--color-text-muted)] uppercase">
        Joined this week
      </p>
      <div className="mb-3 flex -space-x-2">
        {JOINED_THIS_WEEK.map((a) => (
          <span
            key={a.initials}
            className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--color-surface)] text-[10px] font-semibold"
            style={{ backgroundColor: a.bg, color: a.fg }}
          >
            {a.initials}
          </span>
        ))}
      </div>
      <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
        <span className="font-semibold text-[var(--color-text)]">2,400+</span>{" "}
        investors signed up this week. Join them and start tracking markets in
        minutes.
      </p>
    </div>
  );
}
