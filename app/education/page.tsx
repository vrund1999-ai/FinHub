import { SiteHeader } from "@/components/homepage/SiteHeader";
import { SiteFooter } from "@/components/homepage/SiteFooter";
import { EducationHero } from "@/components/education/EducationHero";
import { LearningTracksSection } from "@/components/education/LearningTracksSection";
import { GlossarySection } from "@/components/education/GlossarySection";
import { GlossaryProvider } from "@/components/education/GlossaryProvider";
import { PopularGuides } from "@/components/education/PopularGuides";
import { DailyQuiz } from "@/components/education/DailyQuiz";
import { StreakBar } from "@/components/education/StreakBar";
import { TrendingTerms } from "@/components/education/TrendingTerms";
import {
  learningTracks,
  popularGuides,
  dailyQuiz,
} from "@/components/education/data";
import {
  fetchAllGlossaryTerms,
  fetchTrendingTerms,
} from "@/lib/glossary/queries";

export const revalidate = 60;

export default async function EducationPage() {
  const [allTerms, trendingRows] = await Promise.all([
    fetchAllGlossaryTerms(),
    fetchTrendingTerms(7),
  ]);
  const trending = trendingRows.map((row) => ({
    label: row.term,
    slug: row.slug,
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader activeNavItem="Education" />
      <main className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col gap-6 px-6 py-6">
        <GlossaryProvider allTerms={allTerms}>
          <EducationHero />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
            <div className="flex flex-col gap-6">
              <LearningTracksSection tracks={learningTracks} />
              <GlossarySection />
            </div>
            <aside className="flex flex-col gap-6">
              <PopularGuides items={popularGuides} />
              <DailyQuiz quiz={dailyQuiz} />
              <StreakBar streakDays={7} pointsThisWeek={124} />
              <TrendingTerms terms={trending} />
            </aside>
          </div>
        </GlossaryProvider>
      </main>
      <SiteFooter tagline="Built to educate, not advise" />
    </div>
  );
}
