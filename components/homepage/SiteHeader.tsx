import Link from "next/link";
import { BrandWordmark } from "@/components/auth/BrandWordmark";
import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { SecondaryButton } from "@/components/auth/SecondaryButton";

const NAV_LINKS = ["Markets", "Screener", "News", "Education"];

export function SiteHeader() {
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

        <div className="flex items-center gap-2">
          <Link href="/login">
            <SecondaryButton>Log in</SecondaryButton>
          </Link>
          <Link href="/signup">
            <PrimaryButton fullWidth={false}>Sign up free</PrimaryButton>
          </Link>
        </div>
      </div>
    </header>
  );
}
