import * as React from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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

const CALENDAR_START_MONTH = new Date(1900, 0);
const CALENDAR_END_MONTH = new Date(2100, 11);
const YEAR_PICKER_START = 1960;

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
  const [yearPickerOpen, setYearPickerOpen] = React.useState(false);
  const [displayedMonth, setDisplayedMonth] = React.useState(() =>
    getMonthStart(value ?? new Date()),
  );
  const rootRef = React.useRef<HTMLDivElement>(null);
  const defaultClassNames = getDefaultClassNames();
  const years = React.useMemo(() => getYearOptions(), []);
  const previousMonth = React.useMemo(
    () => addMonths(displayedMonth, -1),
    [displayedMonth],
  );
  const nextMonth = React.useMemo(
    () => addMonths(displayedMonth, 1),
    [displayedMonth],
  );
  const canShowPreviousMonth =
    previousMonth.getTime() >= CALENDAR_START_MONTH.getTime();
  const canShowNextMonth = nextMonth.getTime() <= CALENDAR_END_MONTH.getTime();

  React.useEffect(() => {
    if (open) {
      setDisplayedMonth(getMonthStart(value ?? new Date()));
    } else {
      setYearPickerOpen(false);
    }
  }, [open, value]);

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
          <div className="relative mb-3 flex h-9 items-center justify-between gap-3">
            <button
              aria-expanded={yearPickerOpen}
              aria-label="Choose year"
              className="inline-flex h-9 min-w-32 items-center justify-between gap-2 rounded-sm border border-border bg-fill px-2 text-footnote font-semibold text-[#2F4B4F] outline-none transition hover:bg-white focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
              onClick={() => setYearPickerOpen((current) => !current)}
              type="button"
            >
              {formatMonthYear(displayedMonth)}
              <ChevronDown
                className={cn(
                  "size-3.5 shrink-0 text-[#2F4B4F]/55 transition",
                  yearPickerOpen && "rotate-180",
                )}
              />
            </button>

            <div className="flex items-center gap-1">
              <button
                aria-label="Previous month"
                className="flex size-8 items-center justify-center rounded-md text-[#2F4B4F]/70 transition hover:bg-fill hover:text-[#2F4B4F] disabled:cursor-not-allowed disabled:text-[#2F4B4F]/25 disabled:hover:bg-transparent"
                disabled={!canShowPreviousMonth}
                onClick={() => setDisplayedMonth(previousMonth)}
                type="button"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                aria-label="Next month"
                className="flex size-8 items-center justify-center rounded-md text-[#2F4B4F]/70 transition hover:bg-fill hover:text-[#2F4B4F] disabled:cursor-not-allowed disabled:text-[#2F4B4F]/25 disabled:hover:bg-transparent"
                disabled={!canShowNextMonth}
                onClick={() => setDisplayedMonth(nextMonth)}
                type="button"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            {yearPickerOpen ? (
              <div className="absolute left-0 top-full z-40 mt-2 w-48 rounded-md border border-border bg-white p-2 shadow-lg">
                <div className="grid max-h-64 grid-cols-3 gap-1 overflow-y-auto pr-1">
                  {years.map((year) => {
                    const isSelected = displayedMonth.getFullYear() === year;

                    return (
                      <button
                        aria-pressed={isSelected}
                        className={cn(
                          "flex h-8 items-center justify-center rounded-md text-footnote text-[#2F4B4F] transition hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                          isSelected &&
                            "bg-primary font-semibold text-white hover:bg-primary",
                        )}
                        key={year}
                        onClick={() => {
                          setDisplayedMonth(
                            new Date(year, displayedMonth.getMonth()),
                          );
                          setYearPickerOpen(false);
                        }}
                        type="button"
                      >
                        {year}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <DayPicker
            classNames={{
              ...defaultClassNames,
              root: "w-[292px]",
              months: "flex",
              month: "w-full",
              month_caption: "hidden",
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
            hideNavigation
            mode="single"
            month={displayedMonth}
            onMonthChange={setDisplayedMonth}
            onSelect={(selectedDate) => {
              if (!selectedDate) return;
              onChange(selectedDate);
              setOpen(false);
            }}
            selected={value ?? undefined}
            showOutsideDays
            startMonth={CALENDAR_START_MONTH}
            endMonth={CALENDAR_END_MONTH}
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

function formatMonthYear(date: Date) {
  const month = new Intl.DateTimeFormat("en", {
    month: "long",
  }).format(date);

  return `${month}, ${date.getFullYear()}`;
}

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth());
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months);
}

function getYearOptions() {
  const currentYear = new Date().getFullYear();
  return Array.from(
    { length: currentYear - YEAR_PICKER_START + 1 },
    (_, index) => YEAR_PICKER_START + index,
  );
}
