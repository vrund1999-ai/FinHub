import type { SelectHTMLAttributes } from "react";

type Option = { value: string; label: string };

type Props = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  label: string;
  options: Option[];
  placeholder?: string;
};

export function Select({
  label,
  options,
  placeholder,
  id,
  className,
  defaultValue,
  ...rest
}: Props) {
  const selectId = id ?? `sel_${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={selectId}
        className="text-xs font-medium text-[var(--color-text-muted)]"
      >
        {label}
      </label>
      <select
        id={selectId}
        defaultValue={defaultValue ?? (placeholder ? "" : undefined)}
        className={`w-full appearance-none rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] bg-no-repeat px-3 py-2.5 pr-9 text-sm text-[var(--color-text)] transition-colors hover:border-[var(--color-border-strong)] focus:border-[var(--color-accent)] focus:outline-none ${className ?? ""}`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1l5 5 5-5' stroke='%239aa3b2' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
          backgroundPosition: "right 0.75rem center",
        }}
        {...rest}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
