import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/signup";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // If the user is being routed into the signup flow, make sure they
      // aren't already onboarded — otherwise they'd silently overwrite their
      // existing profile via createAccountAction's upsert.
      if (next.startsWith("/signup")) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("onboarded_at")
            .eq("id", user.id)
            .maybeSingle();

          if (profile?.onboarded_at) {
            await supabase.auth.signOut();
            return NextResponse.redirect(
              `${origin}/login?reason=account_exists`,
            );
          }
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/signup?error=oauth`);
}
