"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type InvestmentGoal =
  | "retirement"
  | "wealth"
  | "active-trading"
  | "learning"
  | "other";
export type WeeklyMarketTime = "lt1" | "1-5" | "5-10" | "10+";

export type SignupDraft = {
  firstName: string;
  lastName: string;
  email: string;
  level: ExperienceLevel | null;
  investmentGoal: InvestmentGoal | null;
  weeklyMarketTime: WeeklyMarketTime | null;
  sectors: string[];
  topics: string[];
  indices: string[];
};

const STORAGE_KEY = "finhub:signup-draft";

const DEFAULT_DRAFT: SignupDraft = {
  firstName: "",
  lastName: "",
  email: "",
  level: "intermediate",
  investmentGoal: null,
  weeklyMarketTime: "1-5",
  sectors: ["Technology", "Financials"],
  topics: ["Earnings", "Fed & rates"],
  indices: ["S&P 500", "NASDAQ"],
};

type ContextValue = {
  draft: SignupDraft;
  update: (patch: Partial<SignupDraft>) => void;
  reset: () => void;
};

const SignupDraftContext = createContext<ContextValue | null>(null);

export function SignupDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<SignupDraft>(DEFAULT_DRAFT);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SignupDraft>;
        setDraft((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore corrupt session storage
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // storage may be unavailable (private mode quota); non-fatal
    }
  }, [draft]);

  const update = useCallback((patch: Partial<SignupDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setDraft(DEFAULT_DRAFT);
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // non-fatal
    }
  }, []);

  return (
    <SignupDraftContext.Provider value={{ draft, update, reset }}>
      {children}
    </SignupDraftContext.Provider>
  );
}

export function useSignupDraft(): ContextValue {
  const ctx = useContext(SignupDraftContext);
  if (!ctx) {
    throw new Error("useSignupDraft must be used inside SignupDraftProvider");
  }
  return ctx;
}
