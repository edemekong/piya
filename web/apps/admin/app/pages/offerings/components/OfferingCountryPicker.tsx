import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@piya/ui";
import { countryOptions } from "./offering-editor-options";

function OfferingCountryPicker({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  const [open, setOpen] = React.useState(false);
  const selectedCountry = countryOptions.find(
    (option) => option.country === value,
  );

  function selectCountry(country: string) {
    onChange(country);
    setOpen(false);
  }

  return (
    <div className="relative grid gap-2">
      <span className="text-footnote font-normal text-[#2F4B4F]">{label}</span>
      <button
        className="flex h-12 items-center justify-between gap-3 rounded-sm border border-border bg-fill px-3 text-left text-callout text-[#2F4B4F] outline-none transition hover:bg-secondary/30 focus:border-primary focus:bg-white"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span
          className={cn(
            "inline-flex items-center gap-2",
            selectedCountry ? "font-semibold" : "text-[#2F4B4F]/45",
          )}
        >
          {selectedCountry ? (
            <>
              <span>{selectedCountry.flag}</span>
              <span>{selectedCountry.country}</span>
            </>
          ) : (
            "Select country"
          )}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-[#2F4B4F]/65 transition",
            open ? "rotate-180" : null,
          )}
        />
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-md border border-border bg-white py-2 text-callout text-[#2F4B4F] shadow-lg">
          {countryOptions.map((option) => (
            <button
              className="flex w-full items-center justify-between gap-3 border-b border-border px-4 py-3 text-left transition last:border-b-0 hover:bg-fill"
              key={option.country}
              onClick={() => selectCountry(option.country)}
              type="button"
            >
              <span className="inline-flex items-center gap-3 font-semibold">
                <span>{option.flag}</span>
                <span>{option.country}</span>
              </span>
              <span className="text-caption-1 text-[#2F4B4F]/55">
                {option.currency}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export { OfferingCountryPicker };
