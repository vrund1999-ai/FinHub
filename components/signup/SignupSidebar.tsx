"use client";

import { usePathname } from "next/navigation";
import { BrandWordmark } from "@/components/auth/BrandWordmark";
import { TrustBadge } from "@/components/auth/TrustBadge";
import { Stepper } from "./Stepper";
import { SocialProofCard } from "./SocialProofCard";

function resolveStep(pathname: string): 1 | 2 | 3 {
  if (pathname.endsWith("/interests")) return 3;
  if (pathname.endsWith("/experience")) return 2;
  return 1;
}

export function SignupSidebar() {
  const pathname = usePathname() ?? "/signup";
  const currentStep = resolveStep(pathname);

  return (
    <>
      <BrandWordmark size="lg" />
      <Stepper currentStep={currentStep} />
      <div className="flex-1" />
      <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
        <TrustBadge label="Free forever plan" />
        <TrustBadge label="No credit card needed" />
        <TrustBadge label="Cancel anytime" />
        <TrustBadge label="SOC 2 compliant" />
      </ul>
      <SocialProofCard />
    </>
  );
}
