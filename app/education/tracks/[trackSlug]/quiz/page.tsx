import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { SiteHeader } from "@/components/homepage/SiteHeader";
import { SiteFooter } from "@/components/homepage/SiteFooter";
import { TrackFinalQuiz } from "@/components/education/tracks/TrackFinalQuiz";
import { startTrackQuizAction } from "@/app/education/tracks/actions";
import { fetchTrackBySlug } from "@/lib/tracks/queries";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ trackSlug: string }> };

export async function generateMetadata({ params }: Props) {
  const { trackSlug } = await params;
  const data = await fetchTrackBySlug(trackSlug);
  if (!data) return { title: "Quiz not found · FinHub" };
  return {
    title: `${data.track.title} — Final Quiz · FinHub`,
    description: `Final quiz for the ${data.track.title} learning track.`,
  };
}

export default async function TrackQuizPage({ params }: Props) {
  const { trackSlug } = await params;
  const data = await fetchTrackBySlug(trackSlug);
  if (!data) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?next=/education/tracks/${trackSlug}/quiz`);
  }

  const startResult = await startTrackQuizAction(data.track.id);
  const trackHref = `/education/tracks/${data.track.slug}`;

  if (!startResult.ok) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader activeNavItem="Education" />
        <main className="mx-auto flex w-full max-w-screen-md flex-1 flex-col gap-6 px-6 py-6">
          <Link
            href={trackHref}
            className="inline-flex w-fit items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
          >
            <ChevronLeft size={14} /> {data.track.title}
          </Link>
          <section className="flex flex-col gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h1
              className="text-xl font-semibold text-[var(--color-text)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Final quiz unavailable
            </h1>
            <p className="text-sm text-[var(--color-text-muted)]">
              {startResult.error === "track_not_ready"
                ? "Complete every lesson in this track before taking the final quiz."
                : startResult.error === "no_questions_for_track"
                ? "There are no quiz questions available for this track yet. Check back soon."
                : "We couldn't start the quiz. Please try again."}
            </p>
            <Link
              href={trackHref}
              className="mt-3 inline-flex w-fit items-center gap-1 rounded-md bg-[var(--color-accent)] px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
            >
              Back to track
            </Link>
          </section>
        </main>
        <SiteFooter tagline="Built to educate, not advise" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader activeNavItem="Education" />
      <main className="mx-auto flex w-full max-w-screen-md flex-1 flex-col gap-6 px-6 py-6">
        <Link
          href={trackHref}
          className="inline-flex w-fit items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
        >
          <ChevronLeft size={14} /> {data.track.title}
        </Link>
        <TrackFinalQuiz
          trackId={data.track.id}
          trackTitle={data.track.title}
          trackHref={trackHref}
          initialAttempt={startResult.payload}
        />
      </main>
      <SiteFooter tagline="Built to educate, not advise" />
    </div>
  );
}
