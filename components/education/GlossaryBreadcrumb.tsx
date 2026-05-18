import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function GlossaryBreadcrumb({ term }: { term: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]"
    >
      <Link
        href="/education"
        className="transition-colors hover:text-[var(--color-text)]"
      >
        Education
      </Link>
      <ChevronRight className="h-3 w-3" aria-hidden />
      <Link
        href="/education"
        className="transition-colors hover:text-[var(--color-text)]"
      >
        Glossary
      </Link>
      <ChevronRight className="h-3 w-3" aria-hidden />
      <span className="text-[var(--color-text)]">{term}</span>
    </nav>
  );
}
