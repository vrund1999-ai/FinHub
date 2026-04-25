import type { ReactNode } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupSidebar } from "@/components/signup/SignupSidebar";
import { SignupDraftProvider } from "./SignupDraftProvider";

export default function SignupLayout({ children }: { children: ReactNode }) {
  return (
    <SignupDraftProvider>
      <AuthShell sidebar={<SignupSidebar />}>{children}</AuthShell>
    </SignupDraftProvider>
  );
}
