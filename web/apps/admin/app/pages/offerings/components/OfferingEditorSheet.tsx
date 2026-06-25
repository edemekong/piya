import * as React from "react";
import {
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Plus,
  Sparkles,
} from "lucide-react";
import { AppSheet, Button, SegmentedTabs, cn } from "@yinapp/ui";
import type {
  OfferingData,
  OfferingSubType,
  OfferingType,
} from "@/services/offerings.service";
import {
  createEmptyOfferingDraft,
  createOfferingDraft,
  draftToOffering,
  formatOfferingLabel,
  type OfferingFormDraft,
} from "./offeringForm";

type EditorMode = "create" | "edit";
type EditorTab = "manual" | "ai";

type OfferingEditorSheetProps = {
  mode: EditorMode;
  offering: OfferingData | null;
  onClose: () => void;
  onSave: (offering: OfferingData) => void;
  open: boolean;
};

const editorTabs = [
  {
    icon: <ClipboardList className="size-4" />,
    label: "Manual",
    value: "manual",
  },
  {
    icon: <Sparkles className="size-4" />,
    label: "AI",
    value: "ai",
  },
] satisfies { icon: React.ReactNode; label: string; value: EditorTab }[];

const subTypesByType: Record<OfferingType, OfferingSubType[]> = {
  product: ["physical", "digital"],
  service: [
    "consultation",
    "consultation_online",
    "event",
    "event_online",
    "digital_service",
  ],
};
const predefinedTagsByType: Record<OfferingType, string[]> = {
  product: [
  "starter",
  "bundle",
  "digital",
  "skin-care",
  "featured",
  "seasonal",
  ],
  service: [
    "consultation",
    "virtual",
    "event",
    "training",
    "featured",
    "seasonal",
  ],
};
const currencies = [
  { code: "NGN", label: "Naira" },
  { code: "USD", label: "Dollar" },
  { code: "GHS", label: "Ghana cedi" },
  { code: "KES", label: "Kenya shilling" },
  { code: "ZAR", label: "South African rand" },
];
const countryOptions = [
  { country: "Nigeria", currency: "NGN", flag: "🇳🇬" },
  { country: "United States", currency: "USD", flag: "🇺🇸" },
  { country: "Ghana", currency: "GHS", flag: "🇬🇭" },
  { country: "Kenya", currency: "KES", flag: "🇰🇪" },
  { country: "South Africa", currency: "ZAR", flag: "🇿🇦" },
];

function formatSubTypeLabel(subType: OfferingSubType) {
  if (subType === "consultation_online") return "Consultation | Online";
  if (subType === "event_online") return "Event | Online";

  return formatOfferingLabel(subType);
}

export function OfferingEditorSheet({
  mode,
  offering,
  onClose,
  onSave,
  open,
}: OfferingEditorSheetProps) {
  const [activeTab, setActiveTab] = React.useState<EditorTab>("manual");
  const [draft, setDraft] = React.useState<OfferingFormDraft>(
    createEmptyOfferingDraft,
  );

  React.useEffect(() => {
    if (open) {
      setActiveTab("manual");
      setDraft(offering ? createOfferingDraft(offering) : createEmptyOfferingDraft());
    }
  }, [offering, open]);

  const isEditing = mode === "edit";

  function updateDraft(updates: Partial<OfferingFormDraft>) {
    setDraft((current) => ({ ...current, ...updates }));
  }

  function handleTypeChange(type: OfferingType | "") {
    setDraft((current) => ({
      ...current,
      duration: "",
      features: [],
      imageUrl: "",
      imageUrls: "",
      locationAddress: "",
      locationCity: "",
      locationCountry: "",
      locationPostalCode: "",
      locationState: "",
      meetingLink: "",
      quantity: "",
      subType: "",
      type,
    }));
  }

  function handleSave(status: "draft" | "active") {
    onSave(draftToOffering({ ...draft, status }, offering));
    onClose();
  }

  return (
    <AppSheet
      ariaLabel={isEditing ? "edit offering sheet" : "create offering sheet"}
      footer={
        <>
          <Button
            className="bg-fill text-[#2F4B4F] hover:bg-fill-secondary"
            disabled={!draft.name.trim() || !draft.type}
            onClick={() => handleSave("draft")}
            type="button"
            variant="secondary"
          >
            Save draft
          </Button>
          <Button
            disabled={!draft.name.trim() || !draft.type}
            icon={<CheckCircle2 />}
            onClick={() => handleSave("active")}
            type="button"
          >
            Publish
          </Button>
        </>
      }
      maxWidthClassName="max-w-2xl"
      onClose={onClose}
      open={open}
      title={isEditing ? "Edit offering" : "Create offering"}
    >
      <div className="grid gap-5">
        <SegmentedTabs
          items={editorTabs}
          onValueChange={setActiveTab}
          value={activeTab}
        />

        {activeTab === "manual" ? (
          <ManualOfferingForm
            draft={draft}
            onChange={updateDraft}
            onTypeChange={handleTypeChange}
          />
        ) : (
          <AiOfferingPanel />
        )}
      </div>
    </AppSheet>
  );
}

