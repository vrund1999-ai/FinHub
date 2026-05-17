"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { SecondaryButton } from "@/components/auth/SecondaryButton";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (isPending) return;
    startTransition(async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.refresh();
    });
  }

  return (
    <SecondaryButton onClick={handleClick} disabled={isPending}>
      {isPending ? "Logging out…" : "Log out"}
    </SecondaryButton>
  );
}
