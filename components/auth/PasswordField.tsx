"use client";

import { useState, type ReactNode } from "react";
import { TextField } from "./TextField";

export function PasswordField({
  label = "Password",
  placeholder = "Min. 8 characters",
  autoComplete = "new-password",
  labelTrailing,
}: {
  label?: string;
  placeholder?: string;
  autoComplete?: string;
  labelTrailing?: ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      label={label}
      type={visible ? "text" : "password"}
      placeholder={placeholder}
      autoComplete={autoComplete}
      labelTrailing={labelTrailing}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-xs text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]"
        >
          {visible ? "Hide" : "Show"}
        </button>
      }
    />
  );
}
