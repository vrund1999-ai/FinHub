import { StepperItem } from "./StepperItem";

const STEPS = [
  { title: "Create account", subtitle: "Your email and password" },
  { title: "Your experience", subtitle: "So we can personalize your feed" },
  { title: "Your interests", subtitle: "Topics and sectors to follow" },
] as const;

export function Stepper({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  return (
    <ol className="flex flex-col gap-5">
      {STEPS.map((s, i) => {
        const step = (i + 1) as 1 | 2 | 3;
        const state =
          step < currentStep
            ? "completed"
            : step === currentStep
              ? "active"
              : "inactive";
        return (
          <StepperItem
            key={step}
            step={step}
            title={s.title}
            subtitle={s.subtitle}
            state={state}
          />
        );
      })}
    </ol>
  );
}
