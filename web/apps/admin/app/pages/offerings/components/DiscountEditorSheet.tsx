import * as React from "react";
import { CheckCircle2, ChevronDown, Plus, Sparkles, X } from "lucide-react";
import { AppDatePicker, AppSheet, Button, cn } from "@yinapp/ui";
import {
  DEFAULT_BADGE_OPTIONS,
  formatLabel,
} from "@/pages/communications/communicationUtils";
import type {
  DiscountData,
  DiscountStatusType,
  RewardType,
} from "@/services/discounts.service";
import type { GiftData, GiftDraft } from "@/services/gifts.service";
import {
  createEmptyGiftDraft,
  draftToGift,
} from "@/services/gifts.service";
import { getOfferings } from "@/services/offerings.service";
import {
  createDiscountDraft,
  createEmptyDiscountDraft,
  draftToDiscount,
  formatDiscountLabel,
  type DiscountFormDraft,
} from "./discountForm";
import { GiftForm } from "./GiftEditorSheet";

type EditorMode = "create" | "edit";

type DiscountEditorSheetProps = {
  discount: DiscountData | null;
  gifts: GiftData[];
  mode: EditorMode;
  onClose: () => void;
  onCreateGift: (gift: GiftData) => void;
  onSave: (discount: DiscountData) => void;
  open: boolean;
};

const rewardTypes: RewardType[] = [
  "percentage_discount",
  "fixed_amount_discount",
  "free_shipping",
  "buy_x_get_y",
  "freebie_product",
  "cashback_credit",
  "custom_perk",
];

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

