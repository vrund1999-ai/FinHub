export function PasswordStrengthMeter({ score = 0 }: { score?: 0 | 1 | 2 | 3 | 4 }) {
  return (
    <div className="flex gap-1.5">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`h-1 flex-1 rounded-full ${
            i < score
              ? "bg-[var(--color-accent)]"
              : "bg-[var(--color-surface-2)]"
          }`}
        />
      ))}
    </div>
  );
}
