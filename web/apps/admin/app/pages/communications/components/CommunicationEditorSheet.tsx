import * as React from "react";
import {
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Send,
  UsersRound,
  X,
} from "lucide-react";
import {
  AppDatePicker,
  AppSelectField,
  AppSheet,
  AppTextField,
  Button,
  IconSectionHeader as CommunicationSectionHeader,
  cn,
} from "@piya/ui";
import type {
  CommunicationAdminData as CommunicationData,
  CommunicationEditorMode,
  CommunicationEventType,
  CommunicationFrequency,
  CommunicationAdminStep as CommunicationStep,
} from "@piya/shared/types";
import { useGetBadgesQuery, useGetContactTagsQuery } from "@piya/shared";
import {
  FREQUENCY_OPTIONS,
  SCHEDULED_TRIGGER_TYPES,
  TRIGGER_OPTIONS,
  formatLabel,
} from "@piya/shared/utils";
import { CommunicationStepCard } from "./CommunicationStepCard";
import {
  isCommunicationSetupValid,
  isCommunicationStepValid,
} from "./communication-editor-validation";

const DAY_OF_WEEK_OPTIONS = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];

const COMMUNICATION_EDITOR_STEPS = [
  { key: "setup", label: "Setup" },
  { key: "audience", label: "Audience" },
  { key: "steps", label: "Steps" },
] as const;

type CommunicationEditorStep =
  (typeof COMMUNICATION_EDITOR_STEPS)[number]["key"];

type CommunicationEditorSheetProps = {
  communication: CommunicationData | null;
  mode: CommunicationEditorMode;
  onClose: () => void;
  onSave: (communication: CommunicationData) => Promise<void>;
  open: boolean;
  saving?: boolean;
};

