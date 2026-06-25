import type * as React from "react";
import { cn } from "../lib/cn";

export type SettingsCardProps = {
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  title: string;
};

export function SettingsCard({
  actions,
  children,
  className,
  title,
}: SettingsCardProps) {
  return (
    <div className={cn("rounded-md border border-border p-5", className)}>
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-headline font-semibold text-[#2F4B4F]">{title}</h3>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      <div className="mt-4 grid gap-4">{children}</div>
    </div>
  );
}
