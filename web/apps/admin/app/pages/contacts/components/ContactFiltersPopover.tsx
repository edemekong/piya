import * as React from "react";
import {
  Check,
  ChevronRight,
  ListFilter,
  Tag,
  UserRoundCheck,
  X,
} from "lucide-react";
import { AppPopup, Button, cn } from "@piya/ui";
import type { ContactTagData } from "@piya/shared/models";
import type { ContactStatusType } from "@piya/shared/types";

type ContactFilterKey = "status" | "tag";

export type ContactFilters = {
  status: ContactStatusType | "";
  tagId: string;
};

type ContactFiltersPopoverProps = {
  contactTags: ContactTagData[];
  onApply: (filters: ContactFilters) => void;
  value: ContactFilters;
};

const filterItems: {
  icon: React.ComponentType<{ className?: string }>;
  key: ContactFilterKey;
  label: string;
}[] = [
  { icon: UserRoundCheck, key: "status", label: "Status" },
  { icon: Tag, key: "tag", label: "Tags" },
];

const statusOptions: { label: string; value: ContactStatusType }[] = [
  { label: "Active", value: "active" },
  { label: "Lead", value: "lead" },
  { label: "Inactive", value: "inactive" },
  { label: "Blocked", value: "blocked" },
];

export function ContactFiltersPopover({
  contactTags,
  onApply,
  value,
}: ContactFiltersPopoverProps) {
  const [activeFilter, setActiveFilter] =
    React.useState<ContactFilterKey>("status");
  const [draft, setDraft] = React.useState<ContactFilters>(value);
  const [open, setOpen] = React.useState(false);
  const [anchorElement, setAnchorElement] =
    React.useState<HTMLButtonElement | null>(null);
  const activeFilterCount = [value.status, value.tagId].filter(Boolean).length;

  function applyFilters() {
    onApply(draft);
    setOpen(false);
  }

  function clearFilters() {
    const emptyFilters: ContactFilters = { status: "", tagId: "" };
    setDraft(emptyFilters);
    onApply(emptyFilters);
    setOpen(false);
  }

  return (
    <div className="relative shrink-0">
      <button
        aria-expanded={open}
        aria-label="Filter contacts"
        className={cn(
          "relative flex size-11 items-center justify-center rounded-sm border border-border bg-fill text-[#2F4B4F]/70 transition hover:bg-secondary/40 hover:text-[#2F4B4F]",
          open && "border-primary bg-secondary/30 text-primary"
        )}
        onClick={(event) => {
          const nextOpen = !open;
          if (nextOpen) setDraft(value);
          setAnchorElement(event.currentTarget);
          setOpen(nextOpen);
        }}
        type="button"
      >
        <ListFilter className="size-5" />
        {activeFilterCount > 0 ? (
          <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
            {activeFilterCount}
          </span>
        ) : null}
      </button>

      <AppPopup
        anchorElement={anchorElement}
        className="w-[min(520px,calc(100vw-2rem))] overflow-hidden rounded-md border border-border bg-white shadow-xl"
        onClose={() => setOpen(false)}
        open={open}
        placement="bottom-end"
      >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <h3 className="text-headline font-semibold text-[#2F4B4F]">
                Filter contacts
              </h3>
            </div>
            <button
              aria-label="Close filters"
              className="flex size-9 items-center justify-center rounded-full text-[#2F4B4F]/60 hover:bg-fill"
              onClick={() => setOpen(false)}
              type="button"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="grid h-[300px] grid-cols-[180px_1fr]">
            <nav className="border-r border-border bg-fill/50 p-2">
              <div className="grid gap-1">
                {filterItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      className={cn(
                        "flex items-center justify-between gap-3 border-l-2 px-3 py-3 text-left text-callout font-semibold transition",
                        activeFilter === item.key
                          ? "border-primary bg-secondary/20 text-primary"
                          : "border-transparent text-[#2F4B4F]/70 hover:bg-white/70"
                      )}
                      key={item.key}
                      onClick={() => setActiveFilter(item.key)}
                      type="button"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Icon className="size-4" />
                        {item.label}
                      </span>
                      <ChevronRight className="size-4" />
                    </button>
                  );
                })}
              </div>
            </nav>

            <div className="min-w-0 overflow-y-auto p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {activeFilter === "status" ? (
                <FilterOptionList
                  onChange={(status) =>
                    setDraft((current) => ({
                      ...current,
                      status: status as ContactStatusType | "",
                    }))
                  }
                  options={statusOptions}
                  value={draft.status}
                />
              ) : null}

              {activeFilter === "tag" ? (
                <FilterOptionList
                  emptyMessage="No contact tags have been created yet."
                  onChange={(tagId) =>
                    setDraft((current) => ({ ...current, tagId }))
                  }
                  options={contactTags.map((tag) => ({
                    label: tag.name,
                    value: tag.id,
                  }))}
                  value={draft.tagId}
                />
              ) : null}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <button
              className="text-footnote font-semibold text-[#2F4B4F]/65 hover:text-[#2F4B4F]"
              onClick={clearFilters}
              type="button"
            >
              Clear all
            </button>
            <div className="flex items-center gap-2">
              <Button
                className="bg-fill text-[#2F4B4F] hover:bg-fill-secondary"
                onClick={() => setOpen(false)}
                size="sm"
                type="button"
                variant="secondary"
              >
                Cancel
              </Button>
              <Button onClick={applyFilters} size="sm" type="button">
                Apply filters
              </Button>
            </div>
          </div>
      </AppPopup>
    </div>
  );
}

function FilterOptionList({
  emptyMessage,
  onChange,
  options,
  value,
}: {
  emptyMessage?: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  value: string;
}) {
  if (options.length === 0) {
    return (
      <p className="text-callout text-[#2F4B4F]/60">
        {emptyMessage ?? "No options available."}
      </p>
    );
  }

  return (
    <div className="grid gap-1">
      <button
        className={cn(
          "flex w-full items-center justify-between px-3 py-3 text-left text-callout transition",
          value === "" ? "bg-secondary/30 text-primary" : "hover:bg-fill"
        )}
        onClick={() => onChange("")}
        type="button"
      >
        All
        {value === "" ? <Check className="size-4" /> : null}
      </button>
      {options.map((option) => (
        <button
          className={cn(
            "flex w-full items-center justify-between px-3 py-3 text-left text-callout transition",
            value === option.value
              ? "bg-secondary/30 text-primary"
              : "hover:bg-fill"
          )}
          key={option.value}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
          {value === option.value ? <Check className="size-4" /> : null}
        </button>
      ))}
    </div>
  );
}
