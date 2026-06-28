import * as React from "react";
import { Check, ChevronDown, Clock } from "lucide-react";
import { cn } from "../lib/cn";

export type AppTimePickerProps = {
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  minuteStep?: number;
  onChange: (time: string) => void;
  popoverAlign?: "left" | "right";
  value: string;
};

export function AppTimePicker({
  ariaLabel = "Choose time",
  className,
  disabled = false,
  minuteStep = 1,
  onChange,
  popoverAlign = "left",
  value,
}: AppTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const selectedTime = parseTimeValue(value);
  const minuteOptions = getMinuteOptions(minuteStep, selectedTime.minute);

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

  function selectTime(updates: Partial<SelectedTime>) {
    const nextTime = { ...selectedTime, ...updates };
    onChange(formatTimeValue(nextTime));
  }

  return (
    <div className={cn("relative", className)} ref={rootRef}>
      <button
        aria-expanded={open}
        aria-label={ariaLabel}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-sm border border-border bg-fill px-3 text-left text-callout text-[#2F4B4F] outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20",
          disabled && "cursor-not-allowed opacity-60",
        )}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="inline-flex min-w-0 items-center gap-2">
          <Clock className="size-4 shrink-0 text-[#2F4B4F]/55" />
          <span className="tabular-nums">{formatTimeLabel(selectedTime)}</span>
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
            "absolute top-full z-30 mt-2 grid w-[260px] grid-cols-[1fr_1fr_72px] items-start gap-2 rounded-md border border-border bg-white p-2 text-[#2F4B4F] shadow-lg",
            popoverAlign === "right" ? "right-0" : "left-0",
          )}
        >
          <TimeOptionList
            label="Hour"
            options={hourOptions}
            selectedValue={String(selectedTime.hour12)}
            onSelect={(hour) => selectTime({ hour12: Number(hour) })}
          />
          <TimeOptionList
            label="Minute"
            options={minuteOptions}
            selectedValue={String(selectedTime.minute)}
            onSelect={(minute) => selectTime({ minute: Number(minute) })}
          />
          <TimeOptionList
            label="Period"
            options={periodOptions}
            selectedValue={selectedTime.period}
            onSelect={(period) =>
              selectTime({ period: period as SelectedTime["period"] })
            }
          />
        </div>
      ) : null}
    </div>
  );
}

type TimeOption = {
  label: string;
  value: string;
};

type SelectedTime = {
  hour12: number;
  minute: number;
  period: "AM" | "PM";
};

const hourOptions = Array.from({ length: 12 }, (_, index) => {
  const hour = index + 1;
  return {
    label: String(hour),
    value: String(hour),
  };
});

const periodOptions = [
  { label: "AM", value: "AM" },
  { label: "PM", value: "PM" },
];

function TimeOptionList({
  label,
  onSelect,
  options,
  selectedValue,
}: {
  label: string;
  onSelect: (value: string) => void;
  options: TimeOption[];
  selectedValue: string;
}) {
  const selectedRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: "center" });
  }, [selectedValue]);

  return (
    <div className="grid content-start gap-1">
      <span className="px-2 text-caption-1 font-semibold uppercase text-[#2F4B4F]/45">
        {label}
      </span>
      <div className="max-h-48 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {options.map((option) => {
          const selected = option.value === selectedValue;

          return (
            <button
              className={cn(
                "flex h-9 w-full items-center justify-between gap-2 rounded-sm px-2 text-left text-callout transition hover:bg-secondary/40",
                selected && "bg-secondary font-semibold text-primary",
              )}
              key={option.value}
              onClick={() => onSelect(option.value)}
              ref={selected ? selectedRef : undefined}
              type="button"
            >
              <span className="tabular-nums">{option.label}</span>
              {selected ? <Check className="size-4" /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function parseTimeValue(value: string): SelectedTime {
  const [hourValue = "9", minuteValue = "0"] = value.split(":");
  const hour24 = numberInRange(hourValue, 0, 23);
  const minute = numberInRange(minuteValue, 0, 59);
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;

  return { hour12, minute, period };
}

function formatTimeValue(time: SelectedTime) {
  const hour24 =
    time.period === "PM"
      ? time.hour12 === 12
        ? 12
        : time.hour12 + 12
      : time.hour12 === 12
        ? 0
        : time.hour12;

  return `${String(hour24).padStart(2, "0")}:${String(time.minute).padStart(
    2,
    "0",
  )}`;
}

function formatTimeLabel(time: SelectedTime) {
  return `${time.hour12}:${String(time.minute).padStart(2, "0")} ${
    time.period
  }`;
}

function getMinuteOptions(step: number, selectedMinute: number) {
  const safeStep = Math.min(Math.max(Math.floor(step), 1), 60);
  const minutes = new Set<number>();

  for (let minute = 0; minute < 60; minute += safeStep) {
    minutes.add(minute);
  }

  minutes.add(selectedMinute);

  return Array.from(minutes)
    .sort((a, b) => a - b)
    .map((minute) => ({
      label: String(minute).padStart(2, "0"),
      value: String(minute),
    }));
}

function numberInRange(value: string, min: number, max: number) {
  const parsed = Number(value.replace(/\D/g, ""));
  if (!Number.isFinite(parsed)) return min;

  return Math.min(Math.max(parsed, min), max);
}
