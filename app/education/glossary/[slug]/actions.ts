"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

const BOT_UA = /bot|crawler|spider|preview|fetch|monitor|headless/i;

export async function trackGlossaryView(slug: string): Promise<void> {
  if (!slug || typeof slug !== "string") return;

  const ua = (await headers()).get("user-agent") ?? "";
  if (BOT_UA.test(ua)) return;

  const supabase = await createClient();
  await supabase.rpc("increment_glossary_view", { p_slug: slug });
}
