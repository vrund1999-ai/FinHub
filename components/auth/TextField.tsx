import type { InputHTMLAttributes, ReactNode } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  trailing?: ReactNode;
  labelTrailing?: ReactNode;
  error?: string;
};

export function TextField({
  label,
  trailing,
  labelTrailing,
  error,
  className,
  id,
  ...rest
}: Props) {
  const inputId = id ?? `f_${label.toLowerCase().replace(/\s+/g, "-")}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const borderClass = error
    ? "border-red-400/60 hover:border-red-400 focus:border-red-400"
    : "border-[var(--color-border)] hover:border-[var(--color-border-strong)] focus:border-[var(--color-accent)]";
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-[var(--color-text-muted)]"
        >
          {label}
        </label>
        {labelTrailing}
      </div>
      <div className="relative">
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={`w-full rounded-md border bg-[var(--color-surface-2)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] transition-colors focus:outline-none ${borderClass} ${trailing ? "pr-16" : ""} ${className ?? ""}`}
          {...rest}
        />
        {trailing ? (
          <div className="absolute top-1/2 right-2 -translate-y-1/2">
            {trailing}
          </div>
        ) : null}
      </div>
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-xs text-red-400"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
