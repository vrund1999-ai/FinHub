import type { ReactNode } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupSidebar } from "@/components/signup/SignupSidebar";

export default function SignupLayout({ children }: { children: ReactNode }) {
  return <AuthShell sidebar={<SignupSidebar />}>{children}</AuthShell>;
}
