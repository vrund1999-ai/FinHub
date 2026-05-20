import { SiteHeader } from "@/components/homepage/SiteHeader";
import { SiteFooter } from "@/components/homepage/SiteFooter";
import { EducationHero } from "@/components/education/EducationHero";
import { LearningTracksSection } from "@/components/education/LearningTracksSection";
import { GlossarySection } from "@/components/education/GlossarySection";
import { GlossaryProvider } from "@/components/education/GlossaryProvider";
import { PopularGuides } from "@/components/education/PopularGuides";
import { PersonalSidebar } from "@/components/education/PersonalSidebar";
import { TrendingTerms } from "@/components/education/TrendingTerms";
import {
  learningTracks,
  popularGuides,
  trendingTerms,
} from "@/components/education/data";
import { fetchAllGlossaryTerms } from "@/lib/glossary/queries";

// Per-user quiz + streak data is read in <PersonalSidebar> via cookies(),
// which forces this route into dynamic rendering.
export const dynamic = "force-dynamic";

export default async function EducationPage() {
  const allTerms = await fetchAllGlossaryTerms();

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
              <PersonalSidebar />
              <TrendingTerms terms={trendingTerms} />
            </aside>
          </div>
        </GlossaryProvider>
      </main>
      <SiteFooter tagline="Built to educate, not advise" />
    </div>
  );
}
