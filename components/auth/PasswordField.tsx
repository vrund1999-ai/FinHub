"use client";

import { useState } from "react";
import { TextField } from "./TextField";

export function PasswordField({
  label = "Password",
  placeholder = "Min. 8 characters",
}: {
  label?: string;
  placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      label={label}
      type={visible ? "text" : "password"}
      placeholder={placeholder}
      autoComplete="new-password"
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
