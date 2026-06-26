import { Send, Target, X } from "lucide-react";
import { IconSectionHeader as CommunicationSectionHeader, cn } from "@piya/ui";
import type { CommunicationAdminData as CommunicationData } from "@piya/shared/types";
import {
  formatDate,
  formatLabel,
  formatNumber,
  getCommunicationChannels,
  statusClassName,
} from "@piya/shared/utils";
import { CommunicationChannelIcon } from "./CommunicationChannelIcon";

type CommunicationViewSheetProps = {
  communication: CommunicationData | null;
  onClose: () => void;
  open: boolean;
};

export function CommunicationViewSheet({
  communication,
  onClose,
  open,
}: CommunicationViewSheetProps) {
  if (!open || !communication) return null;

  const channels = getCommunicationChannels(communication);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#102A2D]/45">
      <button
        aria-label="Close communication view sheet"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />
      <aside className="relative flex h-full w-full max-w-2xl flex-col bg-white text-[#2F4B4F] shadow-xl">
        <div className="flex items-start justify-between border-b border-border p-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-title-2 font-semibold text-[#2F4B4F]">
                {communication.name}
              </h2>
              <span
                className={cn(
                  "inline-flex rounded-full border px-2.5 py-1 text-caption-1 font-semibold",
                  statusClassName(communication.status),
                )}
              >
                {formatLabel(communication.status)}
              </span>
            </div>
            <p className="mt-2 text-callout text-[#2F4B4F]/70">
              {formatLabel(communication.type)}
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
          <div className="grid gap-5">
            <section className="rounded-md border border-border bg-white p-4">
              <CommunicationSectionHeader
                icon={<Send className="size-5" />}
                title="Performance"
              />
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Metric label="Recipients" value={communication.stats.recipients} />
                <Metric label="Delivered" value={communication.stats.delivered} />
                <Metric label="Failed" value={communication.stats.failed} />
                <Metric label="Pending" value={communication.stats.pending} />
              </div>
              <p className="mt-4 text-footnote text-[#2F4B4F]/65">
                Last executed {formatDate(communication.lastExecutedAt)}
              </p>
            </section>

            <section className="rounded-md border border-border bg-white p-4">
              <CommunicationSectionHeader
                icon={<Target className="size-5" />}
                title="Audience"
              />
              <div className="mt-4 grid gap-3 text-callout text-[#2F4B4F]/75">
                <p>
                  <span className="font-semibold text-[#2F4B4F]">Tags:</span>{" "}
                  {communication.targetAudience?.targetTags?.join(", ") || "All"}
                </p>
                <p>
                  <span className="font-semibold text-[#2F4B4F]">Badges:</span>{" "}
                  {communication.targetAudience?.targetBadgeTypes?.join(", ") ||
                    "All"}
                </p>
                <p>
                  <span className="font-semibold text-[#2F4B4F]">Channels:</span>{" "}
                  {channels.map(formatLabel).join(", ")}
                </p>
              </div>
            </section>

            <section className="rounded-md border border-border bg-white p-4">
              <CommunicationSectionHeader
                icon={<Send className="size-5" />}
                title="Steps"
              />
              <div className="mt-4 grid gap-3">
                {communication.stepsOrder.map((stepId, index) => {
                  const step = communication.steps[stepId];

                  return (
                    <div
                      className="rounded-md border border-border bg-fill p-4"
                      key={stepId}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-headline font-semibold text-[#2F4B4F]">
                          Step {index + 1}
                        </p>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-caption-1 font-semibold text-[#2F4B4F]/70">
                          <CommunicationChannelIcon
                            channel={step.channel}
                            className="size-3.5"
                          />
                          {formatLabel(step.channel)}
                        </span>
                      </div>
                      {step.message.subject ? (
                        <p className="mt-3 text-callout font-semibold text-[#2F4B4F]">
                          {step.message.subject}
                        </p>
                      ) : null}
                      <p className="mt-2 text-callout text-[#2F4B4F]/70">
                        {step.message.body}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-fill p-3">
      <p className="text-caption-1 text-[#2F4B4F]/55">{label}</p>
      <p className="mt-1 text-headline font-semibold text-[#2F4B4F]">
        {formatNumber(value)}
      </p>
    </div>
  );
}
