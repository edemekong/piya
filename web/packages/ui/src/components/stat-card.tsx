import * as React from "react";
import { cn } from "../lib/cn";

export type StatCardProps = React.HTMLAttributes<HTMLDivElement> & {
  icon?: React.ReactNode;
  label: React.ReactNode;
  value: React.ReactNode;
};

export function StatCard({
  className,
  icon,
  label,
  value,
  ...props
}: StatCardProps) {
  return (
    <div
      className={cn("rounded-md border border-border bg-white p-4", className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-footnote text-[#2F4B4F]/65">{label}</p>
        {icon ? (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
            {icon}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-title-3 font-semibold text-[#2F4B4F]">{value}</p>
    </div>
  );
}