export function CommunicationEditorSheet({
  communication,
  mode,
  onClose,
  onSave,
  open,
  saving = false,
}: CommunicationEditorSheetProps) {
  const [activeStep, setActiveStep] =
    React.useState<CommunicationEditorStep>("setup");
  const [draft, setDraft] = React.useState<CommunicationData>(
    () => communication ?? createDraftCommunication(),
  );
  const {
    data: contactTags = [],
    isError: isContactTagsError,
    isFetching: isContactTagsFetching,
  } = useGetContactTagsQuery(undefined, { skip: !open });
  const {
    data: badgePayload,
    isError: isBadgesError,
    isFetching: isBadgesFetching,
  } = useGetBadgesQuery(undefined, { skip: !open });
  const targetTags = draft.targetAudience?.targetTags ?? [];
  const targetBadgeTypes = draft.targetAudience?.targetBadgeTypes ?? [];
  const badgeOptions = React.useMemo(
    () =>
      getUniqueOptions([
        ...(badgePayload?.badges ?? []).map((badge) => badge.id),
        ...targetBadgeTypes,
      ]),
    [badgePayload, targetBadgeTypes],
  );
  const tagOptions = React.useMemo(
    () =>
      getUniqueOptions([...contactTags.map((tag) => tag.name), ...targetTags]),
    [contactTags, targetTags],
  );
  const badgesById = React.useMemo(() => {
    return new Map(
      (badgePayload?.badges ?? []).map((badge) => [badge.id, badge.name]),
    );
  }, [badgePayload]);
  const formatBadgeOption = React.useCallback(
    (badgeId: string) => badgesById.get(badgeId) ?? formatLabel(badgeId),
    [badgesById],
  );

  React.useEffect(() => {
    if (open) {
      setActiveStep("setup");
      setDraft(communication ?? createDraftCommunication());
    }
  }, [communication, open]);

  if (!open) return null;

  const isEditing = mode === "edit";
  const activeStepIndex = COMMUNICATION_EDITOR_STEPS.findIndex(
    (step) => step.key === activeStep,
  );
  const isFinalStep = activeStepIndex === COMMUNICATION_EDITOR_STEPS.length - 1;
  const hasSchedule = SCHEDULED_TRIGGER_TYPES.includes(draft.trigger.type);
  const schedule = draft.trigger.schedule ?? createSchedule();
  const isSetupValid = isCommunicationSetupValid(draft);
  const areStepsValid =
    draft.stepsOrder.length > 0 &&
    draft.stepsOrder.every((stepId) =>
      isCommunicationStepValid(draft.steps[stepId]),
    );
  const canContinue =
    activeStep === "setup" ? isSetupValid : activeStep === "audience";
  const canComplete = isSetupValid && areStepsValid;

  function goToPreviousStep() {
    if (activeStepIndex === 0) {
      onClose();
      return;
    }

    setActiveStep(COMMUNICATION_EDITOR_STEPS[activeStepIndex - 1].key);
  }

  function goToNextStep() {
    if (isFinalStep) return;

    setActiveStep(COMMUNICATION_EDITOR_STEPS[activeStepIndex + 1].key);
  }

  async function handleSave() {
    if (!canComplete || saving) return;

    await onSave(draft);
  }

  function updateStep(stepId: string, updates: Partial<CommunicationStep>) {
    setDraft((current) => ({
      ...current,
      steps: {
        ...current.steps,
        [stepId]: {
          ...current.steps[stepId],
          ...updates,
        },
      },
    }));
  }

  function addStep() {
    const stepId = `step_${draft.stepsOrder.length + 1}`;
    const step = createStep(draft.stepsOrder.length + 1);

    setDraft((current) => ({
      ...current,
      steps: {
        ...current.steps,
        [stepId]: step,
      },
      stepsOrder: [...current.stepsOrder, stepId],
    }));
  }

  function removeStep(stepId: string) {
    const { [stepId]: _removedStep, ...remainingSteps } = draft.steps;

    setDraft((current) => ({
      ...current,
      steps: remainingSteps,
      stepsOrder: current.stepsOrder.filter((id) => id !== stepId),
    }));
  }

  function updateSchedule(
    key: "dayOfWeek" | "hour" | "minute" | "startDate",
    value: number,
  ) {
    setDraft((current) => ({
      ...current,
      trigger: {
        ...current.trigger,
        schedule: {
          ...(current.trigger.schedule ?? createSchedule()),
          [key]: value,
        },
      },
    }));
  }

  return (
    <AppSheet
      ariaLabel={
        isEditing ? "edit communication sheet" : "create communication sheet"
      }
      description="Configure the trigger, audience, and message steps."
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
          {isFinalStep ? (
            <Button
              disabled={!canComplete || saving}
              icon={<CheckCircle2 />}
              onClick={() => void handleSave()}
              type="button"
            >
              {saving
                ? "Saving..."
                : isEditing
                ? "Save changes"
                : "Create communication"}
            </Button>
          ) : (
            <Button
              disabled={!canContinue}
              icon={<ChevronRight />}
              onClick={goToNextStep}
              type="button"
            >
              Continue
            </Button>
          )}
        </>
      }
      maxWidthClassName="max-w-2xl"
      onClose={onClose}
      open={open}
      title={isEditing ? "Edit communication" : "Add communication"}
    >
      <form className="grid gap-5">
        <CommunicationEditorStepper activeStep={activeStep} />

        {activeStep === "setup" ? (
          <section className="rounded-md border border-border bg-white p-4">
            <CommunicationSectionHeader
              icon={<Send className="size-5" />}
              title="Communication"
            />
            <div className="mt-4 grid gap-4">
              <AppTextField
                error={
                  draft.name && !draft.name.trim()
                    ? "Communication name cannot be blank."
                    : undefined
                }
                label="Name"
                maxLength={100}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Enter communication name"
                required
                value={draft.name}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <AppSelectField
                  label="Trigger"
                  onChange={(event) => {
                    const triggerType = event.target
                      .value as CommunicationEventType;
                    const shouldSchedule =
                      SCHEDULED_TRIGGER_TYPES.includes(triggerType);

                    setDraft((current) => ({
                      ...current,
                      type: triggerType,
                      trigger: {
                        type: triggerType,
                        schedule: shouldSchedule
                          ? current.trigger.schedule ?? createSchedule()
                          : null,
                      },
                    }));
                  }}
                  options={TRIGGER_OPTIONS.map((option) => ({
                    label: formatLabel(option),
                    value: option,
                  }))}
                  required
                  value={draft.trigger.type}
                />
                <AppSelectField
                  disabled={!hasSchedule}
                  label="Frequency"
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      trigger: {
                        ...current.trigger,
                        schedule: {
                          ...(current.trigger.schedule ?? createSchedule()),
                          frequency: event.target
                            .value as CommunicationFrequency,
                        },
                      },
                    }))
                  }
                  options={FREQUENCY_OPTIONS.map((option) => ({
                    label: formatLabel(option),
                    value: option,
                  }))}
                  required={hasSchedule}
                  value={draft.trigger.schedule?.frequency ?? "once"}
                />
              </div>
              {hasSchedule ? (
                <div
                  className={cn(
                    "grid gap-4",
                    schedule.frequency === "weekly"
                      ? "sm:grid-cols-3"
                      : "sm:grid-cols-2",
                  )}
                >
                  <ScheduleTimeField
                    hour={schedule.hour}
                    minute={schedule.minute}
                    onChange={(hour, minute) => {
                      setDraft((current) => ({
                        ...current,
                        trigger: {
                          ...current.trigger,
                          schedule: {
                            ...(current.trigger.schedule ?? createSchedule()),
                            hour,
                            minute,
                          },
                        },
                      }));
                    }}
                  />
                  {schedule.frequency === "weekly" ? (
                    <AppSelectField
                      label="Day of week"
                      onChange={(event) =>
                        updateSchedule("dayOfWeek", Number(event.target.value))
                      }
                      options={DAY_OF_WEEK_OPTIONS.map((option) => ({
                        label: option.label,
                        value: String(option.value),
                      }))}
                      required
                      value={String(schedule.dayOfWeek)}
                    />
                  ) : null}
                  <label className="grid gap-2">
                    <span className="text-footnote font-normal text-[#2F4B4F]">
                      Start date <span className="text-error">*</span>
                    </span>
                    <AppDatePicker
                      ariaLabel="Choose communication start date"
                      onChange={(date) =>
                        updateSchedule("startDate", date.getTime())
                      }
                      popoverAlign="right"
                      value={new Date(schedule.startDate)}
                    />
                  </label>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {activeStep === "audience" ? (
          <section className="rounded-md border border-border bg-white p-4">
            <CommunicationSectionHeader
              caption="Choose contact groups and loyalty tiers, or leave both blank to include all contacts."
              icon={<UsersRound className="size-5" />}
              title="Audience"
            />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <AudienceChipSelectField
                label="Tags"
                formatOption={formatLabel}
                onChange={(targetTags) =>
                  setDraft((current) => ({
                    ...current,
                    targetAudience: {
                      ...current.targetAudience,
                      targetTags,
                    },
                  }))
                }
                options={tagOptions}
                selected={targetTags}
                statusMessage={
                  isContactTagsFetching
                    ? "Loading tags..."
                    : isContactTagsError
                    ? "Unable to load tags"
                    : undefined
                }
                suggestedLabel="Available tags"
              />
              <AudienceChipSelectField
                label="Badge types"
                formatOption={formatBadgeOption}
                onChange={(targetBadgeTypes) =>
                  setDraft((current) => ({
                    ...current,
                    targetAudience: {
                      ...current.targetAudience,
                      targetBadgeTypes,
                    },
                  }))
                }
                options={badgeOptions}
                placeholder="Add badges"
                selected={targetBadgeTypes}
                statusMessage={
                  isBadgesFetching
                    ? "Loading badges..."
                    : isBadgesError
                    ? "Unable to load badges"
                    : undefined
                }
                suggestedLabel="Available badges"
              />
            </div>
          </section>
        ) : null}

        {activeStep === "steps" ? (
          <section className="rounded-md border border-border bg-white p-4">
            <CommunicationSectionHeader
              caption="Build the ordered sequence for this communication."
              icon={<CalendarClock className="size-5" />}
              title="Steps"
            />
            <div className="mt-4 grid gap-4">
              {draft.stepsOrder.map((stepId, index) => (
                <CommunicationStepCard
                  canRemove={draft.stepsOrder.length > 1}
                  key={stepId}
                  onRemove={() => removeStep(stepId)}
                  onUpdate={(updates) => updateStep(stepId, updates)}
                  step={draft.steps[stepId]}
                  stepNumber={index + 1}
                />
              ))}
              <Button
                className="justify-self-center"
                icon={<Plus />}
                onClick={addStep}
                type="button"
                variant="outline"
              >
                Add step
              </Button>
            </div>
          </section>
        ) : null}
      </form>
    </AppSheet>
  );
}

