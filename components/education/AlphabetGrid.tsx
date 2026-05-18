"use client";

export function AlphabetGrid({
  alphabet,
  activeLetters,
  selected,
  onSelect,
}: {
  alphabet: readonly string[];
  activeLetters: ReadonlySet<string>;
  selected: string | null;
  onSelect: (letter: string | null) => void;
}) {
  const base =
    "flex h-8 items-center justify-center rounded text-xs font-semibold tabular-nums transition-colors";
  return (
    <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1.5">
      <button
        type="button"
        onClick={() => onSelect(null)}
        aria-pressed={selected === null}
        className={`${base} ${
          selected === null
            ? "bg-[var(--color-accent)] text-white"
            : "border border-[var(--color-border-strong)] text-[var(--color-text)] hover:border-[var(--color-accent)]"
        }`}
      >
        All
      </button>
      {alphabet.map((letter) => {
        const isSelected = letter === selected;
        const isActive = activeLetters.has(letter);
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
            onClick={() => onSelect(letter)}
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
