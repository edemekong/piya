import { Mail, Phone, X } from "lucide-react";
import { cn } from "@piya/ui";
import type { CommunicationData, CommunicationRecipient } from "@piya/shared/models";
import { formatDate, formatLabel } from "../communicationUtils";
import { CommunicationChannelIcon } from "./CommunicationChannelIcon";

type CommunicationRecipientsSheetProps = {
  communication: CommunicationData | null;
  onClose: () => void;
  open: boolean;
  recipients: CommunicationRecipient[];
};

export function CommunicationRecipientsSheet({
  communication,
  onClose,
  open,
  recipients,
}: CommunicationRecipientsSheetProps) {
  if (!open || !communication) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#102A2D]/45">
      <button
        aria-label="Close recipients sheet"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />
      <aside className="relative flex h-full w-full max-w-3xl flex-col bg-white text-[#2F4B4F] shadow-xl">
        <div className="flex items-start justify-between border-b border-border p-6">
          <div>
            <h2 className="text-title-2 font-semibold text-[#2F4B4F]">
              {communication.name}
            </h2>
            <p className="mt-1 text-callout text-[#2F4B4F]/70">
              See who entered this communication and delivery status by channel.
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

        <div className="grid grid-cols-3 gap-3 border-b border-border p-6">
          <SummaryTile label="Recipients" value={communication.stats.recipients} />
          <SummaryTile label="Delivered" value={communication.stats.delivered} />
          <SummaryTile label="Failed" value={communication.stats.failed} />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-3">
            {recipients.map((recipient) => (
              <article
                className="rounded-md border border-border bg-white p-4"
                key={recipient.id}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-headline font-semibold text-[#2F4B4F]">
                        {recipient.name}
                      </h3>
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-caption-1 font-semibold",
                          recipient.status === "delivered" &&
                            "border-success/20 bg-success/10 text-success",
                          recipient.status === "pending" &&
                            "border-border bg-fill text-[#2F4B4F]/65",
                          recipient.status === "failed" &&
                            "border-error/20 bg-error/10 text-error",
                        )}
                      >
                        {formatLabel(recipient.status)}
                      </span>
                    </div>
                    <div className="mt-2 grid gap-1 text-callout text-[#2F4B4F]/70">
                      <span className="inline-flex items-center gap-2">
                        <Mail className="size-4" /> {recipient.email}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Phone className="size-4" /> {recipient.phoneNumber}
                      </span>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-fill px-2.5 py-1 text-caption-1 font-semibold text-[#2F4B4F]/70">
                      <CommunicationChannelIcon
                        channel={recipient.channel}
                        className="size-3.5"
                      />
                      {formatLabel(recipient.channel)}
                    </span>
                    <p className="mt-2 text-footnote text-[#2F4B4F]/60">
                      {formatDate(recipient.lastActivityAt)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-fill p-4">
      <p className="text-caption-1 text-[#2F4B4F]/55">{label}</p>
      <p className="mt-1 text-title-3 font-semibold text-[#2F4B4F]">{value}</p>
    </div>
  );
}
