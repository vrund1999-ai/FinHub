import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { SecondaryButton } from "@/components/auth/SecondaryButton";
import { Select } from "@/components/signup/Select";
import { FilterSection } from "./FilterSection";
import { MinMaxRow } from "./MinMaxRow";
import { SectorChipGroup } from "./SectorChipGroup";
import type { SelectOption } from "./data";

export function FilterSidebar({
  sectors,
  selectedSectors,
  exchanges,
  countries,
  performanceOptions,
}: {
  sectors: readonly string[];
  selectedSectors: readonly string[];
  exchanges: SelectOption[];
  countries: SelectOption[];
  performanceOptions: SelectOption[];
}) {
  return (
    <aside className="flex flex-col gap-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <FilterSection title="FUNDAMENTALS">
        <MinMaxRow label="Market cap" defaultMin="1B" />
        <MinMaxRow label="P/E ratio" defaultMax="40" />
        <MinMaxRow label="Revenue growth" defaultMin="5%" />
        <MinMaxRow label="Dividend yield" />
        <MinMaxRow label="EPS growth" />
      </FilterSection>

      <FilterSection title="PRICE & VOLUME">
        <MinMaxRow label="Price ($)" defaultMin="10" />
        <MinMaxRow label="% change" />
        <MinMaxRow label="Avg volume" defaultMin="500K" />
        <div className="mt-1.5">
          <Select
            label="52W performance"
            options={performanceOptions}
            defaultValue={performanceOptions[0]?.value}
          />
        </div>
      </FilterSection>

      <FilterSection title="SECTOR">
        <SectorChipGroup sectors={sectors} selected={selectedSectors} />
      </FilterSection>

      <FilterSection title="EXCHANGE">
        <Select
          label="Exchange"
          options={exchanges}
          defaultValue={exchanges[0]?.value}
        />
        <Select
          label="Country"
          options={countries}
          defaultValue={countries[0]?.value}
        />
      </FilterSection>

      <div className="flex flex-col gap-2">
        <PrimaryButton>Run screener ↗</PrimaryButton>
        <SecondaryButton className="w-full">Reset filters</SecondaryButton>
      </div>
    </aside>
  );
}
