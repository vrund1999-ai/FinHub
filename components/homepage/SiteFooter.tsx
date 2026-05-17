const FOOTER_LINKS = ["Privacy", "Terms", "API", "Status"];

export function SiteFooter({
  tagline = "Data delayed 15 min",
}: {
  tagline?: string;
} = {}) {
  return (
    <footer className="border-t border-[var(--color-border)]">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-3 px-6 py-5 text-xs text-[var(--color-text-dim)] md:flex-row md:items-center md:justify-between">
        <p>© 2026 FinHub · {tagline}</p>
        <ul className="flex flex-wrap gap-5">
          {FOOTER_LINKS.map((label) => (
            <li key={label}>
              <a
                href="#"
                className="transition-colors hover:text-[var(--color-text)]"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
