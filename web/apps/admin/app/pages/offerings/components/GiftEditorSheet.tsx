import * as React from "react";
import { CheckCircle2, ChevronDown, Plus } from "lucide-react";
import {
  AppSheet,
  AppTextareaField,
  AppTextField,
  Button,
  cn,
} from "@piya/ui";
import type { GiftData, GiftDraft } from "@piya/shared/services";
import {
  createEmptyGiftDraft,
  createGiftDraft,
  draftToGift,
} from "@piya/shared/services";
import { getOfferings } from "@piya/shared/services";

type EditorMode = "create" | "edit";

type GiftEditorSheetProps = {
  gift: GiftData | null;
  mode: EditorMode;
  onClose: () => void;
  onSave: (gift: GiftData) => void;
  open: boolean;
};

const currencies = [
  { code: "NGN", label: "Naira" },
  { code: "USD", label: "Dollar" },
  { code: "GHS", label: "Ghana cedi" },
  { code: "KES", label: "Kenya shilling" },
  { code: "ZAR", label: "South African rand" },
];
const offeringTagOptions = Array.from(
  new Set(getOfferings().flatMap((offering) => offering.tags)),
).sort();

export function GiftEditorSheet({
  gift,
  mode,
  onClose,
  onSave,
  open,
}: GiftEditorSheetProps) {
  const [draft, setDraft] = React.useState<GiftDraft>(createEmptyGiftDraft);
  const isEditing = mode === "edit";

  React.useEffect(() => {
    if (open) {
      setDraft(gift ? createGiftDraft(gift) : createEmptyGiftDraft());
    }
  }, [gift, open]);

  function updateDraft(updates: Partial<GiftDraft>) {
    setDraft((current) => ({ ...current, ...updates }));
  }

  function handleSave() {
    onSave(draftToGift({ ...draft, status: "active" }, gift));
    onClose();
  }

  return (
    <AppSheet
      ariaLabel={isEditing ? "edit gift sheet" : "create gift sheet"}
      footer={
        <>
          <Button onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button
            disabled={!draft.name.trim()}
            icon={<CheckCircle2 />}
            onClick={handleSave}
            type="button"
          >
            {isEditing ? "Save changes" : "Create gift"}
          </Button>
        </>
      }
      maxWidthClassName="max-w-2xl"
      onClose={onClose}
      open={open}
      title={isEditing ? "Edit gift" : "Create gift"}
    >
      <GiftForm draft={draft} onChange={updateDraft} />
    </AppSheet>
  );
}

export function GiftForm({
  draft,
  onChange,
}: {
  draft: GiftDraft;
  onChange: (updates: Partial<GiftDraft>) => void;
}) {
  return (
    <form className="grid gap-4">
      <TextField
        label="Gift name"
        onChange={(name) => onChange({ name })}
        placeholder="e.g. Mini Glow Serum"
        value={draft.name}
      />
      <TextAreaField
        label="Description"
        onChange={(description) => onChange({ description })}
        placeholder="Describe the gift customers receive."
        value={draft.description}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <MoneyField
          currency={draft.currency}
          label="Estimated value"
          onChange={(estimatedValue) => onChange({ estimatedValue })}
          onCurrencyChange={(currency) => onChange({ currency })}
          placeholder="8500"
          value={draft.estimatedValue}
        />
        <TextField
          label="Quantity available"
          onChange={(quantityAvailable) => onChange({ quantityAvailable })}
          placeholder="120"
          type="number"
          value={draft.quantityAvailable}
        />
        <TextField
          label="Max per contact"
          onChange={(maxPerContact) => onChange({ maxPerContact })}
          placeholder="1"
          type="number"
          value={draft.maxPerContact}
        />
        <TagPicker
          onChange={(tags) => onChange({ tags })}
          options={offeringTagOptions}
          selected={draft.tags}
        />
      </div>
      <ImageUploadBox
        label="Image"
        onChange={(imageUrl) => onChange({ imageUrl })}
        value={draft.imageUrl}
      />
    </form>
  );
}

