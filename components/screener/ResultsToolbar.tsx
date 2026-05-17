import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { SecondaryButton } from "@/components/auth/SecondaryButton";

export function ResultsToolbar({
  totalResults,
  showing,
}: {
  totalResults: number;
  showing: number;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-sm text-[var(--color-text-muted)]">
        <span className="font-semibold text-[var(--color-text)]">
          {totalResults.toLocaleString()}
        </span>{" "}
        results · showing {showing}
      </span>
      <div className="flex items-center gap-2">
        <SecondaryButton className="px-4 py-2 text-xs">Columns</SecondaryButton>
        <SecondaryButton className="px-4 py-2 text-xs">
          Export CSV
        </SecondaryButton>
        <PrimaryButton fullWidth={false} className="px-4 py-2 text-xs">
          Save screen
        </PrimaryButton>
      </div>
    </div>
  );
}