export function DiscountEditorSheet({
  discount,
  gifts,
  mode,
  onClose,
  onCreateGift,
  onSave,
  open,
}: DiscountEditorSheetProps) {
  const [draft, setDraft] = React.useState<DiscountFormDraft>(
    createEmptyDiscountDraft,
  );
  const [giftDraft, setGiftDraft] = React.useState<GiftDraft>(
    createEmptyGiftDraft,
  );
  const [isGiftDialogOpen, setIsGiftDialogOpen] = React.useState(false);
  const isEditing = mode === "edit";

  React.useEffect(() => {
    if (open) {
      setDraft(discount ? createDiscountDraft(discount) : createEmptyDiscountDraft());
    }
  }, [discount, open]);

  function updateDraft(updates: Partial<DiscountFormDraft>) {
    setDraft((current) => ({ ...current, ...updates }));
  }

  function handleSave(status?: DiscountStatusType) {
    onSave(draftToDiscount({ ...draft, status: status ?? draft.status }, discount));
    onClose();
  }

  function openGiftDialog() {
    setGiftDraft({
      ...createEmptyGiftDraft(),
      currency: draft.currency,
      status: "active",
    });
    setIsGiftDialogOpen(true);
  }

  function handleCreateGift() {
    const gift = draftToGift(giftDraft);
    onCreateGift(gift);
    updateDraft({ freebieGiftId: gift.id });
    setIsGiftDialogOpen(false);
  }

  return (
    <>
      <AppSheet
        ariaLabel={isEditing ? "edit discount sheet" : "create discount sheet"}
        footer={
          <>
            <Button
              className="bg-fill text-[#2F4B4F] hover:bg-fill-secondary"
              disabled={!draft.title.trim()}
              onClick={() => handleSave("draft")}
              type="button"
              variant="secondary"
            >
              Save draft
            </Button>
            <Button
              disabled={!draft.title.trim()}
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
        title={isEditing ? "Edit discount" : "Create discount"}
      >
        <form className="grid gap-5">
          <section className="grid gap-4">
            <TextField
              label="Title"
              onChange={(title) => updateDraft({ title })}
              placeholder="e.g. Summer Glow 15%"
              value={draft.title}
            />
            <TextAreaField
              label="Description"
              onChange={(description) => updateDraft({ description })}
              placeholder="Describe who this discount is for and when it applies."
              value={draft.description}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <CodeField
                autoEnabled={draft.codeGeneration === "unique_per_contact"}
                label="Discount code"
                onChange={(code) => updateDraft({ code: code.toUpperCase() })}
                onToggleAuto={(enabled) =>
                  updateDraft({
                    code: enabled ? "" : draft.code,
                    codeGeneration: enabled ? "unique_per_contact" : "manual",
                  })
                }
                placeholder="GLOW15"
                value={draft.code}
              />
            </div>
          </section>

          <section className="grid gap-4 border-t border-border pt-4">
            <h3 className="text-callout font-semibold text-[#2F4B4F]">Reward</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Reward type"
                onChange={(rewardType) =>
                  updateDraft({
                    buyQuantity: "",
                    freebieGiftId: "",
                    getQuantity: "",
                    maxDiscountAmount:
                      rewardType === "percentage_discount"
                        ? draft.maxDiscountAmount
                        : "",
                    perkDescription: "",
                    rewardType: rewardType as RewardType,
                    rewardValue: "",
                  })
                }
                options={rewardTypes.map((rewardType) => ({
                  label: formatDiscountLabel(rewardType),
                  value: rewardType,
                }))}
                value={draft.rewardType}
              />
              <RewardValueFields
                draft={draft}
                gifts={gifts}
                onChange={updateDraft}
                onCreateGift={openGiftDialog}
              />
            </div>
          </section>

          <section className="grid gap-4 border-t border-border pt-4">
            <h3 className="text-callout font-semibold text-[#2F4B4F]">Rules</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <MoneyField
                currency={draft.currency}
                label="Minimum spend"
                onCurrencyChange={(currency) => updateDraft({ currency })}
                onChange={(minimumOrderValue) =>
                  updateDraft({ minimumOrderValue })
                }
                placeholder="40000"
                value={draft.minimumOrderValue}
              />
              <TextField
                label="Max uses per contact"
                onChange={(maxUsesPerContact) =>
                  updateDraft({ maxUsesPerContact })
                }
                placeholder="1"
                type="number"
                value={draft.maxUsesPerContact}
              />
              <TextField
                label="Total usage limit"
                onChange={(totalUsageLimit) => updateDraft({ totalUsageLimit })}
                placeholder="250"
                type="number"
                value={draft.totalUsageLimit}
              />
              <OptionPicker
                label="Target tags"
                onChange={(targetTags) =>
                  updateDraft({ targetTags: targetTags.join(", ") })
                }
                options={offeringTagOptions}
                placeholder="Select offering tags"
                selected={splitSelected(draft.targetTags)}
              />
              <OptionPicker
                label="Target badges"
                onChange={(targetBadgeTypes) =>
                  updateDraft({ targetBadgeTypes: targetBadgeTypes.join(", ") })
                }
                options={DEFAULT_BADGE_OPTIONS}
                placeholder="Select badges"
                selected={splitSelected(draft.targetBadgeTypes)}
              />
            </div>
          </section>

          <section className="grid gap-4 border-t border-border pt-4">
            <h3 className="text-callout font-semibold text-[#2F4B4F]">Schedule</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-footnote font-semibold text-[#2F4B4F]">
                  Starts at
                </span>
                <AppDatePicker
                  ariaLabel="Choose discount start date"
                  onChange={(date) => updateDraft({ startsAt: formatDateDraft(date) })}
                  value={dateDraftToDate(draft.startsAt)}
                />
              </label>
              <label className="grid gap-2">
                <span className="text-footnote font-semibold text-[#2F4B4F]">
                  Ends at
                </span>
                <AppDatePicker
                  ariaLabel="Choose discount end date"
                  onChange={(date) => updateDraft({ endsAt: formatDateDraft(date) })}
                  popoverAlign="right"
                  value={dateDraftToDate(draft.endsAt)}
                />
              </label>
            </div>
          </section>
        </form>
      </AppSheet>

      <GiftQuickCreateDialog
        draft={giftDraft}
        onChange={(updates) =>
          setGiftDraft((current) => ({ ...current, ...updates }))
        }
        onClose={() => setIsGiftDialogOpen(false)}
        onSave={handleCreateGift}
        open={isGiftDialogOpen}
      />
    </>
  );
}

function CodeField({
  autoEnabled,
  label,
  onChange,
  onToggleAuto,
  placeholder,
  value,
}: {
  autoEnabled: boolean;
  label: string;
  onChange: (value: string) => void;
  onToggleAuto: (enabled: boolean) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <div className="grid gap-2 sm:col-span-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-footnote font-semibold text-[#2F4B4F]">{label}</span>
        <label className="inline-flex items-center gap-2 text-caption-1 font-semibold text-[#2F4B4F]/70">
          <input
            checked={autoEnabled}
            className="size-4 accent-primary"
            onChange={(event) => onToggleAuto(event.target.checked)}
            type="checkbox"
          />
          Unique per contact
        </label>
      </div>
      <div
        className={cn(
          "flex h-12 overflow-hidden rounded-sm border border-border bg-fill transition focus-within:border-primary focus-within:bg-white",
          autoEnabled && "bg-secondary/30",
        )}
      >
        <span className="flex w-12 shrink-0 items-center justify-center border-r border-border text-primary">
          <Sparkles className="size-4" />
        </span>
        <input
          className="min-w-0 flex-1 bg-transparent px-3 text-callout font-semibold uppercase text-[#2F4B4F] outline-none placeholder:text-[#2F4B4F]/40 disabled:text-[#2F4B4F]/55"
          disabled={autoEnabled}
          onChange={(event) => onChange(event.target.value)}
          placeholder={
            autoEnabled ? "Generated uniquely for each contact" : placeholder
          }
          value={autoEnabled ? "" : value}
        />
      </div>
    </div>
  );
}

function RewardValueFields({
  draft,
  gifts,
  onChange,
  onCreateGift,
}: {
  draft: DiscountFormDraft;
  gifts: GiftData[];
  onChange: (updates: Partial<DiscountFormDraft>) => void;
  onCreateGift: () => void;
}) {
  if (draft.rewardType === "percentage_discount") {
    return (
      <>
        <PercentField
          label="Discount percentage"
          onChange={(rewardValue) => onChange({ rewardValue })}
          placeholder="15"
          value={draft.rewardValue}
        />
        <MoneyField
          currency={draft.currency}
          label="Max discount amount"
          onCurrencyChange={(currency) => onChange({ currency })}
          onChange={(maxDiscountAmount) => onChange({ maxDiscountAmount })}
          placeholder="15000"
          value={draft.maxDiscountAmount}
        />
      </>
    );
  }

  if (
    draft.rewardType === "fixed_amount_discount" ||
    draft.rewardType === "cashback_credit"
  ) {
    return (
      <MoneyField
        currency={draft.currency}
        label={
          draft.rewardType === "cashback_credit"
            ? "Cashback amount"
            : "Discount amount"
        }
        onChange={(rewardValue) => onChange({ rewardValue })}
        onCurrencyChange={(currency) => onChange({ currency })}
        placeholder="10000"
        value={draft.rewardValue}
      />
    );
  }

  if (draft.rewardType === "buy_x_get_y") {
    return (
      <>
        <TextField
          label="Buy quantity"
          onChange={(buyQuantity) => onChange({ buyQuantity })}
          placeholder="2"
          type="number"
          value={draft.buyQuantity}
        />
        <TextField
          label="Get quantity"
          onChange={(getQuantity) => onChange({ getQuantity })}
          placeholder="1"
          type="number"
          value={draft.getQuantity}
        />
      </>
    );
  }

  if (draft.rewardType === "freebie_product") {
    return (
      <GiftPicker
        gifts={gifts}
        label="Freebie gift"
        onChange={(freebieGiftId) => onChange({ freebieGiftId })}
        onCreateGift={onCreateGift}
        value={draft.freebieGiftId}
      />
    );
  }

  if (draft.rewardType === "custom_perk") {
    return (
      <TextAreaField
        label="Perk description"
        onChange={(perkDescription) => onChange({ perkDescription })}
        placeholder="Describe the perk customers receive."
        value={draft.perkDescription}
      />
    );
  }

  return <ReadOnlyField label="Discount value" value="Free shipping" />;
}

function GiftPicker({
  gifts,
  label,
  onChange,
  onCreateGift,
  value,
}: {
  gifts: GiftData[];
  label: string;
  onChange: (value: string) => void;
  onCreateGift: () => void;
  value: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-footnote font-semibold text-[#2F4B4F]">{label}</span>
      <div className="flex h-12 overflow-hidden rounded-sm border border-border bg-fill transition focus-within:border-primary focus-within:bg-white">
        <select
          className="min-w-0 flex-1 bg-transparent px-3 text-callout text-[#2F4B4F] outline-none"
          onChange={(event) => onChange(event.target.value)}
          value={value}
        >
          <option value="">Select gift</option>
          {gifts.map((gift) => (
            <option key={gift.id} value={gift.id}>
              {gift.name} | {gift.id}
            </option>
          ))}
        </select>
        <button
          aria-label="Create gift"
          className="flex w-12 shrink-0 items-center justify-center border-l border-border text-primary transition hover:bg-secondary/50"
          onClick={onCreateGift}
          type="button"
        >
          <Plus className="size-5" />
        </button>
      </div>
    </label>
  );
}

function GiftQuickCreateDialog({
  draft,
  onChange,
  onClose,
  onSave,
  open,
}: {
  draft: GiftDraft;
  onChange: (updates: Partial<GiftDraft>) => void;
  onClose: () => void;
  onSave: () => void;
  open: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#102A2D]/45 p-4">
      <button
        aria-label="Close create gift dialog"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />
      <div
        aria-modal="true"
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-md bg-white text-[#2F4B4F] shadow-xl"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-6">
          <div>
            <h2 className="text-title-2 font-semibold text-[#2F4B4F]">
              Create gift
            </h2>
            <p className="mt-1 text-callout text-[#2F4B4F]/70">
              Add a reusable gift and attach it to this discount.
            </p>
          </div>
          <button
            aria-label="Close"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-fill text-[#2F4B4F] hover:bg-secondary"
            onClick={onClose}
            type="button"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="p-6">
          <GiftForm draft={draft} onChange={onChange} />
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-border p-6">
          <Button
            className="bg-fill text-[#2F4B4F] hover:bg-fill-secondary"
            onClick={onClose}
            type="button"
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            disabled={!draft.name.trim()}
            icon={<CheckCircle2 />}
            onClick={onSave}
            type="button"
          >
            Create gift
          </Button>
        </div>
      </div>
    </div>
  );
}

function PercentField({
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
      <div className="flex h-12 overflow-hidden rounded-sm border border-border bg-fill transition focus-within:border-primary focus-within:bg-white">
        <input
          className="min-w-0 flex-1 bg-transparent px-3 text-callout text-[#2F4B4F] outline-none placeholder:text-[#2F4B4F]/40"
          inputMode="decimal"
          onChange={(event) => onChange(parseFormattedAmount(event.target.value))}
          placeholder={placeholder}
          type="text"
          value={value}
        />
        <span className="flex w-12 shrink-0 items-center justify-center border-l border-border text-callout font-semibold text-[#2F4B4F]/65">
          %
        </span>
      </div>
    </label>
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
      <span className="text-footnote font-semibold text-[#2F4B4F]">{label}</span>
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

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2">
      <span className="text-footnote font-semibold text-[#2F4B4F]">{label}</span>
      <div className="flex h-12 items-center rounded-sm border border-border bg-fill px-3 text-callout font-semibold text-[#2F4B4F]/70">
        {value}
      </div>
    </div>
  );
}

function OptionPicker({
  formatOption = formatLabel,
  label,
  onChange,
  options,
  placeholder,
  selected,
}: {
  formatOption?: (option: string) => string;
  label: string;
  onChange: (selected: string[]) => void;
  options: string[];
  placeholder: string;
  selected: string[];
}) {
  const [open, setOpen] = React.useState(false);
  const summary =
    selected.length > 0 ? `${selected.length} selected` : placeholder;

  function toggle(option: string) {
    const nextSelected = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];

    onChange(nextSelected);
  }

  return (
    <fieldset className="relative grid gap-2">
      <span className="text-footnote font-semibold text-[#2F4B4F]">{label}</span>
      <button
        aria-expanded={open}
        className="flex h-12 items-center justify-between gap-3 rounded-sm border border-border bg-fill px-3 text-left text-callout text-[#2F4B4F] outline-none transition hover:bg-secondary/30 focus:border-primary focus:bg-white"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span
          className={selected.length > 0 ? "font-semibold" : "text-[#2F4B4F]/45"}
        >
          {summary}
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
            {options.map((option) => {
              const active = selected.includes(option);

              return (
                <button
                  className={cn(
                    "rounded-md border px-3 py-2 text-callout font-semibold transition",
                    active
                      ? "border-primary bg-secondary text-primary"
                      : "border-border bg-fill text-[#2F4B4F]/70 hover:bg-secondary/40",
                  )}
                  key={option}
                  onClick={() => toggle(option)}
                  type="button"
                >
                  {formatOption(option)}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </fieldset>
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

function splitSelected(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
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

function formatDateDraft(date: Date) {
  return date.toISOString().slice(0, 10);
}

function dateDraftToDate(value: string) {
  if (!value) return null;

  return new Date(`${value}T00:00:00`);
}