function MoneyField({
  currency,
  label,
  onChange,
  onCurrencyChange,
  placeholder,
  value,
}: {
  currency: string;
  label: string;
  onChange: (value: string) => void;
  onCurrencyChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-footnote font-normal text-[#2F4B4F]">{label}</span>
      <div className="flex h-12 overflow-hidden rounded-sm border border-border bg-fill transition focus-within:border-primary focus-within:bg-white">
        <div className="relative flex w-20 shrink-0 items-center border-r border-border">
          <select
            aria-label={`${label} currency`}
            className="h-full w-full appearance-none bg-transparent py-0 pl-3 pr-8 text-callout font-semibold leading-none text-[#2F4B4F] outline-none"
            onChange={(event) => onCurrencyChange(event.target.value)}
            value={currency}
          >
            {currencies.map((option) => (
              <option key={option.code} value={option.code}>
                {option.code}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-[#2F4B4F]/65" />
        </div>
        <input
          className="min-w-0 flex-1 bg-transparent px-3 text-callout text-[#2F4B4F] outline-none placeholder:text-[#2F4B4F]/40"
          inputMode="decimal"
          onChange={(event) => onChange(parseFormattedAmount(event.target.value))}
          placeholder={placeholder}
          type="text"
          value={formatAmount(value)}
        />
      </div>
    </label>
  );
}

function TextField({
  label,
  onChange,
  placeholder,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
  value: string;
}) {
  return (
    <AppTextField
      label={label}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      type={type}
      value={value}
    />
  );
}

function TextAreaField({
  label,
  onChange,
  placeholder,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <AppTextareaField
      label={label}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      value={value}
    />
  );
}

function TagPicker({
  onChange,
  options,
  selected,
}: {
  onChange: (tags: string) => void;
  options: string[];
  selected: string;
}) {
  const [open, setOpen] = React.useState(false);
  const selectedTags = splitTags(selected);
  const label =
    selectedTags.length > 0 ? `${selectedTags.length} selected` : "Select tags";

  function toggle(tag: string) {
    const nextTags = selectedTags.includes(tag)
      ? selectedTags.filter((item) => item !== tag)
      : [...selectedTags, tag];

    onChange(nextTags.join(", "));
  }

  return (
    <fieldset className="relative grid gap-2">
      <span className="text-footnote font-normal text-[#2F4B4F]">Tags</span>
      <button
        className="flex h-12 items-center justify-between gap-3 rounded-sm border border-border bg-fill px-3 text-left text-callout text-[#2F4B4F] outline-none transition hover:bg-secondary/30 focus:border-primary focus:bg-white"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span
          className={selectedTags.length > 0 ? "font-semibold" : "text-[#2F4B4F]/45"}
        >
          {label}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-[#2F4B4F]/65 transition",
            open ? "rotate-180" : null,
          )}
        />
      </button>
      {open ? (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-64 overflow-y-auto rounded-md border border-border bg-white p-3 shadow-lg">
          <div className="flex flex-wrap gap-2">
            {options.map((tag) => {
              const active = selectedTags.includes(tag);

              return (
                <button
                  className={cn(
                    "rounded-md border px-3 py-2 text-callout font-semibold transition",
                    active
                      ? "border-primary bg-secondary text-primary"
                      : "border-border bg-fill text-[#2F4B4F]/70 hover:bg-secondary/40",
                  )}
                  key={tag}
                  onClick={() => toggle(tag)}
                  type="button"
                >
                  {formatTagLabel(tag)}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </fieldset>
  );
}

function ImageUploadBox({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  const [imageName, setImageName] = React.useState("");

  React.useEffect(() => {
    if (!value) {
      setImageName("");
    }
  }, [value]);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;

    setImageName(file.name);
    onChange(URL.createObjectURL(file));
  }

  return (
    <div className="grid gap-2">
      <span className="text-footnote font-normal text-[#2F4B4F]">{label}</span>
      <div className="flex flex-wrap gap-3">
        {value ? (
          <div
            className="flex size-24 items-center justify-center overflow-hidden rounded-md border border-border bg-fill text-center text-caption-1 font-semibold text-[#2F4B4F]/70"
            title={imageName || value}
          >
            {value.startsWith("blob:") || value.startsWith("http") ? (
              <img alt="" className="size-full object-cover" src={value} />
            ) : (
              <span className="line-clamp-2 break-all">{imageName || value}</span>
            )}
          </div>
        ) : null}
        <label className="flex size-24 cursor-pointer items-center justify-center rounded-md border border-dashed border-border bg-fill text-[#2F4B4F]/65 transition hover:border-primary hover:bg-secondary/30">
          <span className="flex flex-col items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-white shadow-sm">
              <Plus className="size-4" />
            </span>
            <span className="text-caption-1 font-semibold">Add image</span>
          </span>
          <input
            accept="image/*"
            className="sr-only"
            onChange={(event) => handleFiles(event.currentTarget.files)}
            type="file"
          />
        </label>
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

function formatTagLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatAmount(value: string) {
  if (!value) return "";

  const [wholePart, decimalPart] = value.split(".");
  const formattedWhole = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return decimalPart === undefined
    ? formattedWhole
    : `${formattedWhole}.${decimalPart}`;
}

function parseFormattedAmount(value: string) {
  const cleaned = value.replace(/,/g, "").replace(/[^\d.]/g, "");
  const [wholePart, ...decimalParts] = cleaned.split(".");

  if (decimalParts.length === 0) return wholePart;

  return `${wholePart}.${decimalParts.join("")}`;
}
