import * as React from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Package,
  Plus,
  Search,
  X,
} from "lucide-react";
import {
  AppCheckbox,
  AppDatePicker,
  AppSelectField,
  AppSheet,
  AppTextareaField,
  AppTextField,
  Button,
  cn,
} from "@piya/ui";
import {
  useGetAccountSetupQuery,
  useGetOfferingsPageQuery,
} from "@piya/shared";
import { getOfferingDisplayConfig } from "@/utils/offering-display";
import type {
  DiscountApplicabilityScope,
  DiscountData,
  RewardType,
  OfferingData,
} from "@piya/shared/models";
import type {
  DiscountFormDraft,
  DiscountInput,
  GiftDraft,
  GiftInput,
} from "@piya/shared/types";
import type { GiftData } from "@piya/shared/models";
import {
  createEmptyGiftDraft,
  draftToGift,
} from "@piya/shared/utils";
import {
  createDiscountDraft,
  createEmptyDiscountDraft,
  dateInputToDate,
  dateToDateInput,
  draftToDiscount,
  formatDiscountLabel,
} from "@piya/shared/utils";
import {
  GiftEditorStepper,
  GiftForm,
  giftEditorSteps,
  type GiftEditorStep,
} from "./GiftEditorSheet";

type EditorMode = "create" | "edit";
type DiscountEditorStep =
  | "basics"
  | "reward"
  | "applies_to"
  | "limits"
  | "schedule";

type DiscountEditorSheetProps = {
  discount: DiscountData | null;
  gifts: GiftData[];
  mode: EditorMode;
  onClose: () => void;
  onCreateGift: (gift: GiftInput) => Promise<GiftData>;
  onSave: (discount: DiscountInput) => Promise<void> | void;
  open: boolean;
  saving?: boolean;
};

const rewardTypes: RewardType[] = [
  "percentage_discount",
  "fixed_amount_discount",
  "buy_x_get_y",
  "freebie_product",
  "cashback_credit",
];

