import * as React from "react";
import { Code2, Link2, Mail, Timer, Trash2 } from "lucide-react";
import { Button, cn } from "@piya/ui";
import type { CommunicationChannel, CommunicationStep } from "../types";
import {
  CHANNEL_OPTIONS,
  COMMUNICATION_VARIABLES,
  formatDelay,
  formatLabel,
} from "../communicationUtils";
import { CommunicationChannelIcon } from "./CommunicationChannelIcon";

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
  const bodyTextareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  function insertSubjectVariable(variable: string) {
    const subject = step.message.subject ?? "";
    const input = subjectInputRef.current;
    const start = input?.selectionStart ?? subject.length;
    const end = input?.selectionEnd ?? subject.length;
    const nextSubject = `${subject.slice(0, start)}${variable}${subject.slice(end)}`;
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

  function insertBodyVariable(variable: string) {
    const body = step.message.body;
    const textarea = bodyTextareaRef.current;
    const start = textarea?.selectionStart ?? body.length;
    const end = textarea?.selectionEnd ?? body.length;
    const nextBody = `${body.slice(0, start)}${variable}${body.slice(end)}`;
    const nextCursorPosition = start + variable.length;

    onUpdate({
      message: { ...step.message, body: nextBody },
    });

    requestAnimationFrame(() => {
      bodyTextareaRef.current?.focus();
      bodyTextareaRef.current?.setSelectionRange(
        nextCursorPosition,
        nextCursorPosition,
      );
    });
  }

  return (
    <div className="relative my-4 rounded-md border border-border bg-white p-4 pt-8">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
        <label className="flex items-center gap-2 rounded-full border border-border bg-white px-3 py-2 shadow-sm">
          <Timer className="size-4 text-[#2F4B4F]/45" />
          <span className="sr-only">Delay minutes for step {stepNumber}</span>
          <input
            aria-label={`Delay minutes for step ${stepNumber}`}
            className="w-20 bg-transparent text-center text-callout font-semibold text-[#2F4B4F] outline-none"
            min={0}
            onChange={(event) =>
              onUpdate({ delay: Number(event.target.value || 0) })
            }
            type="number"
            value={step.delay}
          />
          <span className="text-caption-1 font-semibold text-[#2F4B4F]/55">
            mins
          </span>
        </label>
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
          <span className="text-footnote font-semibold text-[#2F4B4F]">
            Channel
          </span>
          <div className="grid gap-2 sm:grid-cols-3">
            {CHANNEL_OPTIONS.map((channel) => (
              <button
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
            <label className="grid gap-2">
              <span className="text-footnote font-semibold text-[#2F4B4F]">
                Subject
              </span>
              <span className="relative block">
                <input
                  className="h-12 w-full rounded-sm border border-border bg-fill px-3 pr-12 text-callout text-[#2F4B4F] outline-none transition placeholder:text-[#2F4B4F]/40 focus:border-primary focus:bg-white"
                  onChange={(event) =>
                    onUpdate({
                      message: { ...step.message, subject: event.target.value },
                    })
                  }
                  placeholder="Email subject"
                  ref={subjectInputRef}
                  value={step.message.subject ?? ""}
                />
                <VariableInsertButton
                  align="right"
                  label="Insert subject variable"
                  onSelect={insertSubjectVariable}
                />
              </span>
            </label>
          ) : null}
        </div>

        <label className="grid gap-2">
          <span className="text-footnote font-semibold text-[#2F4B4F]">
            Message
          </span>
          <span className="relative block">
            <textarea
              className="min-h-32 w-full rounded-sm border border-border bg-fill px-3 py-3 pb-12 text-callout text-[#2F4B4F] outline-none transition placeholder:text-[#2F4B4F]/40 focus:border-primary focus:bg-white"
              onChange={(event) =>
                onUpdate({
                  message: { ...step.message, body: event.target.value },
                })
              }
              placeholder="Write the message body"
              ref={bodyTextareaRef}
              value={step.message.body}
            />
            <VariableInsertButton
              align="bottom-right"
              label="Insert message variable"
              onSelect={insertBodyVariable}
            />
          </span>
        </label>

        <div className="rounded-md border border-dashed border-border bg-fill p-3">
          <div className="flex items-center gap-2 text-footnote font-semibold text-[#2F4B4F]">
            <Link2 className="size-4 text-[#2F4B4F]/60" />
            CTA
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input
              className="h-11 rounded-sm border border-border bg-white px-3 text-callout text-[#2F4B4F] outline-none transition placeholder:text-[#2F4B4F]/40 focus:border-primary"
              onChange={(event) =>
                onUpdate({
                  ctas: [
                    {
                      label: event.target.value,
                      type: step.ctas[0]?.type ?? "primary",
                      url: step.ctas[0]?.url ?? "",
                    },
                  ],
                })
              }
              placeholder="Button label"
              value={step.ctas[0]?.label ?? ""}
            />
            <input
              className="h-11 rounded-sm border border-border bg-white px-3 text-callout text-[#2F4B4F] outline-none transition placeholder:text-[#2F4B4F]/40 focus:border-primary"
              onChange={(event) =>
                onUpdate({
                  ctas: [
                    {
                      label: step.ctas[0]?.label ?? "",
                      type: step.ctas[0]?.type ?? "primary",
                      url: event.target.value,
                    },
                  ],
                })
              }
              placeholder="https://"
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
  align: "right" | "bottom-right";
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
        "absolute z-10",
        align === "right"
          ? "right-2 top-1/2 -translate-y-1/2"
          : "bottom-3 right-3",
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
