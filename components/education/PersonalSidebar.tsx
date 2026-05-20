import { createClient } from "@/lib/supabase/server";
import { fetchDailyQuiz, fetchUserQuizStats } from "@/lib/quiz/queries";
import { DailyQuiz } from "./DailyQuiz";
import { DailyQuizLoggedOut } from "./DailyQuizLoggedOut";
import { StreakBar } from "./StreakBar";

export async function PersonalSidebar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <>
        <DailyQuizLoggedOut />
        <StreakBar streakDays={0} pointsThisWeek={0} />
      </>
    );
  }

  const [payloadResult, stats] = await Promise.all([
    fetchDailyQuiz(),
    fetchUserQuizStats(),
  ]);

  return (
    <>
      {payloadResult.ok && payloadResult.payload.questions.length === 3 ? (
        <DailyQuiz initial={payloadResult.payload} />
      ) : (
        <DailyQuizLoggedOut />
      )}
      <StreakBar
        streakDays={stats.current_streak_days}
        pointsThisWeek={stats.points_this_week}
      />
    </>
  );
}
