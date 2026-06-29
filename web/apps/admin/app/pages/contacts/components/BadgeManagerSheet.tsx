import * as React from "react";
import {
  ArrowLeft,
  Award,
  Check,
  ChevronDown,
  MoreVertical,
  X,
} from "lucide-react";
import {
  AppPopup,
  AppSelectField,
  AppSheet,
  AppTextareaField,
  AppTextField,
  Button,
  cn,
} from "@piya/ui";
import {
  useCreateBadgeMutation,
  useDeleteBadgeMutation,
  useGetBadgesQuery,
  useUpdateBadgeMutation,
} from "@piya/shared";
import type { BadgeData, BadgeRule } from "@piya/shared/models";
import type { BadgeInput } from "@piya/shared/types";

type AddBadgeStep = "icon" | "details" | "rule";

type BadgeIconOption = {
  id: string;
  name: string;
};

type BadgeDraft = {
  description: string;
  iconId: string;
  name: string;
  rule: BadgeRule;
};

type BadgeManagerSheetProps = {
  onClose: () => void;
  open: boolean;
};

const badgeIconOptions: BadgeIconOption[] = [
  { id: "blue-crest-ribbon", name: "Blue crest" },
  { id: "blue-diamond-ribbon", name: "Blue diamond" },
  { id: "blue-round-ribbon", name: "Blue round" },
  { id: "blue-shield-ribbon", name: "Blue shield" },
  { id: "blue-triangle-ribbon", name: "Blue triangle" },
  { id: "coral-circle-white-ribbon", name: "Coral circle" },
  { id: "coral-gear-ribbon", name: "Coral gear" },
  { id: "coral-hexagon", name: "Coral hexagon" },
  { id: "coral-long-hex-ribbon", name: "Coral long hex" },
  { id: "coral-oval-gold-ribbon", name: "Coral oval" },
  { id: "coral-round-ribbon", name: "Coral round" },
  { id: "coral-shield", name: "Coral shield" },
  { id: "coral-wide-hex-ribbon", name: "Coral wide hex" },
  { id: "flag-crest-ribbon", name: "Flag crest" },
  { id: "gold-outline-badge-ribbon", name: "Gold badge" },
  { id: "gold-outline-shield-ribbon", name: "Gold shield" },
  { id: "gold-scallop-seal", name: "Gold seal" },
  { id: "gold-tall-shield-ribbon", name: "Gold tall shield" },
  { id: "gold-wave-shield", name: "Gold wave" },
  { id: "idea-lightbulb-ribbon", name: "Idea lightbulb" },
  { id: "mint-scallop-circle", name: "Mint scallop" },
  { id: "navy-oval-badge", name: "Navy oval" },
  { id: "peach-circle-frame", name: "Peach circle" },
  { id: "peach-square-frame", name: "Peach square" },
  { id: "red-flag-shield-ribbon", name: "Red flag shield" },
  { id: "rocket-launch", name: "Rocket launch" },
  { id: "sage-diagonal-hexagon", name: "Sage diagonal" },
  { id: "sage-hexagon-ribbon", name: "Sage hexagon" },
  { id: "sage-oval-cream-ribbon", name: "Sage cream oval" },
  { id: "sage-oval-ribbon", name: "Sage oval" },
  { id: "sage-round-seal", name: "Sage round seal" },
  { id: "sage-scallop-oval-ribbon", name: "Sage scallop" },
  { id: "sage-tall-shield-ribbon", name: "Sage tall shield" },
  { id: "slate-starburst", name: "Slate starburst" },
  { id: "white-crest-gold-ribbon", name: "White crest" },
  { id: "white-lightning-ribbon", name: "White lightning" },
  { id: "white-stack-ribbon", name: "White stack" },
];

const ruleOptions = [
  { label: "Select rule type", value: "" },
  { label: "Points at least", value: "points_at_least" },
  { label: "Orders at least", value: "orders_at_least" },
  { label: "Total spend at least", value: "total_spend_at_least" },
  { label: "Assigned manually", value: "manual" },
];

const currencyOptions = [
  { code: "NGN", label: "Naira" },
  { code: "USD", label: "Dollar" },
  { code: "GHS", label: "Ghana cedi" },
  { code: "KES", label: "Kenya shilling" },
  { code: "ZAR", label: "South African rand" },
];

const defaultBadgeIds = new Set(["gold", "silver", "regular"]);

