"use client";

import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { AppleIcon } from "@/components/icons/AppleIcon";
import { createClient } from "@/lib/supabase/client";

type Variant = "google" | "apple";

export function OAuthButton({
  variant,
  label,
}: {
  variant: Variant;
  label: string;
}) {
  const Icon = variant === "google" ? GoogleIcon : AppleIcon;
  const isApple = variant === "apple";

  async function handleClick() {
    if (isApple) return;
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      alert(
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
      );
      return;
    }
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/signup`,
      },
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isApple}
      title={isApple ? "Coming soon" : undefined}
      className="flex w-full items-center justify-center gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-border-strong)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[var(--color-border)]"
    >
      <Icon className={isApple ? "text-white" : undefined} />
      <span>{label}</span>
    </button>
  );
}
