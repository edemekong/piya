import { ChevronDown } from "lucide-react";
import type { OverviewRange } from "@piya/shared/types";
import { overviewRangeOptions } from "../overview.mock";

type OverviewRangeSelectProps = {
  onChange: (value: OverviewRange) => void;
  value: OverviewRange;
};

export function OverviewRangeSelect({
  onChange,
  value,
}: OverviewRangeSelectProps) {
  return (
    <label className="inline-flex items-center gap-2 text-footnote font-semibold text-primary">
      <span className="sr-only">Date range</span>
      <span className="relative">
        <select
          className="h-10 appearance-none rounded-sm border border-border bg-fill py-0 pl-3 pr-10 text-footnote font-semibold text-primary outline-none transition focus:border-primary focus:bg-white"
          onChange={(event) => onChange(event.target.value as OverviewRange)}
          value={value}
        >
          {overviewRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-primary" />
      </span>
    </label>
  );
}