function createEmptyDraft(): BadgeDraft {
  const iconId = badgeIconOptions[0]?.id ?? "";

  return {
    description: "",
    iconId,
    name: getBadgeIconName(iconId),
    rule: { currency: null, metric: "", value: null },
  };
}

function createBadgeDraft(badge: BadgeData): BadgeDraft {
  return {
    description: badge.description,
    iconId: badge.icon ?? badgeIconOptions[0]?.id ?? "",
    name: badge.name,
    rule: {
      currency: badge.rule.currency ?? null,
      metric: badge.rule.metric,
      value: badge.rule.value ?? null,
    },
  };
}

export function BadgeManagerSheet({ onClose, open }: BadgeManagerSheetProps) {
  const { data: badgePayload, isError, isFetching } = useGetBadgesQuery(
    undefined,
    { skip: !open }
  );
  const [createBadge, createBadgeState] = useCreateBadgeMutation();
  const [updateBadge, updateBadgeState] = useUpdateBadgeMutation();
  const [deleteBadge] = useDeleteBadgeMutation();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingBadge, setEditingBadge] = React.useState<BadgeData | null>(
    null,
  );
  const [openMenuBadgeId, setOpenMenuBadgeId] = React.useState<string | null>(
    null,
  );
  const [menuAnchorElement, setMenuAnchorElement] =
    React.useState<HTMLButtonElement | null>(null);
  const badges: BadgeData[] = badgePayload?.badges ?? [];
  const isSaving = createBadgeState.isLoading || updateBadgeState.isLoading;

  return (
    <>
      <AppSheet
        ariaLabel="contact badges"
        bodyClassName="p-0"
        footer={
          <Button
            className="h-12 w-full justify-center"
            icon={<Award />}
            onClick={() => {
              setEditingBadge(null);
              setIsDialogOpen(true);
            }}
            type="button"
          >
            Add new badge
          </Button>
        }
        maxWidthClassName="max-w-xl"
        onClose={onClose}
        open={open}
        title="Contact badges"
      >
        <div className="grid gap-1 p-4">
          {isFetching ? (
            <div className="py-10 text-center text-callout text-[#2F4B4F]/60">
              Loading badges...
            </div>
          ) : null}
          {isError ? (
            <div className="py-10 text-center text-callout text-error">
              Unable to load badges.
            </div>
          ) : null}
          {!isFetching && !isError ? badges.map((badge) => {
            const isDefaultBadge = defaultBadgeIds.has(badge.id);

            return (
              <div
                className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-md px-2 py-3 transition hover:bg-fill"
                key={badge.id}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    alt=""
                    className="size-11 shrink-0 object-contain"
                    src={getBadgeIconSrc(badge.icon)}
                  />
                  <p className="min-w-0 truncate font-semibold text-[#2F4B4F]">
                    {badge.name}
                  </p>
                </div>
                <span className="whitespace-nowrap text-footnote font-semibold text-[#2F4B4F]/65">
                  {formatBadgeRule(badge.rule)}
                </span>
                {isDefaultBadge ? (
                  <span aria-hidden="true" className="size-9" />
                ) : (
                  <div className="relative">
                    <button
                      aria-expanded={openMenuBadgeId === badge.id}
                      aria-label={`Open actions for ${badge.name}`}
                      className="flex size-9 items-center justify-center rounded-full text-[#2F4B4F]/60 transition hover:bg-white hover:text-[#2F4B4F]"
                      onClick={(event) => {
                        const nextOpen = openMenuBadgeId !== badge.id;
                        setMenuAnchorElement(event.currentTarget);
                        setOpenMenuBadgeId(nextOpen ? badge.id : null);
                      }}
                      type="button"
                    >
                      <MoreVertical className="size-5" />
                    </button>

                    <AppPopup
                      anchorElement={menuAnchorElement}
                      className="w-36 rounded-md border border-border bg-white py-2 text-callout text-[#2F4B4F] shadow-lg"
                      onClose={() => setOpenMenuBadgeId(null)}
                      open={openMenuBadgeId === badge.id}
                      placement="bottom-end"
                    >
                        <button
                          className="block w-full px-4 py-2 text-left transition hover:bg-fill"
                          onClick={() => {
                            setEditingBadge(badge);
                            setOpenMenuBadgeId(null);
                            setIsDialogOpen(true);
                          }}
                          type="button"
                        >
                          Edit badge
                        </button>
                        <button
                          className="block w-full px-4 py-2 text-left text-error transition hover:bg-fill"
                          onClick={() => {
                            setOpenMenuBadgeId(null);
                            void deleteBadge(badge.id);
                          }}
                          type="button"
                        >
                          Delete badge
                        </button>
                    </AppPopup>
                  </div>
                )}
              </div>
            );
          }) : null}
        </div>
      </AppSheet>

      <AddBadgeDialog
        badge={editingBadge}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingBadge(null);
        }}
        isSaving={isSaving}
        onSave={async (badge) => {
          if (editingBadge) {
            await updateBadge({
              badgeId: editingBadge.id,
              input: badge,
            }).unwrap();
          } else {
            await createBadge(badge).unwrap();
          }
          setIsDialogOpen(false);
          setEditingBadge(null);
        }}
        open={isDialogOpen}
      />
    </>
  );
}

