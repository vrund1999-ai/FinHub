import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean;
  icon?: ReactNode;
  children: ReactNode;
};

export function PrimaryButton({
  fullWidth = true,
  icon,
  children,
  className,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-md bg-[var(--color-text)] px-5 py-2.5 text-sm font-semibold text-[var(--color-bg)] transition-opacity hover:opacity-90 disabled:opacity-50 ${fullWidth ? "w-full" : ""} ${className ?? ""}`}
      {...rest}
    >
      <span>{children}</span>
      {icon}
    </button>
  );
}