const discountEditorSteps: { key: DiscountEditorStep; label: string }[] = [
  { key: "basics", label: "Basics" },
  { key: "reward", label: "Reward" },
  { key: "applies_to", label: "Applies To" },
  { key: "limits", label: "Limits" },
  { key: "schedule", label: "Schedule" },
];
const applicabilityOptions: {
  label: string;
  value: DiscountApplicabilityScope;
}[] = [
  { label: "All items", value: "all_offerings" },
  { label: "Specific items", value: "specific_offerings" },
];
export function DiscountEditorSheet({
  discount,
  gifts,
  mode,
  onClose,
  onCreateGift,
  onSave,
  open,
  saving = false,
}: DiscountEditorSheetProps) {
  const { data: accountSetup } = useGetAccountSetupQuery();
  const offeringDisplay = getOfferingDisplayConfig(
    accountSetup?.business?.category ?? null,
  );
  const itemLabel = getBusinessItemLabel(offeringDisplay.singular);
  const [draft, setDraft] = React.useState<DiscountFormDraft>(
    createEmptyDiscountDraft,
  );
  const [giftDraft, setGiftDraft] = React.useState<GiftDraft>(
    createEmptyGiftDraft,
  );
  const [activeStep, setActiveStep] =
    React.useState<DiscountEditorStep>("basics");
  const [isGiftDialogOpen, setIsGiftDialogOpen] = React.useState(false);
  const isEditing = mode === "edit";
  const activeStepIndex = discountEditorSteps.findIndex(
    (step) => step.key === activeStep,
  );
  const isFinalStep = activeStepIndex === discountEditorSteps.length - 1;
  const canSave = Boolean(draft.title.trim());
  const canContinue = canSave;

  React.useEffect(() => {
    if (open) {
      setActiveStep("basics");
      setDraft(discount ? createDiscountDraft(discount) : createEmptyDiscountDraft());
    }
  }, [discount, open]);

  function updateDraft(updates: Partial<DiscountFormDraft>) {
    setDraft((current) => ({ ...current, ...updates }));
  }

  function goToPreviousStep() {
    if (activeStepIndex === 0) {
      onClose();
      return;
    }

    setActiveStep(discountEditorSteps[activeStepIndex - 1].key);
  }

  function goToNextStep() {
    if (activeStepIndex >= discountEditorSteps.length - 1) return;

    setActiveStep(discountEditorSteps[activeStepIndex + 1].key);
  }

  async function handleSave() {
    try {
      await onSave(draftToDiscount({ ...draft, status: "active" }));
      onClose();
    } catch {
      // Toast feedback is handled by the parent mutation handler.
    }
  }

  function openGiftDialog() {
    setGiftDraft({
      ...createEmptyGiftDraft(),
      currency: "NGN",
      status: "active",
    });
    setIsGiftDialogOpen(true);
  }

  async function handleCreateGift() {
    const gift = await onCreateGift(draftToGift(giftDraft));
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
                disabled={!canSave || saving}
                icon={<CheckCircle2 />}
                onClick={handleSave}
                type="button"
              >
                {saving ? "Publishing..." : "Publish"}
              </Button>
            )}
          </>
        }
        maxWidthClassName="max-w-2xl"
        onClose={onClose}
        open={open}
        title={isEditing ? "Edit discount" : "Create discount"}
      >
        <form className="grid gap-5">
          <DiscountEditorStepper activeStep={activeStep} />

          {activeStep === "basics" ? (
            <section className="grid gap-4">
              <TextField
                label="Title"
                onChange={(title) => updateDraft({ title })}
                placeholder="Enter discount title"
                value={draft.title}
              />
              <TextAreaField
                label="Description"
                onChange={(description) => updateDraft({ description })}
                placeholder="Enter discount description"
                value={draft.description}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Discount code"
                  onChange={(code) => updateDraft({ code: code.toUpperCase() })}
                  placeholder="Enter discount code"
                  value={draft.code}
                />
              </div>
            </section>
          ) : null}

          {activeStep === "reward" ? (
            <section className="grid gap-4">
              <h3 className="text-callout font-semibold text-[#2F4B4F]">
                Reward
              </h3>
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
          ) : null}

          {activeStep === "applies_to" ? (
            <section className="grid gap-4">
              <h3 className="text-callout font-semibold text-[#2F4B4F]">
                Applies To
              </h3>
              <div className="grid gap-4">
                <SelectField
                  label="Apply discount to"
                  onChange={(applicabilityScope) =>
                    updateDraft({
                      applicabilityScope:
                        applicabilityScope as DiscountApplicabilityScope,
                      offeringIds: "",
                    })
                  }
                  options={applicabilityOptions}
                  value={draft.applicabilityScope}
                />

                {draft.applicabilityScope === "specific_offerings" ? (
                  <OfferingPicker
                    itemLabel={itemLabel}
                    onChange={(offeringIds) =>
                      updateDraft({ offeringIds: offeringIds.join(", ") })
                    }
                    rewardLabel={getDraftRewardLabel(draft)}
                    selected={splitSelected(draft.offeringIds)}
                  />
                ) : null}
              </div>
            </section>
          ) : null}

          {activeStep === "limits" ? (
            <section className="grid gap-4">
              <h3 className="text-callout font-semibold text-[#2F4B4F]">
                Limits
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <MoneyField
                  label="Minimum spend"
                  onChange={(minimumOrderValue) =>
                    updateDraft({ minimumOrderValue })
                  }
                  placeholder="Enter minimum spend"
                  value={draft.minimumOrderValue}
                />
                <TextField
                  label="Max uses per contact"
                  onChange={(maxUsesPerContact) =>
                    updateDraft({ maxUsesPerContact })
                  }
                  placeholder="Enter max uses per contact"
                  type="number"
                  value={draft.maxUsesPerContact}
                />
                <TextField
                  label="Total usage limit"
                  onChange={(totalUsageLimit) =>
                    updateDraft({ totalUsageLimit })
                  }
                  placeholder="Enter total usage limit"
                  type="number"
                  value={draft.totalUsageLimit}
                />
              </div>
            </section>
          ) : null}

          {activeStep === "schedule" ? (
            <section className="grid gap-4">
              <h3 className="text-callout font-semibold text-[#2F4B4F]">
                Schedule
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-footnote font-normal text-[#2F4B4F]">
                    Starts at
                  </span>
                  <AppDatePicker
                    ariaLabel="Choose discount start date"
                    onChange={(date) =>
                      updateDraft({ startsAt: dateToDateInput(date) })
                    }
                    value={dateInputToDate(draft.startsAt)}
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-footnote font-normal text-[#2F4B4F]">
                    Ends at
                  </span>
                  <AppDatePicker
                    ariaLabel="Choose discount end date"
                    onChange={(date) =>
                      updateDraft({ endsAt: dateToDateInput(date) })
                    }
                    popoverAlign="right"
                    value={dateInputToDate(draft.endsAt)}
                  />
                </label>
              </div>
            </section>
          ) : null}
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

function DiscountEditorStepper({
  activeStep,
}: {
  activeStep: DiscountEditorStep;
}) {
  const activeIndex = discountEditorSteps.findIndex(
    (step) => step.key === activeStep,
  );

  return (
    <div className="flex w-full items-center gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {discountEditorSteps.map((step, index) => {
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
            {index < discountEditorSteps.length - 1 ? (
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

function OfferingPicker({
  itemLabel,
  onChange,
  rewardLabel,
  selected,
}: {
  itemLabel: string;
  onChange: (selected: string[]) => void;
  rewardLabel: string;
  selected: string[];
}) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const normalizedSearch = search.trim();
  const { data: offeringsPage, isFetching } = useGetOfferingsPageQuery(
    {
      limit: normalizedSearch ? 10 : 5,
      query: normalizedSearch || undefined,
    },
    { skip: !open },
  );
  const offerings = offeringsPage?.offerings ?? [];
  const summary =
    selected.length > 0 ? `${selected.length} selected` : `Select ${itemLabel}`;

  function toggle(offeringId: string) {
    onChange(
      selected.includes(offeringId)
        ? selected.filter((id) => id !== offeringId)
        : [...selected, offeringId],
    );
  }

  return (
    <fieldset className="grid gap-2">
      <span className="text-footnote font-normal text-[#2F4B4F]">
        {itemLabel}
      </span>
      <button
        className="flex h-12 items-center justify-between gap-3 rounded-sm border border-border bg-fill px-3 text-left text-callout text-[#2F4B4F] outline-none transition hover:bg-secondary/30 focus:border-primary focus:bg-white"
        onClick={() => setOpen(true)}
        type="button"
      >
        <span
          className={selected.length > 0 ? "font-semibold" : "text-[#2F4B4F]/45"}
        >
          {summary}
        </span>
        <ChevronDown
          className="size-4 shrink-0 text-[#2F4B4F]/65"
        />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#102A2D]/45 p-4">
          <button
            aria-label={`Close ${itemLabel} picker`}
            className="absolute inset-0 cursor-default"
            onClick={() => setOpen(false)}
            type="button"
          />
          <div
            aria-modal="true"
            className="relative flex max-h-[86vh] w-full max-w-2xl flex-col overflow-hidden rounded-md bg-white text-[#2F4B4F] shadow-xl"
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4 border-b border-border p-5">
              <div>
                <h2 className="text-title-3 font-semibold text-[#2F4B4F]">
                  Select {itemLabel}
                </h2>
              </div>
              <button
                aria-label="Close"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-fill text-[#2F4B4F] hover:bg-secondary"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="border-b border-border p-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#2F4B4F]/50" />
                <input
                  className="h-11 w-full rounded-sm border border-border bg-fill pl-10 pr-3 text-callout text-[#2F4B4F] outline-none transition placeholder:text-[#2F4B4F]/40 focus:border-primary focus:bg-white"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={`Search ${itemLabel.toLowerCase()}`}
                  type="search"
                  value={search}
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {isFetching ? (
                <p className="rounded-md border border-border bg-fill px-4 py-3 text-callout text-[#2F4B4F]/65">
                  Loading {itemLabel.toLowerCase()}...
                </p>
              ) : offerings.length ? (
                <div className="grid gap-2">
                  {offerings.map((offering) => (
                    <OfferingPickerRow
                      checked={selected.includes(offering.id)}
                      key={offering.id}
                      offering={offering}
                      onToggle={toggle}
                      rewardLabel={rewardLabel}
                    />
                  ))}
                </div>
              ) : (
                <p className="rounded-md border border-border bg-fill px-4 py-3 text-callout text-[#2F4B4F]/65">
                  No {itemLabel.toLowerCase()} found.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border p-4">
              <span className="text-caption-1 font-semibold text-[#2F4B4F]/65">
                {selected.length} selected
              </span>
              <Button onClick={() => setOpen(false)} type="button">
                Done
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </fieldset>
  );
}

function OfferingPickerRow({
  checked,
  offering,
  onToggle,
  rewardLabel,
}: {
  checked: boolean;
  offering: OfferingData;
  onToggle: (offeringId: string) => void;
  rewardLabel: string;
}) {
  return (
    <div
      className="flex w-full items-center gap-3 rounded-md px-3 py-3 transition hover:bg-fill"
    >
      <AppCheckbox
        checked={checked}
        label={`Select ${offering.name}`}
        onCheckedChange={() => onToggle(offering.id)}
      />
      <button
        className="flex min-w-0 flex-1 items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        onClick={() => onToggle(offering.id)}
        type="button"
      >
        <OfferingPickerImage offering={offering} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-callout font-semibold text-[#2F4B4F]">
            {offering.name}
          </span>
          <span className="mt-1 block truncate text-caption-1 text-[#2F4B4F]/60">
            {offering.category?.name ?? offering.subType ?? "No category"}
          </span>
        </span>
        <span className="shrink-0 text-right">
          <span className="inline-flex items-center justify-end gap-2">
            <span className="text-callout font-semibold text-[#2F4B4F]">
              {formatDiscountedOfferingPrice(offering, rewardLabel)}
            </span>
            <span className="rounded-full bg-primary px-2.5 py-1 text-caption-1 font-semibold text-white">
              {rewardLabel}
            </span>
          </span>
          <span className="mt-1 block text-caption-1 text-[#2F4B4F]/45 line-through">
            {formatOfferingPrice(offering)}
          </span>
        </span>
      </button>
    </div>
  );
}

function OfferingPickerImage({ offering }: { offering: OfferingData }) {
  const imageUrl = offering.imageUrls?.[0];

  return imageUrl ? (
    <img
      alt=""
      className="size-12 shrink-0 rounded-md object-cover"
      src={imageUrl}
    />
  ) : (
    <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-fill text-[#2F4B4F]/55">
      <Package className="size-5" />
    </span>
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
          placeholder="Enter discount percentage"
          value={draft.rewardValue}
        />
        <MoneyField
          label="Max discount amount"
          onChange={(maxDiscountAmount) => onChange({ maxDiscountAmount })}
          placeholder="Enter max discount amount"
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
        label={
          draft.rewardType === "cashback_credit"
            ? "Cashback amount"
            : "Discount amount"
        }
        onChange={(rewardValue) => onChange({ rewardValue })}
        placeholder="Enter amount"
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
          placeholder="Enter buy quantity"
          type="number"
          value={draft.buyQuantity}
        />
        <TextField
          label="Get quantity"
          onChange={(getQuantity) => onChange({ getQuantity })}
          placeholder="Enter get quantity"
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

  return null;
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
      <span className="text-footnote font-normal text-[#2F4B4F]">{label}</span>
      <div className="flex h-12 overflow-hidden rounded-sm border border-border bg-fill transition focus-within:border-primary focus-within:bg-white">
        <select
          className="min-w-0 flex-1 bg-transparent px-3 text-callout text-[#2F4B4F] outline-none"
          onChange={(event) => onChange(event.target.value)}
          value={value}
        >
          <option value="">Select gift</option>
          {gifts
            .filter((gift) => gift.status === "active" || gift.id === value)
            .map((gift) => (
              <option key={gift.id} value={gift.id}>
                {gift.name}
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
  onSave: () => Promise<void>;
  open: boolean;
}) {
  const [activeStep, setActiveStep] =
    React.useState<GiftEditorStep>("basics");
  const [creating, setCreating] = React.useState(false);
  const activeStepIndex = giftEditorSteps.findIndex(
    (step) => step.key === activeStep,
  );
  const isFinalStep = activeStepIndex === giftEditorSteps.length - 1;

  React.useEffect(() => {
    if (open) {
      setActiveStep("basics");
    }
  }, [open]);

  if (!open) return null;

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

  async function createGift() {
    setCreating(true);

    try {
      await onSave();
    } catch {
      // Toast feedback is handled by the parent mutation handler.
    } finally {
      setCreating(false);
    }
  }

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
        <div className="grid gap-5 p-6">
          <GiftEditorStepper activeStep={activeStep} />
          <GiftForm
            activeStep={activeStep}
            draft={draft}
            onChange={onChange}
          />
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border p-6">
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
              disabled={!draft.name.trim()}
              icon={<ChevronRight />}
              onClick={goToNextStep}
              type="button"
            >
              Continue
            </Button>
          ) : (
            <Button
              disabled={!draft.name.trim() || creating}
              icon={<CheckCircle2 />}
              onClick={createGift}
              type="button"
            >
              {creating ? "Creating..." : "Create gift"}
            </Button>
          )}
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
      <span className="text-footnote font-normal text-[#2F4B4F]">{label}</span>
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
      <span className="text-footnote font-normal text-[#2F4B4F]">{label}</span>
      <div className="flex h-12 overflow-hidden rounded-sm border border-border bg-fill transition focus-within:border-primary focus-within:bg-white">
        <span className="flex w-16 shrink-0 items-center justify-center border-r border-border text-callout font-semibold text-[#2F4B4F]">
          NGN
        </span>
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
    <AppSelectField
      label={label}
      onChange={(event) => onChange(event.target.value)}
      options={options}
      value={value}
    />
  );
}

function splitSelected(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getBusinessItemLabel(singular: string) {
  return singular.toLowerCase().endsWith("item")
    ? `${singular}s`
    : `${singular} items`;
}

function getDraftRewardLabel(draft: DiscountFormDraft) {
  if (draft.rewardType === "percentage_discount") {
    return `${draft.rewardValue || 0}% off`;
  }

  if (draft.rewardType === "fixed_amount_discount") {
    return `${formatCurrency(Number(draft.rewardValue || 0))} off`;
  }

  return formatDiscountLabel(draft.rewardType);
}

function formatOfferingPrice(offering: OfferingData) {
  if (offering.price == null) return "No price";

  return new Intl.NumberFormat("en-NG", {
    currency: offering.currency ?? "NGN",
    style: "currency",
  }).format(offering.price);
}

function formatDiscountedOfferingPrice(
  offering: OfferingData,
  rewardLabel: string,
) {
  if (offering.price == null) return "No price";

  const percentMatch = rewardLabel.match(/^(\d+(?:\.\d+)?)% off$/);
  if (!percentMatch) return formatOfferingPrice(offering);

  const discountPercent = Number(percentMatch[1]);
  const discountedPrice = offering.price * (1 - discountPercent / 100);

  return new Intl.NumberFormat("en-NG", {
    currency: offering.currency ?? "NGN",
    style: "currency",
  }).format(Math.max(discountedPrice, 0));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    currency: "NGN",
    style: "currency",
  }).format(value);
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