function CommunicationEditorStepper({
  activeStep,
}: {
  activeStep: CommunicationEditorStep;
}) {
  const activeIndex = COMMUNICATION_EDITOR_STEPS.findIndex(
    (step) => step.key === activeStep,
  );

  return (
    <div className="flex w-full items-center gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {COMMUNICATION_EDITOR_STEPS.map((step, index) => {
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
            {index < COMMUNICATION_EDITOR_STEPS.length - 1 ? (
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

function AudienceChipSelectField({
  formatOption = (option) => option,
  label,
  onChange,
  options,
  placeholder = "Add tags",
  selected,
  statusMessage,
  suggestedLabel,
}: {
  formatOption?: (option: string) => string;
  label: string;
  onChange: (selected: string[]) => void;
  options: string[];
  placeholder?: string;
  selected: string[];
  statusMessage?: string;
  suggestedLabel: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const optionValues = React.useMemo(
    () => getUniqueOptions([...options, ...selected]),
    [options, selected],
  );

  React.useEffect(() => {
    if (!isOpen) return;

    function closeOnOutsidePress(event: PointerEvent) {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsidePress);
  }, [isOpen]);

  function removeOption(optionToRemove: string) {
    onChange(selected.filter((option) => option !== optionToRemove));
  }

  function toggleOption(option: string) {
    const selectedOption = selected.find(
      (item) => item.toLocaleLowerCase() === option.toLocaleLowerCase(),
    );

    if (selectedOption) {
      removeOption(selectedOption);
      return;
    }

    onChange([...selected, option]);
  }

  return (
    <div className="grid gap-2" ref={rootRef}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-footnote font-normal text-[#2F4B4F]">
          {label}
        </span>
        <span className="text-caption-1 text-[#2F4B4F]/50">
          {selected.length} selected
        </span>
      </div>
      <div className="relative">
        <div
          className={cn(
            "flex min-h-12 w-full items-center justify-between gap-3 rounded-sm border border-border bg-fill px-3 py-2 text-left text-callout text-[#2F4B4F] outline-none transition focus-visible:ring-2 focus-visible:ring-primary/20",
            isOpen && "border-primary bg-white",
          )}
        >
          <span className="flex min-w-0 flex-1 flex-wrap gap-2">
            {selected.map((option) => (
              <button
                aria-label={`Remove ${formatOption(option)}`}
                className="inline-flex max-w-full items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-caption-1 font-semibold text-[#2F4B4F]"
                key={option}
                onClick={() => removeOption(option)}
                type="button"
              >
                <span className="truncate">{formatOption(option)}</span>
                <X className="size-3 shrink-0" />
              </button>
            ))}
            <button
              className="min-w-20 flex-1 text-left text-[#2F4B4F]/40"
              onClick={() => setIsOpen(true)}
              type="button"
            >
              {selected.length > 0
                ? placeholder.replace("Add ", "Add more ")
                : placeholder}
            </button>
          </span>
          <button
            aria-expanded={isOpen}
            aria-label={`Select ${label.toLocaleLowerCase()}`}
            className="flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-secondary/60"
            onClick={() => setIsOpen((current) => !current)}
            type="button"
          >
            <ChevronDown
              className={cn(
                "size-4 text-[#2F4B4F]/55 transition",
                isOpen && "rotate-180",
              )}
            />
          </button>
        </div>

        {isOpen ? (
          <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-md border border-border bg-white p-3 shadow-lg">
            {statusMessage ? (
              <p className="text-caption-1 font-semibold text-[#2F4B4F]/65">
                {statusMessage}
              </p>
            ) : null}
            {!statusMessage && optionValues.length === 0 ? (
              <p className="text-caption-1 font-semibold text-[#2F4B4F]/65">
                No options available.
              </p>
            ) : null}
            {optionValues.length > 0 ? (
              <div>
                <p className="text-caption-1 font-semibold text-[#2F4B4F]/65">
                  {suggestedLabel}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {optionValues.map((option) => {
                    const isSelected = selected.some(
                      (item) =>
                        item.toLocaleLowerCase() === option.toLocaleLowerCase(),
                    );

                    return (
                      <button
                        aria-pressed={isSelected}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-caption-1 font-semibold transition",
                          isSelected
                            ? "border-primary bg-secondary text-primary"
                            : "border-border bg-fill text-[#2F4B4F]/75 hover:border-primary/50",
                        )}
                        key={option}
                        onClick={() => toggleOption(option)}
                        type="button"
                      >
                        {formatOption(option)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ScheduleTimeField({
  hour,
  minute,
  onChange,
}: {
  hour: number;
  minute: number;
  onChange: (hour: number, minute: number) => void;
}) {
  return (
    <AppTextField
      label="Time"
      onChange={(event) => {
        const [nextHour, nextMinute] = event.target.value
          .split(":")
          .map(Number);
        onChange(nextHour, nextMinute);
      }}
      required
      type="time"
      value={formatTimeInput(hour, minute)}
    />
  );
}

function createDraftCommunication(): CommunicationData {
  const step = createStep(1);

  return {
    id: "comm_draft",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    name: "",
    businessId: "biz_northstar",
    createdBy: "admin_001",
    isActive: true,
    status: "active",
    type: "marketing_broadcast",
    hasPendingBatch: false,
    lastExecutedAt: null,
    lastCursor: null,
    trigger: {
      type: "marketing_broadcast",
      schedule: createSchedule(),
    },
    targetAudience: {
      targetTags: [],
      targetBadgeTypes: [],
    },
    stepsOrder: ["step_1"],
    steps: {
      step_1: step,
    },
    stats: {
      recipients: 0,
      delivered: 0,
      failed: 0,
      pending: 0,
    },
  };
}

function createStep(index: number): CommunicationStep {
  return {
    channel: "email",
    delay: index === 1 ? 0 : 1440,
    identityId: null,
    message: {
      subject: "",
      body: "",
    },
    ctas: [],
    template: {
      name: "",
      language: "en",
    },
  };
}

function createSchedule() {
  return {
    frequency: "once" as const,
    dayOfWeek: 1,
    hour: 9,
    minute: 0,
    startDate: Date.now(),
    timezone: "Africa/Lagos",
  };
}

function formatTimeInput(hour: number, minute: number) {
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return "";

  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
}

function getUniqueOptions(options: string[]) {
  return options.filter((option, index) => {
    const normalizedOption = option.toLocaleLowerCase();
    return (
      option.trim().length > 0 &&
      options.findIndex(
        (candidate) => candidate.toLocaleLowerCase() === normalizedOption,
      ) === index
    );
  });
}
