"use client";

import { useId, useState, type ChangeEvent } from "react";
import { Check } from "lucide-react";

export function Checkbox({
  label,
  defaultChecked = false,
  onChange,
}: {
  label: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  const id = useId();
  const [checked, setChecked] = useState(defaultChecked);

  const handle = (e: ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
    onChange?.(e.target.checked);
  };

  return (
    <label
      htmlFor={id}
      className="inline-flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text-muted)]"
    >
      <span className="relative inline-flex h-4 w-4 items-center justify-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={handle}
          className="peer absolute inset-0 cursor-pointer opacity-0"
        />
        <span
          className={`pointer-events-none flex h-4 w-4 items-center justify-center rounded-sm border transition-colors ${
            checked
              ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
              : "border-[var(--color-border-strong)] bg-[var(--color-surface-2)]"
          }`}
        >
          {checked ? <Check size={12} strokeWidth={3} /> : null}
        </span>
      </span>
      <span>{label}</span>
    </label>
  );
}
