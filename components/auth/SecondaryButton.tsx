import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  children: ReactNode;
};

export function SecondaryButton({
  icon,
  children,
  className,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-md border border-[var(--color-border-strong)] bg-transparent px-5 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-text-muted)] ${className ?? ""}`}
      {...rest}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
