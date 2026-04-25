import type { ReactNode } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginSidebar } from "@/components/login/LoginSidebar";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <AuthShell sidebar={<LoginSidebar />}>{children}</AuthShell>;
}
