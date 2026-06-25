import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@yinapp/ui";

type MultiSelectDropdownProps = {
  formatOption?: (option: string) => string;
  label: string;
  onChange: (selected: string[]) => void;
  options: string[];
  placeholder: string;
  selected: string[];
};

export function MultiSelectDropdown({
  formatOption = (option) => option,
  label,
  onChange,
  options,
  placeholder,
  selected,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);
  const summary =
    selected.length > 0 ? selected.map(formatOption).join(", ") : placeholder;

  React.useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  function toggleOption(option: string) {
    const nextSelected = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];

    onChange(nextSelected);
  }

  return (
    <div className="grid gap-2" ref={dropdownRef}>
      <span className="text-footnote font-semibold text-[#2F4B4F]">{label}</span>
      <div className="relative">
        <button
          aria-expanded={open}
          className={cn(
            "flex h-12 w-full items-center justify-between rounded-sm border border-border bg-fill px-3 text-left text-callout text-[#2F4B4F] outline-none transition focus-visible:border-primary focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/20",
            open && "border-primary bg-white",
          )}
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          <span
            className={cn(
              "truncate",
              selected.length === 0 && "text-[#2F4B4F]/45",
            )}
          >
            {summary}
          </span>
          <ChevronDown
            className={cn(
              "ml-3 size-4 shrink-0 text-[#2F4B4F]/45 transition",
              open && "rotate-180",
            )}
          />
        </button>

        {open ? (
          <div className="absolute left-0 right-0 top-14 z-20 rounded-md border border-border bg-white py-2 shadow-lg">
            {options.map((option) => {
              const checked = selected.includes(option);

              return (
                <button
                  className="flex w-full items-center gap-3 px-4 py-2 text-left text-callout text-[#2F4B4F] transition hover:bg-fill"
                  key={option}
                  onClick={() => toggleOption(option)}
                  type="button"
                >
                  <span
                    className={cn(
                      "flex size-4 items-center justify-center rounded-sm border",
                      checked
                        ? "border-primary bg-secondary text-primary"
                        : "border-border bg-fill",
                    )}
                  >
                    {checked ? <Check className="size-3" /> : null}
                  </span>
                  {formatOption(option)}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
