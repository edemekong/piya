import * as React from "react";
import { cn } from "../lib/cn";

export type SegmentedTabItem<Value extends string> = {
  disabled?: boolean;
  icon?: React.ReactNode;
  label: React.ReactNode;
  value: Value;
};

export type SegmentedTabsProps<Value extends string> = {
  className?: string;
  itemClassName?: string;
  items: SegmentedTabItem<Value>[];
  onValueChange: (value: Value) => void;
  value: Value;
};

export function SegmentedTabs<Value extends string>({
  className,
  itemClassName,
  items,
  onValueChange,
  value,
}: SegmentedTabsProps<Value>) {
  return (
    <div
      className={cn("grid rounded-md bg-fill p-1", className)}
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map((item) => (
        <button
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-sm px-3 py-2 text-callout font-semibold transition sm:px-4",
            value === item.value
              ? "bg-white text-[#2F4B4F] shadow-sm"
              : "text-[#2F4B4F]/65",
            item.disabled && "cursor-not-allowed opacity-45",
            itemClassName,
          )}
          disabled={item.disabled}
          key={item.value}
          onClick={() => {
            if (!item.disabled) onValueChange(item.value);
          }}
          type="button"
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}
