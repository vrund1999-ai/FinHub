import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { SiteHeader } from "@/components/homepage/SiteHeader";
import { SiteFooter } from "@/components/homepage/SiteFooter";
import { TrackOverview } from "@/components/education/tracks/TrackOverview";
import {
  fetchTrackBySlug,
  fetchUserLessonCompletions,
  fetchUserTrackProgress,
} from "@/lib/tracks/queries";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ trackSlug: string }> };

export async function generateMetadata({ params }: Props) {
  const { trackSlug } = await params;
  const data = await fetchTrackBySlug(trackSlug);
  if (!data) return { title: "Track not found · FinHub" };
  return {
    title: `${data.track.title} · Learning Tracks · FinHub`,
    description: data.track.description,
  };
}

export default async function TrackPage({ params }: Props) {
  const { trackSlug } = await params;
  const data = await fetchTrackBySlug(trackSlug);
  if (!data) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [completedIds, allProgress] = await Promise.all([
    fetchUserLessonCompletions(data.lessons.map((l) => l.id)),
    fetchUserTrackProgress(),
  ]);
  const trackProgress =
    allProgress.find((p) => p.track_id === data.track.id) ?? null;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader activeNavItem="Education" />
      <main className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col gap-6 px-6 py-6">
        <Link
          href="/education/tracks"
          className="inline-flex w-fit items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
        >
          <ChevronLeft size={14} /> Back to Learning Tracks
        </Link>
        <TrackOverview
          track={data.track}
          lessons={data.lessons}
          completedLessonIds={new Set(completedIds)}
          progress={trackProgress}
          isAuthed={!!user}
        />
      </main>
      <SiteFooter tagline="Built to educate, not advise" />
    </div>
  );
}
