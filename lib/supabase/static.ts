import { createClient } from "@supabase/supabase-js";

// Cookie-free Supabase client for public reads (e.g. glossary terms) that
// must work at build time inside generateStaticParams / generateMetadata,
// where Next's cookies() helper is unavailable.
export function createStaticClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
