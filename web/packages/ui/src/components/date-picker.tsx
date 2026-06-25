import * as React from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { cn } from "../lib/cn";

export type AppDatePickerProps = {
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  onChange: (date: Date) => void;
  placeholder?: string;
  popoverAlign?: "left" | "right";
  value?: Date | null;
};

export function AppDatePicker({
  ariaLabel = "Choose date",
  className,
  disabled = false,
  onChange,
  placeholder = "Select date",
  popoverAlign = "left",
  value,
}: AppDatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const defaultClassNames = getDefaultClassNames();

  React.useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  return (
    <div className={cn("relative", className)} ref={rootRef}>
      <button
        aria-expanded={open}
        aria-label={ariaLabel}
        className={cn(
          "flex h-12 w-full items-center justify-between gap-3 rounded-sm border border-border bg-fill px-3 text-left text-callout text-[#2F4B4F] outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20",
          disabled && "cursor-not-allowed opacity-60",
        )}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="inline-flex min-w-0 items-center gap-2">
          <CalendarDays className="size-4 shrink-0 text-[#2F4B4F]/55" />
          <span className={cn(!value && "text-[#2F4B4F]/45")}>
            {value ? formatDate(value) : placeholder}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-[#2F4B4F]/55 transition",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div
          className={cn(
            "absolute top-full z-30 mt-2 rounded-md border border-border bg-white p-3 text-[#2F4B4F] shadow-lg",
            popoverAlign === "right" ? "right-0" : "left-0",
          )}
        >
          <DayPicker
            classNames={{
              ...defaultClassNames,
              root: "w-[292px]",
              months: "flex",
              month: "w-full",
              month_caption:
                "mb-3 flex h-9 items-center justify-center text-callout font-semibold text-[#2F4B4F]",
              nav: "absolute left-3 right-3 top-3 flex items-center justify-between",
              button_previous:
                "flex size-8 items-center justify-center rounded-md text-[#2F4B4F]/70 transition hover:bg-fill hover:text-[#2F4B4F]",
              button_next:
                "flex size-8 items-center justify-center rounded-md text-[#2F4B4F]/70 transition hover:bg-fill hover:text-[#2F4B4F]",
              chevron: "size-4",
              month_grid: "w-full border-collapse",
              weekdays: "grid grid-cols-7",
              weekday:
                "flex h-8 items-center justify-center text-caption-1 font-semibold text-[#2F4B4F]/50",
              weeks: "grid gap-1",
              week: "grid grid-cols-7 gap-1",
              day: "flex size-9 items-center justify-center",
              day_button:
                "flex size-9 items-center justify-center rounded-md text-callout text-[#2F4B4F] transition hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
              selected:
                "[&_button]:bg-primary [&_button]:font-semibold [&_button]:text-white [&_button]:hover:bg-primary",
              today: "[&_button]:border [&_button]:border-primary/40",
              outside: "[&_button]:text-[#2F4B4F]/30",
              disabled:
                "[&_button]:cursor-not-allowed [&_button]:text-[#2F4B4F]/25",
            }}
            fixedWeeks
            mode="single"
            onSelect={(selectedDate) => {
              if (!selectedDate) return;
              onChange(selectedDate);
              setOpen(false);
            }}
            selected={value ?? undefined}
            showOutsideDays
          />
        </div>
      ) : null}
    </div>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
