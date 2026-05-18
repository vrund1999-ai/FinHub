export function AlphabetGrid({
  alphabet,
  activeLetters,
  selected,
}: {
  alphabet: readonly string[];
  activeLetters: ReadonlySet<string>;
  selected: string;
}) {
  return (
    <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-1.5">
      {alphabet.map((letter) => {
        const isSelected = letter === selected;
        const isActive = activeLetters.has(letter);
        const base =
          "flex h-8 items-center justify-center rounded text-xs font-semibold tabular-nums";
        const variant = isSelected
          ? "bg-[var(--color-accent)] text-white"
          : isActive
            ? "border border-[var(--color-border-strong)] text-[var(--color-text)] hover:border-[var(--color-accent)]"
            : "border border-[var(--color-border)] text-[var(--color-text-dim)] cursor-not-allowed";
        return (
          <button
            key={letter}
            type="button"
            disabled={!isActive}
            aria-pressed={isSelected}
            className={`${base} ${variant}`}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}
