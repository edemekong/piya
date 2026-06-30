import * as React from "react";
import { ChevronDown, Plus, X } from "lucide-react";
import { Button, cn } from "@piya/ui";
import { formatOfferingLabel } from "@piya/shared/utils";
import {
  maxOfferingTags,
  predefinedTagsByType,
  type TaggableOfferingType,
} from "./offering-editor-options";

function OfferingTagPicker({
  onChange,
  selected,
  type,
}: {
  onChange: (tags: string) => void;
  selected: string;
  type: TaggableOfferingType;
}) {
  const [draft, setDraft] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const tagOptions = predefinedTagsByType[type];
  const selectedTags = splitTags(selected);

  React.useEffect(() => {
    if (!open) return;

    function closeOnOutsidePress(event: PointerEvent) {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsidePress);
  }, [open]);

  React.useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function updateTags(tags: string[]) {
    onChange(tags.join(", "));
  }

  function addTag() {
    const nextTag = draft.trim().replace(/\s+/g, " ");
    const isDuplicate = selectedTags.some(
      (tag) => tag.toLocaleLowerCase() === nextTag.toLocaleLowerCase(),
    );

    if (!nextTag || isDuplicate || selectedTags.length >= maxOfferingTags) {
      return;
    }

    updateTags([...selectedTags, nextTag]);
    setDraft("");
  }

  function removeTag(tagToRemove: string) {
    updateTags(selectedTags.filter((tag) => tag !== tagToRemove));
  }

  function toggleSuggestedTag(suggestedTag: string) {
    const selectedTag = selectedTags.find(
      (tag) => tag.toLocaleLowerCase() === suggestedTag.toLocaleLowerCase(),
    );

    if (selectedTag) {
      removeTag(selectedTag);
      return;
    }

    if (selectedTags.length < maxOfferingTags) {
      updateTags([...selectedTags, suggestedTag]);
    }
  }

  return (
    <div className="grid gap-2" ref={rootRef}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-footnote font-normal text-[#2F4B4F]">Tags</span>
        <span className="text-caption-1 text-[#2F4B4F]/50">
          {selectedTags.length}/{maxOfferingTags}
        </span>
      </div>
      <div className="relative">
        <div
          className={cn(
            "flex min-h-12 w-full items-center justify-between gap-3 rounded-sm border border-border bg-fill px-3 py-2 text-left text-callout text-[#2F4B4F] outline-none transition focus-visible:ring-2 focus-visible:ring-primary/20",
            open && "border-primary bg-white",
          )}
        >
          <span className="flex min-w-0 flex-1 flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <button
                aria-label={`Remove ${tag}`}
                className="inline-flex max-w-full items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-caption-1 font-semibold text-[#2F4B4F]"
                key={tag}
                onClick={() => removeTag(tag)}
                type="button"
              >
                <span className="truncate">{tag}</span>
                <X className="size-3 shrink-0" />
              </button>
            ))}
            {selectedTags.length < maxOfferingTags ? (
              <button
                className="min-w-20 flex-1 text-left text-[#2F4B4F]/40"
                onClick={() => setOpen(true)}
                type="button"
              >
                {selectedTags.length > 0 ? "Add tag" : "Add tags"}
              </button>
            ) : null}
          </span>
          <button
            aria-expanded={open}
            aria-label="Add tags"
            className="flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-secondary/60"
            onClick={() => setOpen((current) => !current)}
            type="button"
          >
            <ChevronDown
              className={cn(
                "size-4 text-[#2F4B4F]/55 transition",
                open && "rotate-180",
              )}
            />
          </button>
        </div>

        {open ? (
          <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-md border border-border bg-white p-3 shadow-lg">
            <div className="flex gap-2">
              <input
                className="h-10 min-w-0 flex-1 rounded-sm border border-border bg-fill px-3 text-callout text-[#2F4B4F] outline-none placeholder:text-[#2F4B4F]/40 focus:border-primary focus:bg-white"
                maxLength={40}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Type a tag"
                ref={inputRef}
                value={draft}
              />
              <Button
                disabled={
                  !draft.trim() || selectedTags.length >= maxOfferingTags
                }
                icon={<Plus />}
                onClick={addTag}
                size="sm"
                type="button"
              >
                Add
              </Button>
            </div>
            {selectedTags.length >= maxOfferingTags ? (
              <p className="mt-2 text-caption-1 text-[#2F4B4F]/55">
                Maximum of {maxOfferingTags} tags reached.
              </p>
            ) : null}
            <div className="mt-4 border-t border-border pt-3">
              <p className="text-caption-1 font-semibold text-[#2F4B4F]/65">
                Suggested tags
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {tagOptions.map((tag) => {
                  const active = selectedTags.some(
                    (selectedTag) =>
                      selectedTag.toLocaleLowerCase() ===
                      tag.toLocaleLowerCase(),
                  );

                  return (
                    <button
                      aria-pressed={active}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-caption-1 font-semibold transition",
                        active
                          ? "border-primary bg-secondary text-primary"
                          : "border-border bg-fill text-[#2F4B4F]/75 hover:border-primary/50",
                        selectedTags.length >= maxOfferingTags &&
                          !active &&
                          "cursor-not-allowed opacity-45",
                      )}
                      disabled={
                        selectedTags.length >= maxOfferingTags && !active
                      }
                      key={tag}
                      onClick={() => toggleSuggestedTag(tag)}
                      type="button"
                    >
                      {formatOfferingLabel(tag)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function splitTags(tags: string) {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export { OfferingTagPicker };
