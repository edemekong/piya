import type * as React from "react";
import type { LucideIcon } from "lucide-react";
import { SectionHeader } from "./section-header";

export type SettingsSectionProps = {
  actions?: React.ReactNode;
  children: React.ReactNode;
  description: string;
  icon: LucideIcon;
  title: string;
};

export function SettingsSection({
  actions,
  children,
  description,
  icon: Icon,
  title,
}: SettingsSectionProps) {
  return (
    <section className="rounded-md bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
            <Icon className="size-6" />
          </span>
          <SectionHeader description={description} title={title} />
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>

      <div className="mt-8 grid gap-5">{children}</div>
    </section>
  );
}
