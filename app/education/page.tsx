import { SiteHeader } from "@/components/homepage/SiteHeader";
import { SiteFooter } from "@/components/homepage/SiteFooter";
import { EducationHero } from "@/components/education/EducationHero";
import { LearningTracksSection } from "@/components/education/LearningTracksSection";
import { GlossarySection } from "@/components/education/GlossarySection";
import { PopularGuides } from "@/components/education/PopularGuides";
import { DailyQuiz } from "@/components/education/DailyQuiz";
import { StreakBar } from "@/components/education/StreakBar";
import { TrendingTerms } from "@/components/education/TrendingTerms";
import {
  ALPHABET,
  ACTIVE_LETTERS,
  DEFAULT_SELECTED_LETTER,
  learningTracks,
  glossaryEntries,
  popularGuides,
  dailyQuiz,
  trendingTerms,
} from "@/components/education/data";

export default function EducationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader activeNavItem="Education" />
      <main className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col gap-6 px-6 py-6">
        <EducationHero />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-6">
            <LearningTracksSection tracks={learningTracks} />
            <GlossarySection
              alphabet={ALPHABET}
              activeLetters={ACTIVE_LETTERS}
              selected={DEFAULT_SELECTED_LETTER}
              entries={glossaryEntries[DEFAULT_SELECTED_LETTER] ?? []}
              totalTerms={350}
            />
          </div>
          <aside className="flex flex-col gap-6">
            <PopularGuides items={popularGuides} />
            <DailyQuiz quiz={dailyQuiz} />
            <StreakBar streakDays={7} pointsThisWeek={124} />
            <TrendingTerms terms={trendingTerms} />
          </aside>
        </div>
      </main>
      <SiteFooter tagline="Built to educate, not advise" />
    </div>
  );
}
