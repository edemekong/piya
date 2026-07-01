import * as React from "react";
import { Code2, Link2, Timer, Trash2 } from "lucide-react";
import { AppTextField, Button, cn } from "@piya/ui";
import type {
  CommunicationAdminStep as CommunicationStep,
  CommunicationChannel,
} from "@piya/shared/types";
import {
  CHANNEL_OPTIONS,
  COMMUNICATION_VARIABLES,
  formatDelay,
  formatLabel,
} from "@piya/shared/utils";
import { RichDescriptionField } from "../../../components/RichDescriptionField";
import { CommunicationChannelIcon } from "./CommunicationChannelIcon";
import { getCommunicationStepErrors } from "./communication-editor-validation";

type CommunicationStepCardProps = {
  canRemove: boolean;
  onRemove: () => void;
  onUpdate: (updates: Partial<CommunicationStep>) => void;
  step: CommunicationStep;
  stepNumber: number;
};

export function CommunicationStepCard({
  canRemove,
  onRemove,
  onUpdate,
  step,
  stepNumber,
}: CommunicationStepCardProps) {
  const subjectInputRef = React.useRef<HTMLInputElement | null>(null);
  const [touchedFields, setTouchedFields] = React.useState<
    Partial<
      Record<"body" | "ctaLabel" | "ctaUrl" | "delay" | "subject", boolean>
    >
  >({});
  const errors = getCommunicationStepErrors(step);
  const hasCta = Boolean(
    step.ctas[0]?.label.trim() || step.ctas[0]?.url.trim(),
  );
  const visibleErrors = {
    body: touchedFields.body ? errors.body : undefined,
    ctaLabel: touchedFields.ctaLabel || hasCta ? errors.ctaLabel : undefined,
    ctaUrl: touchedFields.ctaUrl || hasCta ? errors.ctaUrl : undefined,
    delay: touchedFields.delay ? errors.delay : undefined,
    subject: touchedFields.subject ? errors.subject : undefined,
  };

  function markFieldTouched(
    field: "body" | "ctaLabel" | "ctaUrl" | "delay" | "subject",
  ) {
    setTouchedFields((current) =>
      current[field] ? current : { ...current, [field]: true },
    );
  }

  function insertSubjectVariable(variable: string) {
    const subject = step.message.subject ?? "";
    const input = subjectInputRef.current;
    const start = input?.selectionStart ?? subject.length;
    const end = input?.selectionEnd ?? subject.length;
    const nextSubject = `${subject.slice(0, start)}${variable}${subject.slice(
      end,
    )}`;
    const nextCursorPosition = start + variable.length;

    onUpdate({
      message: { ...step.message, subject: nextSubject },
    });

    requestAnimationFrame(() => {
      subjectInputRef.current?.focus();
      subjectInputRef.current?.setSelectionRange(
        nextCursorPosition,
        nextCursorPosition,
      );
    });
  }

  return (
    <div className="relative my-4 rounded-md border border-border bg-white p-4 pt-8">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
        <label
          className={cn(
            "flex items-center gap-2 rounded-full border border-border bg-white px-3 py-2 shadow-sm transition focus-within:border-primary",
            errors.delay && "border-error focus-within:border-error",
          )}
        >
          <Timer className="size-4 text-[#2F4B4F]/45" />
          <span className="sr-only">
            Delay minutes for step {stepNumber} (required)
          </span>
          <input
            aria-describedby={
              visibleErrors.delay
                ? `communication-step-${stepNumber}-delay-error`
                : undefined
            }
            aria-invalid={Boolean(visibleErrors.delay)}
            aria-label={`Delay minutes for step ${stepNumber}`}
            className="w-20 bg-transparent text-center text-callout font-semibold text-[#2F4B4F] outline-none"
            min={0}
            onChange={(event) =>
              onUpdate({
                delay:
                  event.target.value === "" ? NaN : Number(event.target.value),
              })
            }
            onBlur={() => markFieldTouched("delay")}
            required
            type="number"
            value={Number.isFinite(step.delay) ? step.delay : ""}
          />
          <span className="text-caption-1 font-semibold text-[#2F4B4F]/55">
            mins
          </span>
        </label>
        {visibleErrors.delay ? (
          <p
            className="mt-1 w-max max-w-60 rounded-full bg-white px-2 text-center text-caption-1 font-semibold text-error shadow-sm"
            id={`communication-step-${stepNumber}-delay-error`}
          >
            {visibleErrors.delay}
          </p>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-footnote font-semibold text-primary">
            {stepNumber}
          </span>
          <div>
            <p className="text-headline font-semibold text-[#2F4B4F]">
              Step {stepNumber}
            </p>
            <p className="text-footnote text-[#2F4B4F]/60">
              {formatDelay(step.delay)}
            </p>
          </div>
        </div>
        {canRemove ? (
          <Button
            aria-label={`Remove step ${stepNumber}`}
            className="bg-fill text-error hover:bg-error/10"
            onClick={onRemove}
            size="icon"
            title={`Remove step ${stepNumber}`}
            type="button"
            variant="secondary"
          >
            <Trash2 className="size-4" />
          </Button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-4">
        <label className="grid gap-2">
          <span className="text-footnote font-normal text-[#2F4B4F]">
            Channel <span className="text-error">*</span>
          </span>
          <div className="grid gap-2 sm:grid-cols-3">
            {CHANNEL_OPTIONS.map((channel) => (
              <button
                aria-pressed={step.channel === channel}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-callout font-semibold transition",
                  step.channel === channel
                    ? "border-primary bg-secondary text-primary"
                    : "border-border bg-fill text-[#2F4B4F]/70 hover:bg-secondary/40",
                )}
                key={channel}
                onClick={() => onUpdate({ channel })}
                type="button"
              >
                <ChannelIcon channel={channel} />
                {formatLabel(channel)}
              </button>
            ))}
          </div>
        </label>

        <div className="grid gap-4">
          {step.channel === "email" ? (
            <AppTextField
              error={visibleErrors.subject}
              label="Subject"
              maxLength={200}
              onBlur={() => markFieldTouched("subject")}
              onChange={(event) => {
                markFieldTouched("subject");
                onUpdate({
                  message: { ...step.message, subject: event.target.value },
                });
              }}
              placeholder="Enter email subject"
              ref={subjectInputRef}
              required
              suffix={
                <VariableInsertButton
                  align="inline"
                  label="Insert subject variable"
                  onSelect={insertSubjectVariable}
                />
              }
              value={step.message.subject ?? ""}
            />
          ) : null}
        </div>

        <RichDescriptionField
          error={visibleErrors.body}
          label="Message"
          onBlur={() => markFieldTouched("body")}
          onChange={(body) => {
            markFieldTouched("body");
            onUpdate({
              message: { ...step.message, body },
            });
          }}
          required
          value={step.message.body}
        />

        <div className="rounded-md border border-dashed border-border bg-fill p-3">
          <div className="flex items-center gap-2 text-footnote font-normal text-[#2F4B4F]">
            <Link2 className="size-4 text-[#2F4B4F]/60" />
            CTA (optional)
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <AppTextField
              error={visibleErrors.ctaLabel}
              label="Button label"
              maxLength={80}
              onBlur={() => markFieldTouched("ctaLabel")}
              onChange={(event) => {
                markFieldTouched("ctaLabel");
                onUpdate({
                  ctas: [
                    {
                      label: event.target.value,
                      type: step.ctas[0]?.type ?? "primary",
                      url: step.ctas[0]?.url ?? "",
                    },
                  ],
                });
              }}
              placeholder="Enter button label"
              required={Boolean(step.ctas[0]?.url.trim())}
              value={step.ctas[0]?.label ?? ""}
            />
            <AppTextField
              error={visibleErrors.ctaUrl}
              label="Button URL"
              maxLength={2048}
              onBlur={() => markFieldTouched("ctaUrl")}
              onChange={(event) => {
                markFieldTouched("ctaUrl");
                onUpdate({
                  ctas: [
                    {
                      label: step.ctas[0]?.label ?? "",
                      type: step.ctas[0]?.type ?? "primary",
                      url: event.target.value,
                    },
                  ],
                });
              }}
              placeholder="Enter button URL"
              required={Boolean(step.ctas[0]?.label.trim())}
              type="url"
              value={step.ctas[0]?.url ?? ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function VariableInsertButton({
  align,
  label,
  onSelect,
}: {
  align: "inline";
  label: string;
  onSelect: (variable: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLSpanElement | null>(null);

  React.useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  return (
    <span
      className={cn(
        "z-10",
        align === "inline" ? "relative mr-2 self-center" : null,
      )}
      ref={menuRef}
    >
      <button
        aria-expanded={open}
        aria-label={label}
        className="flex size-8 items-center justify-center rounded-full bg-white text-[#2F4B4F]/65 shadow-sm transition hover:bg-secondary hover:text-primary"
        onClick={() => setOpen((current) => !current)}
        title={label}
        type="button"
      >
        <Code2 className="size-4" />
      </button>

      {open ? (
        <span className="absolute right-0 top-10 z-20 w-52 rounded-md border border-border bg-white py-2 text-callout text-[#2F4B4F] shadow-lg">
          {COMMUNICATION_VARIABLES.map((variable) => (
            <button
              className="flex w-full px-4 py-2 text-left font-mono text-caption-1 transition hover:bg-fill"
              key={variable}
              onClick={() => {
                onSelect(variable);
                setOpen(false);
              }}
              type="button"
            >
              {variable}
            </button>
          ))}
        </span>
      ) : null}
    </span>
  );
}

function ChannelIcon({ channel }: { channel: CommunicationChannel }) {
  return <CommunicationChannelIcon channel={channel} className="size-4" />;
}
