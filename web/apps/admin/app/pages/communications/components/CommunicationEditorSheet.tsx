import * as React from "react";
import {
  CalendarClock,
  CheckCircle2,
  Plus,
  Send,
  UsersRound,
  X,
} from "lucide-react";
import { AppDatePicker, AppSelectField, AppTextField, Button } from "@piya/ui";
import type {
  CommunicationData,
  CommunicationEditorMode,
  CommunicationEventType,
  CommunicationFrequency,
  CommunicationStep,
} from "../types";
import {
  DEFAULT_BADGE_OPTIONS,
  DEFAULT_TAG_OPTIONS,
  FREQUENCY_OPTIONS,
  SCHEDULED_TRIGGER_TYPES,
  TRIGGER_OPTIONS,
  formatLabel,
} from "../communicationUtils";
import { CommunicationSectionHeader } from "./CommunicationSectionHeader";
import { CommunicationStepCard } from "./CommunicationStepCard";
import { MultiSelectDropdown } from "./MultiSelectDropdown";

const DAY_OF_WEEK_OPTIONS = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];

type CommunicationEditorSheetProps = {
  communication: CommunicationData | null;
  mode: CommunicationEditorMode;
  onClose: () => void;
  open: boolean;
};

export function CommunicationEditorSheet({
  communication,
  mode,
  onClose,
  open,
}: CommunicationEditorSheetProps) {
  const [draft, setDraft] = React.useState<CommunicationData>(() =>
    communication ?? createDraftCommunication(),
  );

  React.useEffect(() => {
    if (open) {
      setDraft(communication ?? createDraftCommunication());
    }
  }, [communication, open]);

  if (!open) return null;

  const isEditing = mode === "edit";
  const hasSchedule = SCHEDULED_TRIGGER_TYPES.includes(draft.trigger.type);
  const schedule = draft.trigger.schedule ?? createSchedule();

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
    <div className="fixed inset-0 z-50 flex justify-end bg-[#102A2D]/45">
      <button
        aria-label="Close communication sheet"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />
      <aside className="relative flex h-full w-full max-w-3xl flex-col bg-white text-[#2F4B4F] shadow-xl">
        <div className="flex items-start justify-between border-b border-border p-6">
          <div>
            <h2 className="text-title-2 font-semibold text-[#2F4B4F]">
              {isEditing ? "Edit communication" : "Add communication"}
            </h2>
            <p className="mt-1 text-callout text-[#2F4B4F]/70">
              Configure the trigger, audience, and message steps.
            </p>
          </div>
          <button
            aria-label="Close"
            className="flex size-10 items-center justify-center rounded-full bg-fill text-[#2F4B4F] hover:bg-secondary"
            onClick={onClose}
            type="button"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form className="grid gap-5">
            <section className="rounded-md border border-border bg-white p-4">
              <CommunicationSectionHeader
                icon={<Send className="size-5" />}
                title="Communication"
              />
              <div className="mt-4 grid gap-4">
                <AppTextField
                  label="Name"
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="e.g. June discount alert"
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
                            ? (current.trigger.schedule ?? createSchedule())
                            : null,
                        },
                      }));
                    }}
                    options={TRIGGER_OPTIONS.map((option) => ({
                      label: formatLabel(option),
                      value: option,
                    }))}
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
                            frequency: event.target.value as CommunicationFrequency,
                          },
                        },
                      }))
                    }
                    options={FREQUENCY_OPTIONS.map((option) => ({
                      label: formatLabel(option),
                      value: option,
                    }))}
                    value={draft.trigger.schedule?.frequency ?? "once"}
                  />
                </div>
                {hasSchedule ? (
                  <div className="grid gap-4 sm:grid-cols-3">
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
                    <AppSelectField
                      label="Day of week"
                      onChange={(event) =>
                        updateSchedule("dayOfWeek", Number(event.target.value))
                      }
                      options={DAY_OF_WEEK_OPTIONS.map((option) => ({
                        label: option.label,
                        value: String(option.value),
                      }))}
                      value={String(schedule.dayOfWeek)}
                    />
                    <label className="grid gap-2">
                      <span className="text-footnote font-normal text-[#2F4B4F]">
                        Start date
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

            <section className="rounded-md border border-border bg-white p-4">
              <CommunicationSectionHeader
                caption="Choose which contact groups and loyalty tiers should receive this communication."
                icon={<UsersRound className="size-5" />}
                title="Audience"
              />
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <MultiSelectDropdown
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
                  options={DEFAULT_TAG_OPTIONS}
                  placeholder="Select tags"
                  selected={draft.targetAudience?.targetTags ?? []}
                />
                <MultiSelectDropdown
                  label="Badge types"
                  formatOption={formatLabel}
                  onChange={(targetBadgeTypes) =>
                    setDraft((current) => ({
                      ...current,
                      targetAudience: {
                        ...current.targetAudience,
                        targetBadgeTypes,
                      },
                    }))
                  }
                  options={DEFAULT_BADGE_OPTIONS}
                  placeholder="Select badges"
                  selected={draft.targetAudience?.targetBadgeTypes ?? []}
                />
              </div>
            </section>

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
          </form>
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
          <Button icon={<CheckCircle2 />} onClick={onClose} type="button">
            {isEditing ? "Save changes" : "Create communication"}
          </Button>
        </div>
      </aside>
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
  const [value, setValue] = React.useState(() => formatTimeInput(hour, minute));

  React.useEffect(() => {
    setValue(formatTimeInput(hour, minute));
  }, [hour, minute]);

  function commit(nextValue: string) {
    const parsed = parseTimeInput(nextValue);
    setValue(formatTimeInput(parsed.hour, parsed.minute));
    onChange(parsed.hour, parsed.minute);
  }

  function handleChange(nextValue: string) {
    setValue(formatTimeDraft(nextValue));
  }

  return (
    <label className="grid gap-2">
      <span className="text-footnote font-normal text-[#2F4B4F]">Time</span>
      <span className="flex h-12 items-center overflow-hidden rounded-sm border border-border bg-fill transition focus-within:border-primary focus-within:bg-white">
        <input
          className="min-w-0 flex-1 bg-transparent px-3 text-callout text-[#2F4B4F] outline-none placeholder:text-[#2F4B4F]/40"
          inputMode="numeric"
          onBlur={() => commit(value)}
          onChange={(event) => handleChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.currentTarget.blur();
            }
          }}
          placeholder="09:00"
          value={value}
        />
        <span className="flex w-12 shrink-0 justify-center border-l border-border text-caption-1 font-semibold text-[#2F4B4F]/60">
          {getTimeSuffix(value)}
        </span>
      </span>
    </label>
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
    status: "draft",
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
  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
}

function formatTimeDraft(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;

  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

function parseTimeInput(value: string) {
  const digits = value.replace(/\D/g, "").padEnd(4, "0").slice(0, 4);
  return {
    hour: numberInRange(digits.slice(0, 2), 0, 23),
    minute: numberInRange(digits.slice(2), 0, 59),
  };
}

function getTimeSuffix(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 2) return "";

  const hour = Number(digits.slice(0, 2));
  if (!Number.isFinite(hour) || hour === 0 || hour > 12) return "";

  return hour === 12 ? "PM" : "AM";
}

function numberInRange(value: string, min: number, max: number) {
  const parsed = Number(value.replace(/\D/g, ""));
  if (!Number.isFinite(parsed)) return min;

  return Math.min(Math.max(parsed, min), max);
}
