import type { InputHTMLAttributes, ReactNode } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  trailing?: ReactNode;
};

export function TextField({ label, trailing, className, id, ...rest }: Props) {
  const inputId = id ?? `f_${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-xs font-medium text-[var(--color-text-muted)]"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          className={`w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] transition-colors hover:border-[var(--color-border-strong)] focus:border-[var(--color-accent)] focus:outline-none ${trailing ? "pr-16" : ""} ${className ?? ""}`}
          {...rest}
        />
        {trailing ? (
          <div className="absolute top-1/2 right-2 -translate-y-1/2">
            {trailing}
          </div>
        ) : null}
      </div>
    </div>
  );
}
