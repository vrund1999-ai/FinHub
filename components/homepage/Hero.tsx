import { HeroSearch } from "./HeroSearch";

export function Hero() {
  return (
    <section className="flex flex-col gap-6 lg:max-w-3xl">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
        Your financial command center
      </span>
      <h1 className="font-display text-4xl font-semibold leading-tight text-[var(--color-text)] md:text-5xl">
        Markets. News. Knowledge.
        <br />
        All in one place.
      </h1>
      <p className="max-w-xl text-base leading-relaxed text-[var(--color-text-muted)]">
        Real-time data, curated research, and plain-language education —
        whether you&rsquo;re buying your first stock or managing a portfolio.
      </p>
      <HeroSearch />
    </section>
  );
}
