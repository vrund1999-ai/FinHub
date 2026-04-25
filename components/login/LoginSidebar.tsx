import { BrandWordmark } from "@/components/auth/BrandWordmark";
import { FeatureBullet } from "./FeatureBullet";
import { TestimonialCard } from "./TestimonialCard";

const FEATURES = [
  {
    title: "Live market data",
    description: "real-time quotes, indices, and sector heatmaps",
  },
  {
    title: "Saved watchlists",
    description: "track the stocks and ETFs that matter to you",
  },
  {
    title: "Custom screener filters",
    description: "save your favorite screens and get alerts",
  },
  {
    title: "Education tracks",
    description: "structured lessons with daily quiz streaks",
  },
];

export function LoginSidebar() {
  return (
    <>
      <BrandWordmark size="sm" />

      <div className="flex flex-col gap-3">
        <h2 className="font-display text-2xl leading-tight font-semibold text-[var(--color-text)]">
          Your financial command center, personalized.
        </h2>
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          Join over 200,000 investors who use FinHub to track markets, research
          stocks, and grow their financial knowledge.
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {FEATURES.map((f) => (
          <FeatureBullet
            key={f.title}
            title={f.title}
            description={f.description}
          />
        ))}
      </ul>

      <div className="flex-1" />

      <TestimonialCard
        quote="FinHub is the first financial site that doesn't make me feel lost. The education section alone is worth signing up for."
        initials="SR"
        name="Sarah R."
        meta="First-time investor · Chicago, IL"
        avatarBg="#3a4150"
        avatarFg="#e7e9ee"
      />
    </>
  );
}
