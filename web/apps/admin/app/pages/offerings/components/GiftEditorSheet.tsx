import * as React from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import {
  AppSelectField,
  AppSheet,
  AppTextareaField,
  AppTextField,
  Button,
  cn,
} from "@piya/ui";
import type { GiftData } from "@piya/shared/models";
import type { GiftDraft, GiftInput } from "@piya/shared/types";
import {
  createEmptyGiftDraft,
  createGiftDraft,
  draftToGift,
} from "@piya/shared/utils";

type EditorMode = "create" | "edit";
export type GiftEditorStep =
  | "basics"
  | "value"
  | "availability"
  | "media";

type GiftEditorSheetProps = {
  gift: GiftData | null;
  mode: EditorMode;
  onClose: () => void;
  onSave: (gift: GiftInput) => Promise<void> | void;
  open: boolean;
  saving?: boolean;
};

const currencies = [
  { code: "NGN", label: "Naira" },
  { code: "USD", label: "Dollar" },
  { code: "GHS", label: "Ghana cedi" },
  { code: "KES", label: "Kenya shilling" },
  { code: "ZAR", label: "South African rand" },
];

export const giftEditorSteps: { key: GiftEditorStep; label: string }[] = [
  { key: "basics", label: "Basics" },
  { key: "value", label: "Value" },
  { key: "availability", label: "Availability" },
  { key: "media", label: "Media" },
];

