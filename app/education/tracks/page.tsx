import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { SiteHeader } from "@/components/homepage/SiteHeader";
import { SiteFooter } from "@/components/homepage/SiteFooter";
import { TracksBrowser } from "@/components/education/tracks/TracksBrowser";
import {
  fetchAllTracks,
  fetchUserTrackProgress,
} from "@/lib/tracks/queries";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Learning Tracks · FinHub",
  description:
    "Guided paths through finance topics — videos, articles, and quizzes from reputable sources, structured into completable tracks.",
};

export default async function LearningTracksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const [tracks, progress] = await Promise.all([
    fetchAllTracks(),
    fetchUserTrackProgress(),
  ]);

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
              Learning Tracks
            </h1>
            <p className="max-w-2xl text-sm text-[var(--color-text-muted)]">
              Guided paths through finance topics. Each track bundles videos,
              articles, and primary-source publications into lessons, with a
              formative mini-quiz after every lesson and a scored final quiz at
              the end.
            </p>
          </div>
        </div>
        <TracksBrowser tracks={tracks} progress={progress} isAuthed={!!user} />
      </main>
      <SiteFooter tagline="Built to educate, not advise" />
    </div>
  );
}