function ManualOfferingForm({
  draft,
  onChange,
  onTypeChange,
}: {
  draft: OfferingFormDraft;
  onChange: (updates: Partial<OfferingFormDraft>) => void;
  onTypeChange: (type: OfferingType | "") => void;
}) {
  const showServiceLocation =
    draft.type === "service" &&
    (draft.subType === "consultation" || draft.subType === "event");
  const showMeetingLink =
    draft.type === "service" &&
    (draft.subType === "consultation_online" ||
      draft.subType === "event_online");

  return (
    <form className="grid gap-4">
      <TextField
        label="Name"
        onChange={(name) => onChange({ name })}
        placeholder="e.g. Starter Skincare Kit"
        value={draft.name}
      />
      <TextAreaField
        label="Description"
        onChange={(description) => onChange({ description })}
        placeholder="Describe the offering"
        value={draft.description}
      />
      <SelectField
        label="Type"
        onChange={(type) => onTypeChange(type as OfferingType | "")}
        options={[
          { label: "Select type", value: "" },
          { label: "Product", value: "product" },
          { label: "Service", value: "service" },
        ]}
        value={draft.type}
      />

      {draft.type === "product" ? (
        <div className="grid gap-4 border-t border-border pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Sub type"
              onChange={(subType) => onChange({ subType: subType as OfferingSubType })}
              options={[
                { label: "Select sub type", value: "" },
                ...subTypesByType.product.map((subType) => ({
                  label: formatSubTypeLabel(subType),
                  value: subType,
                })),
              ]}
              value={draft.subType}
            />
            <PriceField
              currency={draft.currency}
              label="Price"
              onCurrencyChange={(currency) => onChange({ currency })}
              onChange={(price) => onChange({ price })}
              placeholder="45000"
              value={draft.price}
            />
            <TextField
              label="Quantity"
              onChange={(quantity) => onChange({ quantity })}
              placeholder="36"
              type="number"
              value={draft.quantity}
            />
            <TagPicker
              onChange={(tags) => onChange({ tags })}
              selected={draft.tags}
              type="product"
            />
          </div>
          <ImageUploadBoxes label="Images" />
        </div>
      ) : null}

      {draft.type === "service" ? (
        <div className="grid gap-4 border-t border-border pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Sub type"
              onChange={(subType) => onChange({ subType: subType as OfferingSubType })}
              options={[
                { label: "Select sub type", value: "" },
                ...subTypesByType.service.map((subType) => ({
                  label: formatSubTypeLabel(subType),
                  value: subType,
                })),
              ]}
              value={draft.subType}
            />
            <PriceField
              currency={draft.currency}
              label="Price"
              onCurrencyChange={(currency) => onChange({ currency })}
              onChange={(price) => onChange({ price })}
              placeholder="30000"
              value={draft.price}
            />
            <TextField
              label="Duration"
              onChange={(duration) => onChange({ duration })}
              placeholder="Minutes"
              type="number"
              value={draft.duration}
            />
            <TagPicker
              onChange={(tags) => onChange({ tags })}
              selected={draft.tags}
              type="service"
            />
          </div>
          <ImageUploadBoxes label="Image" />
          {showMeetingLink ? (
            <TextField
              label="Meeting link"
              onChange={(meetingLink) => onChange({ meetingLink })}
              placeholder="https://meet.google.com/..."
              type="url"
              value={draft.meetingLink}
            />
          ) : null}
          {showServiceLocation ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Address"
                onChange={(locationAddress) => onChange({ locationAddress })}
                placeholder="12 Admiralty Way"
                value={draft.locationAddress}
              />
              <TextField
                label="City"
                onChange={(locationCity) => onChange({ locationCity })}
                placeholder="Lekki"
                value={draft.locationCity}
              />
              <TextField
                label="State"
                onChange={(locationState) => onChange({ locationState })}
                placeholder="Lagos"
                value={draft.locationState}
              />
              <CountryPicker
                label="Country"
                onChange={(locationCountry) => onChange({ locationCountry })}
                value={draft.locationCountry}
              />
              <TextField
                label="Postal code"
                onChange={(locationPostalCode) =>
                  onChange({ locationPostalCode })
                }
                placeholder="105102"
                value={draft.locationPostalCode}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}

function TagPicker({
  onChange,
  selected,
  type,
}: {
  onChange: (tags: string) => void;
  selected: string;
  type: OfferingType;
}) {
  const [open, setOpen] = React.useState(false);
  const tagOptions = predefinedTagsByType[type];
  const selectedTags = splitTags(selected);
  const label =
    selectedTags.length > 0
      ? `${selectedTags.length} selected`
      : "Select tags";

  function toggle(tag: string) {
    const nextTags = selectedTags.includes(tag)
      ? selectedTags.filter((item) => item !== tag)
      : [...selectedTags, tag];

    onChange(nextTags.join(", "));
  }

  return (
    <fieldset className="relative grid gap-2">
      <span className="text-footnote font-semibold text-[#2F4B4F]">
        Tags
      </span>
      <button
        className="flex h-12 items-center justify-between gap-3 rounded-sm border border-border bg-fill px-3 text-left text-callout text-[#2F4B4F] outline-none transition hover:bg-secondary/30 focus:border-primary focus:bg-white"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span
          className={
            selectedTags.length > 0 ? "font-semibold" : "text-[#2F4B4F]/45"
          }
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
            {tagOptions.map((tag) => {
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
                  {formatOfferingLabel(tag)}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </fieldset>
  );
}

function ImageUploadBoxes({
  label,
}: {
  label: string;
}) {
  const [images, setImages] = React.useState<string[]>([]);

  function handleFiles(files: FileList | null) {
    if (!files?.length) return;

    setImages((current) => [
      ...current,
      ...Array.from(files).map((file) => file.name),
    ]);
  }

  return (
    <div className="grid gap-2">
      <span className="text-footnote font-semibold text-[#2F4B4F]">{label}</span>
      <div className="flex flex-wrap gap-3">
        {images.map((imageName, index) => (
          <div
            className="flex size-24 items-center justify-center rounded-md border border-border bg-fill px-2 text-center text-caption-1 font-semibold text-[#2F4B4F]/70"
            key={`${imageName}_${index}`}
            title={imageName}
          >
            <span className="line-clamp-2 break-all">{imageName}</span>
          </div>
        ))}
        <label
          className="flex size-24 cursor-pointer items-center justify-center rounded-md border border-dashed border-border bg-fill text-[#2F4B4F]/65 transition hover:border-primary hover:bg-secondary/30"
        >
          <span className="flex flex-col items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-white shadow-sm">
              <Plus className="size-4" />
            </span>
            <span className="text-caption-1 font-semibold">Add image</span>
          </span>
          <input
            accept="image/*"
            className="sr-only"
            multiple
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

function CountryPicker({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  const [open, setOpen] = React.useState(false);
  const selectedCountry = countryOptions.find(
    (option) => option.country === value,
  );

  function selectCountry(country: string) {
    onChange(country);
    setOpen(false);
  }

  return (
    <div className="relative grid gap-2">
      <span className="text-footnote font-semibold text-[#2F4B4F]">{label}</span>
      <button
        className="flex h-12 items-center justify-between gap-3 rounded-sm border border-border bg-fill px-3 text-left text-callout text-[#2F4B4F] outline-none transition hover:bg-secondary/30 focus:border-primary focus:bg-white"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span
          className={cn(
            "inline-flex items-center gap-2",
            selectedCountry ? "font-semibold" : "text-[#2F4B4F]/45",
          )}
        >
          {selectedCountry ? (
            <>
              <span>{selectedCountry.flag}</span>
              <span>{selectedCountry.country}</span>
            </>
          ) : (
            "Select country"
          )}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-[#2F4B4F]/65 transition",
            open ? "rotate-180" : null,
          )}
        />
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-md border border-border bg-white py-2 text-callout text-[#2F4B4F] shadow-lg">
          {countryOptions.map((option) => (
            <button
              className="flex w-full items-center justify-between gap-3 border-b border-border px-4 py-3 text-left transition last:border-b-0 hover:bg-fill"
              key={option.country}
              onClick={() => selectCountry(option.country)}
              type="button"
            >
              <span className="inline-flex items-center gap-3 font-semibold">
                <span>{option.flag}</span>
                <span>{option.country}</span>
              </span>
              <span className="text-caption-1 text-[#2F4B4F]/55">
                {option.currency}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function PriceField({
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
      <span className="text-footnote font-semibold text-[#2F4B4F]">{label}</span>
      <div className="flex h-12 overflow-hidden rounded-sm border border-border bg-fill transition focus-within:border-primary focus-within:bg-white">
        <div className="relative flex w-20 shrink-0 items-center border-r border-border">
          <select
            aria-label="Currency"
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

function AiOfferingPanel() {
  const [prompt, setPrompt] = React.useState("");

  return (
    <div className="grid gap-4">
      <TextAreaField
        label="Describe your offering"
        onChange={setPrompt}
        placeholder="Share the name, audience, pricing, and any details you want included."
        value={prompt}
      />
      <Button
        className="justify-self-start"
        icon={<Sparkles />}
        type="button"
        variant="outline"
      >
        Generate draft
      </Button>
    </div>
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
    <label className="grid gap-2">
      <span className="text-footnote font-semibold text-[#2F4B4F]">{label}</span>
      <input
        className="h-12 rounded-sm border border-border bg-fill px-3 text-callout text-[#2F4B4F] outline-none transition placeholder:text-[#2F4B4F]/40 focus:border-primary focus:bg-white"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </label>
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
    <label className="grid gap-2">
      <span className="text-footnote font-semibold text-[#2F4B4F]">{label}</span>
      <textarea
        className="min-h-28 rounded-sm border border-border bg-fill px-3 py-3 text-callout text-[#2F4B4F] outline-none transition placeholder:text-[#2F4B4F]/40 focus:border-primary focus:bg-white"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}

function SelectField({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  value: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-footnote font-semibold text-[#2F4B4F]">{label}</span>
      <select
        className="h-12 rounded-sm border border-border bg-fill px-3 text-callout text-[#2F4B4F] outline-none transition focus:border-primary focus:bg-white"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
