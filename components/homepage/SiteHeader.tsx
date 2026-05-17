import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { BrandWordmark } from "@/components/auth/BrandWordmark";
import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { SecondaryButton } from "@/components/auth/SecondaryButton";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./LogoutButton";

const NAV_LINKS = ["Markets", "Screener", "News", "Education"];

function pickFirstName(user: User): string {
  const meta = user.user_metadata ?? {};
  const fromMeta =
    meta.first_name ??
    meta.given_name ??
    (typeof meta.full_name === "string" ? meta.full_name.trim().split(/\s+/)[0] : undefined) ??
    (typeof meta.name === "string" ? meta.name.trim().split(/\s+/)[0] : undefined);
  if (fromMeta) return fromMeta;
  const local = user.email?.split("@")[0];
  return local && local.length > 0 ? local : "there";
}

async function getCurrentUser(): Promise<User | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-[var(--color-border)]">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="shrink-0">
          <BrandWordmark size="md" />
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((label) => (
            <a
              key={label}
              href="#"
              className="text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-[var(--color-text-muted)] sm:inline">
                Hi,{" "}
                <span className="font-medium text-[var(--color-text)]">
                  {pickFirstName(user)}
                </span>
              </span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login">
                <SecondaryButton>Log in</SecondaryButton>
              </Link>
              <Link href="/signup">
                <PrimaryButton fullWidth={false}>Sign up free</PrimaryButton>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
