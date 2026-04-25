import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="text-center">
        <h1 className="font-display text-4xl text-[var(--color-text)]">
          Fin<span className="text-[var(--color-accent)]">Hub</span>
        </h1>
        <p className="mt-4 text-[var(--color-text-muted)]">
          UI scaffolding. Try the sign up flow:
        </p>
        <Link
          href="/signup"
          className="mt-6 inline-block rounded-md border border-[var(--color-border-strong)] px-5 py-2 text-sm hover:border-[var(--color-accent)]"
        >
          /signup →
        </Link>
      </div>
    </main>
  );
}
