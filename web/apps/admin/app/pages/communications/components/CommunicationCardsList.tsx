import * as React from "react";
import {
  CirclePause,
  MoreVertical,
  Pencil,
  Search,
  Trash2,
  UsersRound,
} from "lucide-react";
import { Button, cn } from "@yinapp/ui";
import type { CommunicationData } from "../types";
import {
  formatDate,
  formatLabel,
  formatNumber,
  getCommunicationChannels,
  statusClassName,
} from "../communicationUtils";
import { CommunicationChannelIcon } from "./CommunicationChannelIcon";

type CommunicationCardsListProps = {
  communications: CommunicationData[];
  onDelete: (communication: CommunicationData) => void;
  onEdit: (communication: CommunicationData) => void;
  onPause: (communication: CommunicationData) => void;
  onView: (communication: CommunicationData) => void;
  onViewRecipients: (communication: CommunicationData) => void;
};

export function CommunicationCardsList({
  communications,
  onDelete,
  onEdit,
  onPause,
  onView,
  onViewRecipients,
}: CommunicationCardsListProps) {
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

  return (
    <section className="rounded-md bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border p-5 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#2F4B4F]/50" />
          <input
            className="h-11 w-full rounded-sm border border-border bg-fill pl-10 pr-3 text-callout text-[#2F4B4F] outline-none transition focus:border-primary focus:bg-white"
            placeholder="Search communications"
            type="search"
          />
        </div>
        <p className="text-footnote text-[#2F4B4F]/65">
          Showing {communications.length} communications
        </p>
      </div>

      <div className="grid gap-4 p-5">
        {communications.map((communication) => {
          const channels = getCommunicationChannels(communication);

          return (
            <article
              className="group relative grid gap-4 rounded-md border border-border bg-white p-5 text-left transition hover:border-primary/30 hover:shadow-sm lg:grid-cols-[1fr_auto]"
              key={communication.id}
            >
              <button
                className="min-w-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => onView(communication)}
                type="button"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-title-3 font-semibold text-[#2F4B4F]">
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

                <div className="mt-4 flex flex-wrap gap-2">
                  {channels.map((channel, index) => (
                    <span
                      className="inline-flex items-center gap-1 rounded-full bg-fill px-2.5 py-1 text-caption-1 font-semibold text-[#2F4B4F]/70"
                      key={`${communication.id}-${channel}-${index}`}
                    >
                      <CommunicationChannelIcon
                        channel={channel}
                        className="size-3.5"
                      />
                      {formatLabel(channel)}
                    </span>
                  ))}
                </div>
              </button>

              <div className="flex items-start justify-between gap-4 lg:justify-end">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <Metric label="Recipients" value={communication.stats.recipients} />
                  <Metric label="Delivered" value={communication.stats.delivered} />
                  <Metric label="Failed" value={communication.stats.failed} />
                </div>

                <div className="flex items-center gap-1">
                  <div className="relative">
                    <button
                      aria-expanded={openMenuId === communication.id}
                      aria-label={`Open actions for ${communication.name}`}
                      className="flex size-10 items-center justify-center rounded-full text-[#2F4B4F]/65 transition hover:bg-fill hover:text-[#2F4B4F]"
                      onClick={() =>
                        setOpenMenuId((currentId) =>
                          currentId === communication.id ? null : communication.id,
                        )
                      }
                      title="More actions"
                      type="button"
                    >
                      <MoreVertical className="size-5" />
                    </button>

                    {openMenuId === communication.id ? (
                      <div className="absolute right-0 top-11 z-20 w-48 rounded-md border border-border bg-white py-2 text-callout text-[#2F4B4F] shadow-lg">
                        <MenuButton
                          icon={<Pencil className="size-4" />}
                          label="Edit"
                          onClick={() => {
                            setOpenMenuId(null);
                            onEdit(communication);
                          }}
                        />
                        <MenuButton
                          icon={<UsersRound className="size-4" />}
                          label="View recipients"
                          onClick={() => {
                            setOpenMenuId(null);
                            onViewRecipients(communication);
                          }}
                        />
                        <MenuButton
                          icon={<CirclePause className="size-4" />}
                          label="Pause"
                          onClick={() => {
                            setOpenMenuId(null);
                            onPause(communication);
                          }}
                        />
                        <MenuButton
                          danger
                          icon={<Trash2 className="size-4" />}
                          label="Delete"
                          onClick={() => {
                            setOpenMenuId(null);
                            onDelete(communication);
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 text-footnote text-[#2F4B4F]/60 lg:col-span-2">
                <span className="font-semibold text-primary">
                  {formatLabel(communication.type)}
                </span>
                <span>Last executed {formatDate(communication.lastExecutedAt)}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-20 rounded-md bg-fill px-3 py-2">
      <p className="text-caption-1 text-[#2F4B4F]/55">{label}</p>
      <p className="mt-1 text-headline font-semibold text-[#2F4B4F]">
        {formatNumber(value)}
      </p>
    </div>
  );
}

function MenuButton({
  danger = false,
  icon,
  label,
  onClick,
}: {
  danger?: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 border-b border-border px-5 py-3 text-left transition last:border-b-0 hover:bg-fill",
        danger && "text-error",
      )}
      onClick={onClick}
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}
