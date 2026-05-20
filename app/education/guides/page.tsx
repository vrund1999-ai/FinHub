import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { SiteHeader } from "@/components/homepage/SiteHeader";
import { SiteFooter } from "@/components/homepage/SiteFooter";
import { GuidesBrowser } from "@/components/education/GuidesBrowser";
import { fetchAllGuides } from "@/lib/guides/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Guides · FinHub",
  description:
    "Curated finance explainers from SEC, Federal Reserve, Fidelity, Schwab, Vanguard, and other trusted publishers.",
};

export default async function GuidesPage() {
  const guides = await fetchAllGuides();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader activeNavItem="Education" />
      <main className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col gap-6 px-6 py-6">
        <div className="flex flex-col gap-3">
          <Link
            href="/education"
            className="inline-flex w-fit items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
          >
            <ChevronLeft size={14} /> Back to Education
          </Link>
          <div className="flex flex-col gap-2">
            <h1
              className="text-3xl font-semibold text-[var(--color-text)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Guides
            </h1>
            <p className="max-w-2xl text-sm text-[var(--color-text-muted)]">
              Curated explainers from trusted publishers — SEC, the Federal Reserve, Fidelity,
              Schwab, Vanguard, FINRA, the IRS, and more. Each link opens the original article.
            </p>
          </div>
        </div>
        <GuidesBrowser guides={guides} />
      </main>
      <SiteFooter tagline="Built to educate, not advise" />
    </div>
  );
}
