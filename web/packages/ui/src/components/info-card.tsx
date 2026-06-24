import * as React from "react";
import { cn } from "../lib/cn";

export type InfoCardProps = React.HTMLAttributes<HTMLDivElement> & {
  icon?: React.ReactNode;
  label: React.ReactNode;
  value?: React.ReactNode;
};

export function InfoCard({
  className,
  icon,
  label,
  value,
  ...props
}: InfoCardProps) {
  return (
    <div
      className={cn("rounded-md border border-border bg-fill/40 p-4", className)}
      {...props}
    >
      <div className="flex items-center gap-2 text-footnote font-semibold text-[#2F4B4F]/65">
        {icon}
        {label}
      </div>
      <p className="mt-2 break-words text-callout font-semibold text-[#2F4B4F]">
        {value || "Not provided"}
      </p>
    </div>
  );
}
