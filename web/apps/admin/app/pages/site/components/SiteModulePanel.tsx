import * as React from "react";
import { ArrowLeft, Search } from "lucide-react";
import { cn } from "@piya/ui";
import {
  getSiteModuleAccentClassName,
  getSiteModuleDisplay,
  getSiteModuleGroupTitle,
  getSiteModuleRequirement,
  getVisibleSiteModules,
} from "../site-modules";
import type {
  SiteCategory,
  SiteModuleDefinition,
  SiteModuleGroupId,
  SiteModuleId,
} from "../types";

type SiteModulePanelProps = {
  activeGroupIds: SiteModuleGroupId[];
  activeGroupTitle: string;
  addedModuleIds: SiteModuleId[];
  category: SiteCategory;
  insertAfterTitle?: string;
  mode: "add" | "customize";
  onAddModule: (moduleId: SiteModuleId) => void;
  onBackToAdd: () => void;
  priorModuleIds: SiteModuleId[];
  selectedModule?: SiteModuleDefinition;
};

export function SiteModulePanel({
  activeGroupIds,
  activeGroupTitle,
  addedModuleIds,
  category,
  insertAfterTitle,
  mode,
  onAddModule,
  onBackToAdd,
  priorModuleIds,
  selectedModule,
}: SiteModulePanelProps) {
  const [search, setSearch] = React.useState("");
  const normalizedSearch = search.trim().toLowerCase();
  const visibleModules = getVisibleSiteModules(category);
  const groupedModules = activeGroupIds.map((groupId) => ({
    groupId,
    modules: visibleModules.filter((module) => {
      if (module.groupId !== groupId) return false;
      if (addedModuleIds.includes(module.id)) return false;
      if (getSiteModuleRequirement(module.id, priorModuleIds, category)) {
        return false;
      }
      if (!normalizedSearch) return true;

      const display = getSiteModuleDisplay(module, category);

      return [
        display.title,
        display.description,
        module.title,
        module.description,
        ...module.modelLabels,
        getSiteModuleGroupTitle(module.groupId),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    }),
    title: getSiteModuleGroupTitle(groupId),
  })).filter((group) => group.modules.length > 0);
  const SelectedIcon = selectedModule?.icon;
  const selectedModuleDisplay = selectedModule
    ? getSiteModuleDisplay(selectedModule, category)
    : undefined;

  return (
    <aside className="flex min-h-0 flex-col rounded-md border border-border bg-white shadow-sm">
      {mode === "customize" && selectedModule ? (
        <>
          <div className="border-b border-border p-5">
            <button
              className="mb-4 inline-flex items-center gap-2 text-callout font-semibold text-[#2F4B4F]/70 hover:text-primary"
              onClick={onBackToAdd}
              type="button"
            >
              <ArrowLeft className="size-4" />
              Add steps
            </button>

            <div className="flex items-start gap-3">
              {SelectedIcon ? (
                <span
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-md ring-1",
                    getSiteModuleAccentClassName(selectedModule.groupId),
                  )}
                >
                  <SelectedIcon className="size-5" />
                </span>
              ) : null}
              <div>
                <p className="text-title-3 font-semibold text-[#111827]">
                  {selectedModuleDisplay?.title}
                </p>
                <p className="mt-1 text-footnote text-[#6b7280]">
                  {selectedModuleDisplay?.description}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <div className="grid gap-5">
              <section className="grid gap-3">
                <p className="text-callout font-semibold text-[#2F4B4F]">
                  Connected data
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedModule.modelLabels.map((label) => (
                    <span
                      className="rounded-md border border-border bg-fill px-3 py-1.5 text-footnote font-semibold text-[#2F4B4F]/75"
                      key={label}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </section>

              <section className="grid gap-3">
                <p className="text-callout font-semibold text-[#2F4B4F]">
                  Settings
                </p>
                <div className="rounded-md border border-dashed border-border bg-background p-4 text-callout text-[#2F4B4F]/65">
                  Step settings will be added here.
                </div>
              </section>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="border-b border-border p-4">
            <p className="text-title-3 font-semibold text-[#111827]">
              Add a step
            </p>
            <p className="mt-1 text-footnote text-[#6b7280]">
              {insertAfterTitle
                ? `Next after ${insertAfterTitle}`
                : "Choose where customers begin"}
            </p>

            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#2F4B4F]/50" />
              <input
                className="h-10 w-full rounded-sm border border-border bg-fill pl-9 pr-3 text-callout text-[#2F4B4F] outline-none transition placeholder:text-[#2F4B4F]/40 focus:border-primary focus:bg-white"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search steps"
                type="search"
                value={search}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
            <div className="grid gap-5">
              {groupedModules.map((group) => (
                <section className="grid gap-2" key={group.groupId}>
                  <div className="flex items-center justify-between px-1">
                    <p className="text-footnote font-semibold text-[#6b7280]">
                      {group.title || activeGroupTitle}
                    </p>
                  </div>

                  {group.modules.map((module) => {
                    const Icon = module.icon;
                    const display = getSiteModuleDisplay(module, category);

                    return (
                      <div
                        className="group flex w-full min-w-0 items-center gap-2 rounded-md p-2 hover:bg-fill"
                        key={module.id}
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <span
                            className={cn(
                              "flex size-10 shrink-0 items-center justify-center rounded-md ring-1",
                              getSiteModuleAccentClassName(module.groupId),
                            )}
                          >
                            <Icon className="size-5" />
                          </span>
                          <span className="min-w-0 flex-1 pb-2">
                            <span className="block truncate text-callout font-semibold text-[#374151]">
                              {display.title}
                            </span>
                            <span className="block truncate text-caption-2 text-[#6b7280]">
                              {display.description}
                            </span>
                          </span>
                        </div>

                        <button
                          className={cn(
                            "shrink-0 rounded-md border border-border px-2 py-1 text-footnote font-semibold text-[#6b7280]",
                            "opacity-0 transition hover:border-primary hover:text-primary group-hover:opacity-100",
                          )}
                          onClick={() => onAddModule(module.id)}
                          type="button"
                        >
                          Add
                        </button>
                      </div>
                    );
                  })}
                </section>
              ))}
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
