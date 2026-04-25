import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { AppleIcon } from "@/components/icons/AppleIcon";

type Variant = "google" | "apple";

export function OAuthButton({
  variant,
  label,
}: {
  variant: Variant;
  label: string;
}) {
  const Icon = variant === "google" ? GoogleIcon : AppleIcon;
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-border-strong)]"
    >
      <Icon className={variant === "apple" ? "text-white" : undefined} />
      <span>{label}</span>
    </button>
  );
}
