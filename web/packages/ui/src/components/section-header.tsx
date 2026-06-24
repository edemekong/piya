import * as React from "react";
import { cn } from "../lib/cn";

export type SectionHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  description?: React.ReactNode;
  title: React.ReactNode;
};

export function SectionHeader({
  className,
  description,
  title,
  ...props
}: SectionHeaderProps) {
  return (
    <div className={cn(className)} {...props}>
      <h3 className="text-title-3 font-semibold text-[#2F4B4F]">{title}</h3>
      {description ? (
        <p className="mt-1 text-callout text-[#2F4B4F]/70">{description}</p>
      ) : null}
    </div>
  );
}
