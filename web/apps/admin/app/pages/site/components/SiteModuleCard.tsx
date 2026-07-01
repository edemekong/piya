import { Link2, Trash2 } from "lucide-react";
import { cn } from "@piya/ui";
import {
  getSiteModuleAccentClassName,
  getSiteModulePath,
} from "../site-modules";
import type {
  SiteFlowModule,
  SiteModuleDefinition,
  SiteModuleDisplay,
} from "../types";

type SiteModuleCardProps = {
  canRemove: boolean;
  definition: SiteModuleDefinition;
  display: SiteModuleDisplay;
  module: SiteFlowModule;
  onRemove: (flowId: string) => void;
  onSelect: (module: SiteFlowModule) => void;
  selected: boolean;
  siteUrl: string;
};

export function SiteModuleCard({
  canRemove,
  definition,
  display,
  module,
  onRemove,
  onSelect,
  selected,
  siteUrl,
}: SiteModuleCardProps) {
  const Icon = definition.icon;
  const moduleUrl = `${siteUrl}${getSiteModulePath(module.moduleId)}`;

  function selectModule() {
    onSelect(module);
  }

  return (
    <div
      className={cn(
        "group relative w-[23rem] cursor-grab rounded-xl border bg-white p-4 text-left shadow-sm transition active:cursor-grabbing",
        selected
          ? "border-primary ring-4 ring-primary/15"
          : "border-border hover:border-primary/50",
      )}
      onClick={selectModule}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectModule();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start gap-4">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-md ring-1",
            getSiteModuleAccentClassName(definition.groupId),
          )}
        >
          <Icon className="size-5" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-headline font-semibold text-[#111827]">
            {display.title}
          </p>
          <p className="mt-1 text-footnote font-normal text-[#6b7280]">
            {display.description}
          </p>
          <div className="group/url relative mt-3 min-w-0 border-t border-border pt-3">
            <div className="flex min-w-0 items-center gap-2 text-caption-2 text-[#6b7280]">
              <Link2 className="size-3.5 shrink-0" />
              <span className="truncate font-mono">{moduleUrl}</span>
            </div>
            <span className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-sm bg-[#102A2D] px-2 py-1 text-[11px] font-semibold text-white opacity-0 shadow-lg transition group-hover/url:opacity-100">
              {moduleUrl}
            </span>
          </div>
        </div>
      </div>

      {canRemove ? (
        <button
          aria-label={`Remove ${display.title}`}
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-md text-[#9ca3af] opacity-0 transition hover:bg-fill hover:text-error group-hover:opacity-100"
          data-canvas-action
          onClick={(event) => {
            event.stopPropagation();
            onRemove(module.flowId);
          }}
          type="button"
        >
          <Trash2 className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
