import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";

export type AppCheckboxProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "onChange" | "onClick"
> & {
  checked: boolean;
  label: string;
  onCheckedChange: (checked: boolean) => void;
};

export function AppCheckbox({
  checked,
  className,
  disabled,
  label,
  onCheckedChange,
  type = "button",
  ...props
}: AppCheckboxProps) {
  return (
    <button
      aria-checked={checked}
      aria-label={label}
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-sm border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        checked
          ? "border-primary bg-secondary text-primary"
          : "border-[#2F4B4F]/30 bg-white text-transparent hover:border-primary/50",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      role="checkbox"
      type={type}
      {...props}
    >
      <Check className="size-3.5 stroke-[3]" />
    </button>
  );
}
