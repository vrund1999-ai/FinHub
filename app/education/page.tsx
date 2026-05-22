import { SiteHeader } from "@/components/homepage/SiteHeader";
import { SiteFooter } from "@/components/homepage/SiteFooter";
import { EducationHero } from "@/components/education/EducationHero";
import { LearningTracksSection } from "@/components/education/LearningTracksSection";
import { GlossarySection } from "@/components/education/GlossarySection";
import { EducationSearchProvider } from "@/components/education/EducationSearchProvider";
import { PopularGuides } from "@/components/education/PopularGuides";
import { PersonalSidebar } from "@/components/education/PersonalSidebar";
import { TrendingTerms } from "@/components/education/TrendingTerms";
import {
  fetchAllGlossaryTerms,
  fetchTrendingTerms,
} from "@/lib/glossary/queries";
import { fetchAllGuides, fetchFeaturedGuides } from "@/lib/guides/queries";
import {
  fetchAllTracks,
  fetchFeaturedTracks,
  fetchUserTrackProgress,
} from "@/lib/tracks/queries";

// Per-user quiz + streak data is read in <PersonalSidebar> via cookies(),
// which forces this route into dynamic rendering.
export const dynamic = "force-dynamic";

export default async function EducationPage() {
  const [
    allTerms,
    trendingRows,
    featuredGuides,
    allGuides,
    featuredTracks,
    allTracks,
    trackProgress,
  ] = await Promise.all([
    fetchAllGlossaryTerms(),
    fetchTrendingTerms(7),
    fetchFeaturedGuides(5),
    fetchAllGuides(),
    fetchFeaturedTracks(4),
    fetchAllTracks(),
    fetchUserTrackProgress(),
  ]);
  const trending = trendingRows.map((row) => ({
    label: row.term,
    slug: row.slug,
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader activeNavItem="Education" />
      <main className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col gap-6 px-6 py-6">
        <EducationSearchProvider
          allTerms={allTerms}
          allTracks={allTracks}
          allGuides={allGuides}
        >
          <EducationHero />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
            <div className="flex flex-col gap-6">
              <LearningTracksSection
                tracks={featuredTracks}
                progress={trackProgress}
              />
              <GlossarySection />
            </div>
            <aside className="flex flex-col gap-6">
              <PopularGuides guides={featuredGuides} />
              <PersonalSidebar />
              <TrendingTerms terms={trending} />
            </aside>
          </div>
        </EducationSearchProvider>
      </main>
      <SiteFooter tagline="Built to educate, not advise" />
    </div>
  );
}