export function GiftEditorSheet({
  gift,
  mode,
  onClose,
  onSave,
  open,
  saving = false,
}: GiftEditorSheetProps) {
  const [draft, setDraft] = React.useState<GiftDraft>(createEmptyGiftDraft);
  const [activeStep, setActiveStep] =
    React.useState<GiftEditorStep>("basics");
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const isEditing = mode === "edit";
  const activeStepIndex = giftEditorSteps.findIndex(
    (step) => step.key === activeStep,
  );
  const isFinalStep = activeStepIndex === giftEditorSteps.length - 1;
  const canContinue = Boolean(draft.name.trim());

  React.useEffect(() => {
    if (open) {
      setActiveStep("basics");
      setSaveError(null);
      setDraft(gift ? createGiftDraft(gift) : createEmptyGiftDraft());
    }
  }, [gift, open]);

  function updateDraft(updates: Partial<GiftDraft>) {
    setDraft((current) => ({ ...current, ...updates }));
  }

  function goToPreviousStep() {
    if (activeStepIndex === 0) {
      onClose();
      return;
    }

    setActiveStep(giftEditorSteps[activeStepIndex - 1].key);
  }

  function goToNextStep() {
    if (activeStepIndex >= giftEditorSteps.length - 1) return;
    setActiveStep(giftEditorSteps[activeStepIndex + 1].key);
  }

  async function saveGift() {
    setSaveError(null);

    try {
      await onSave(draftToGift(draft));
      onClose();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Save failed");
    }
  }

  return (
    <AppSheet
      ariaLabel={isEditing ? "edit gift sheet" : "create gift sheet"}
      footer={
        <>
          <Button
            className="bg-fill text-[#2F4B4F] hover:bg-fill-secondary"
            icon={activeStepIndex === 0 ? undefined : <ChevronLeft />}
            onClick={goToPreviousStep}
            type="button"
            variant="secondary"
          >
            {activeStepIndex === 0 ? "Cancel" : "Back"}
          </Button>
          {!isFinalStep ? (
            <Button
              disabled={!canContinue}
              icon={<ChevronRight />}
              onClick={goToNextStep}
              type="button"
            >
              Continue
            </Button>
          ) : (
            <Button
              disabled={!canContinue || saving}
              icon={<CheckCircle2 />}
              onClick={saveGift}
              type="button"
            >
              {saving
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Create gift"}
            </Button>
          )}
        </>
      }
      maxWidthClassName="max-w-2xl"
      onClose={onClose}
      open={open}
      title={isEditing ? "Edit gift" : "Create gift"}
    >
      <div className="grid gap-5">
        <GiftEditorStepper activeStep={activeStep} />

        {saveError ? (
          <p className="rounded-sm border border-error/30 bg-error/10 px-3 py-2 text-callout text-error">
            {saveError}
          </p>
        ) : null}

        <GiftForm
          activeStep={activeStep}
          draft={draft}
          onChange={updateDraft}
        />
      </div>
    </AppSheet>
  );
}

export function GiftEditorStepper({
  activeStep,
}: {
  activeStep: GiftEditorStep;
}) {
  const activeIndex = giftEditorSteps.findIndex(
    (step) => step.key === activeStep,
  );

  return (
    <div className="flex w-full items-center gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {giftEditorSteps.map((step, index) => {
        const isActive = index === activeIndex;
        const isComplete = index < activeIndex;

        return (
          <React.Fragment key={step.key}>
            <div className="flex shrink-0 items-center gap-2">
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border text-footnote font-semibold",
                  isActive
                    ? "border-primary bg-primary text-white"
                    : isComplete
                      ? "border-primary bg-secondary text-primary"
                      : "border-border bg-white text-[#2F4B4F]/55",
                )}
              >
                {isComplete ? <CheckCircle2 className="size-4" /> : index + 1}
              </span>
              <span
                className={cn(
                  "whitespace-nowrap text-callout font-semibold",
                  isActive || isComplete ? "text-primary" : "text-[#2F4B4F]/55",
                )}
              >
                {step.label}
              </span>
            </div>
            {index < giftEditorSteps.length - 1 ? (
              <span
                className={cn(
                  "h-px min-w-8 flex-1",
                  isComplete ? "bg-primary" : "bg-border",
                )}
              />
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export function GiftForm({
  activeStep,
  draft,
  onChange,
}: {
  activeStep: GiftEditorStep;
  draft: GiftDraft;
  onChange: (updates: Partial<GiftDraft>) => void;
}) {
  return (
    <form className="grid gap-4">
      {activeStep === "basics" ? (
        <>
          <TextField
            label="Gift name"
            onChange={(name) => onChange({ name })}
            placeholder="Enter gift name"
            value={draft.name}
          />
          <TextAreaField
            label="Description"
            onChange={(description) => onChange({ description })}
            placeholder="Enter gift description"
            value={draft.description}
          />
        </>
      ) : null}

      {activeStep === "value" ? (
        <MoneyField
          currency={draft.currency}
          label="Estimated value"
          onChange={(estimatedValue) => onChange({ estimatedValue })}
          onCurrencyChange={(currency) => onChange({ currency })}
          placeholder="Enter estimated value"
          value={draft.estimatedValue}
        />
      ) : null}

      {activeStep === "availability" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Quantity available"
            onChange={(quantityAvailable) => onChange({ quantityAvailable })}
            placeholder="Leave blank for unlimited"
            type="number"
            value={draft.quantityAvailable}
          />
          <AppSelectField
            label="Status"
            onChange={(event) =>
              onChange({
                status: event.target.value as GiftDraft["status"],
              })
            }
            options={[
              { label: "Active", value: "active" },
              { label: "Disabled", value: "disabled" },
            ]}
            value={draft.status}
          />
        </div>
      ) : null}

      {activeStep === "media" ? (
        <ImageUploadBox
          imageBase64={draft.imageBase64}
          imageUrl={draft.imageUrl}
          label="Image"
          onChange={(imageBase64) => onChange({ imageBase64 })}
        />
      ) : null}
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

function ImageUploadBox({
  imageBase64,
  imageUrl,
  label,
  onChange,
}: {
  imageBase64: string;
  imageUrl: string;
  label: string;
  onChange: (value: string) => void;
}) {
  const [imageError, setImageError] = React.useState("");
  const preview = imageBase64 || imageUrl;

  function selectImage(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setImageError("Upload a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("Gift image must not exceed 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setImageError("Unable to read image. Please try another file.");
        return;
      }

      setImageError("");
      onChange(reader.result);
    };
    reader.onerror = () =>
      setImageError("Unable to read image. Please try another file.");
    reader.readAsDataURL(file);
  }

  return (
    <div className="grid gap-2">
      <span className="text-footnote font-normal text-[#2F4B4F]">{label}</span>
      <div className="flex flex-wrap gap-3">
        {preview ? (
          <div className="flex size-24 items-center justify-center overflow-hidden rounded-md border border-border bg-fill">
            <img alt="" className="size-full object-cover" src={preview} />
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
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) => {
              selectImage(event.currentTarget.files);
              event.currentTarget.value = "";
            }}
            type="file"
          />
        </label>
      </div>
      {imageError ? (
        <p className="text-footnote text-error">{imageError}</p>
      ) : null}
    </div>
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
