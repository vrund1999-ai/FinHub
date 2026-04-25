import { Chip } from "./Chip";

export function ChipGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: Set<string>;
  onToggle: (option: string) => void;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold tracking-[0.12em] text-[var(--color-text-muted)] uppercase">
        {label}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <Chip
            key={opt}
            label={opt}
            selected={selected.has(opt)}
            onClick={() => onToggle(opt)}
          />
        ))}
      </div>
    </section>
  );
}