function AddBadgeDialog({
  badge,
  isSaving,
  onClose,
  onSave,
  open,
}: {
  badge: BadgeData | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (badge: BadgeInput) => Promise<unknown> | unknown;
  open: boolean;
}) {
  const [step, setStep] = React.useState<AddBadgeStep>("icon");
  const [draft, setDraft] = React.useState<BadgeDraft>(() => createEmptyDraft());

  React.useEffect(() => {
    if (!open) return;

    setStep("icon");
    setDraft(badge ? createBadgeDraft(badge) : createEmptyDraft());
  }, [badge, open]);

  if (!open) return null;

  const canContinueFromDetails =
    draft.name.trim().length > 0 && draft.description.trim().length > 0;
  const requiresValue = draft.rule.metric !== "" && draft.rule.metric !== "manual";
  const canCreate =
    draft.rule.metric === "manual" ||
    (requiresValue && Number(draft.rule.value) > 0);

  async function saveBadge() {
    const name = draft.name.trim();
    const description = draft.description.trim();
    const rule: BadgeRule =
      draft.rule.metric === "manual"
        ? { currency: null, metric: "manual", value: null }
        : {
            currency:
              draft.rule.metric === "total_spend_at_least"
                ? draft.rule.currency ?? "NGN"
                : null,
            metric: draft.rule.metric,
            value: Number(draft.rule.value),
          };

    await onSave({
      description,
      icon: draft.iconId,
      name,
      rule,
    });
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#102A2D]/45 p-4">
      <button
        aria-label="Close add badge"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />
      <div
        aria-modal="true"
        className="relative flex h-[min(640px,calc(100vh-2rem))] w-full max-w-xl flex-col rounded-md bg-white text-[#2F4B4F] shadow-xl"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-6">
          <div className="min-w-0">
            <p className="text-footnote font-semibold uppercase text-primary">
              Step {getStepNumber(step)} of 3
            </p>
            <h3 className="mt-1 text-title-2 font-semibold">
              {getStepTitle(step, Boolean(badge))}
            </h3>
          </div>
          <button
            aria-label="Close"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-fill hover:bg-secondary"
            onClick={onClose}
            type="button"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {step === "icon" ? (
            <BadgeIconPicker
              onSelect={(iconId) => {
                setDraft((current) => ({
                  ...current,
                  iconId,
                  name: getBadgeIconName(iconId),
                }));
              }}
              selectedIconId={draft.iconId}
            />
          ) : null}

          {step === "details" ? (
            <div className="grid gap-4">
              <SelectedBadgePreview iconId={draft.iconId} name={draft.name} />
              <AppTextField
                autoFocus
                label="Badge name"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Gold member"
                value={draft.name}
              />
              <AppTextareaField
                label="Description"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Customers who meet this badge criteria."
                value={draft.description}
              />
            </div>
          ) : null}

          {step === "rule" ? (
            <div className="grid gap-4">
              <SelectedBadgePreview iconId={draft.iconId} name={draft.name} />
              <AppSelectField
                label="Rule type"
                onChange={(event) => {
                  const metric = event.target.value;
                  setDraft((current) => ({
                    ...current,
                    rule: {
                      currency:
                        metric === "total_spend_at_least" ? "NGN" : null,
                      metric,
                      value: metric === "manual" ? null : current.rule.value,
                    },
                  }));
                }}
                options={ruleOptions}
                value={draft.rule.metric}
              />
              {requiresValue ? (
                draft.rule.metric === "total_spend_at_least" ? (
                  <MoneyField
                    currency={draft.rule.currency ?? "NGN"}
                    label="Value"
                    onChange={(value) =>
                      setDraft((current) => ({
                        ...current,
                        rule: {
                          ...current.rule,
                          value: value ? Number(value) : null,
                        },
                      }))
                    }
                    onCurrencyChange={(currency) =>
                      setDraft((current) => ({
                        ...current,
                        rule: { ...current.rule, currency },
                      }))
                    }
                    placeholder="50,000"
                    value={draft.rule.value ? String(draft.rule.value) : ""}
                  />
                ) : (
                  <AppTextField
                    label="Value"
                    min={0}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        rule: {
                          ...current.rule,
                          value: event.target.valueAsNumber || null,
                        },
                      }))
                    }
                    placeholder="100"
                    type="number"
                    value={draft.rule.value ?? ""}
                  />
                )
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border p-6">
          {step === "icon" ? (
            <button
              className="text-footnote font-semibold text-[#2F4B4F]/65 hover:text-[#2F4B4F]"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
          ) : (
            <Button
              icon={<ArrowLeft />}
              onClick={() => setStep(step === "rule" ? "details" : "icon")}
              type="button"
              variant="secondary"
            >
              Back
            </Button>
          )}

          {step === "icon" ? (
            <Button onClick={() => setStep("details")} type="button">
              Continue
            </Button>
          ) : null}

          {step === "details" ? (
            <Button
              disabled={!canContinueFromDetails || isSaving}
              onClick={() => setStep("rule")}
              type="button"
            >
              Continue
            </Button>
          ) : null}

          {step === "rule" ? (
            <Button
              disabled={!canCreate || isSaving}
              onClick={() => void saveBadge()}
              type="button"
            >
              {badge ? "Save badge" : "Create badge"}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function BadgeIconPicker({
  onSelect,
  selectedIconId,
}: {
  onSelect: (iconId: string) => void;
  selectedIconId: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {badgeIconOptions.map((option) => {
        const selected = option.id === selectedIconId;

        return (
          <button
            className={cn(
              "relative grid aspect-square place-items-center rounded-md border border-border bg-fill p-2 transition hover:border-primary hover:bg-secondary/20",
              selected && "border-primary bg-secondary/30 ring-2 ring-primary/20"
            )}
            key={option.id}
            onClick={() => onSelect(option.id)}
            type="button"
          >
            <img
              alt={option.name}
              className="max-h-12 max-w-full object-contain"
              src={getBadgeIconSrc(option.id)}
            />
            {selected ? (
              <span className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-primary text-white">
                <Check className="size-4" />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function SelectedBadgePreview({
  iconId,
  name,
}: {
  iconId: string;
  name?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <img
        alt=""
        className="size-12 object-contain"
        src={getBadgeIconSrc(iconId)}
      />
      <p className="text-callout font-semibold text-[#2F4B4F]">
        {name || getBadgeIconName(iconId)}
      </p>
    </div>
  );
}

function formatBadgeRule(rule: BadgeRule) {
  const value = rule.value ?? 0;

  if (rule.metric === "points_at_least") {
    return `${value.toLocaleString()}+ points`;
  }

  if (rule.metric === "orders_at_least") {
    return `${value.toLocaleString()}+ orders`;
  }

  if (rule.metric === "total_spend_at_least") {
    return `${rule.currency ?? "NGN"} ${value.toLocaleString()}+ spent`;
  }

  if (rule.metric === "manual") {
    return "Assigned manually";
  }

  return "Rule not set";
}

function getBadgeIconSrc(icon?: string | null) {
  const badgeId = icon || "sage-round-seal";
  return `/assets/badges/${badgeId}.png`;
}

function getBadgeIconName(iconId: string) {
  return badgeIconOptions.find((option) => option.id === iconId)?.name ?? iconId;
}

function getStepNumber(step: AddBadgeStep) {
  if (step === "details") return 2;
  if (step === "rule") return 3;
  return 1;
}

function getStepTitle(step: AddBadgeStep, isEditing: boolean) {
  if (step === "details") return "Name your badge";
  if (step === "rule") return "Set badge rule";
  return isEditing ? "Edit badge type" : "Select badge type";
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
            {currencyOptions.map((option) => (
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
