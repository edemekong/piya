import * as React from "react";
import {
  CirclePause,
  CirclePlay,
  Loader2,
  MoreVertical,
  Pencil,
  Send,
  Trash2,
  UsersRound,
} from "lucide-react";
import { AppPopup, EmptyState, cn } from "@piya/ui";
import type { CommunicationAdminData as CommunicationData } from "@piya/shared/types";
import {
  formatLabel,
  formatNumber,
  getCommunicationChannels,
  statusClassName,
} from "@piya/shared/utils";
import { CommunicationChannelIcon } from "./CommunicationChannelIcon";

type CommunicationsTableProps = {
  communications: CommunicationData[];
  isError: boolean;
  isLoading: boolean;
  onDelete: (communication: CommunicationData) => void;
  onEdit: (communication: CommunicationData) => void;
  onStatusChange: (communication: CommunicationData) => void;
  onViewRecipients: (communication: CommunicationData) => void;
};

export function CommunicationsTable({
  communications,
  isError,
  isLoading,
  onDelete,
  onEdit,
  onStatusChange,
  onViewRecipients,
}: CommunicationsTableProps) {
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
  const [menuAnchorElement, setMenuAnchorElement] =
    React.useState<HTMLButtonElement | null>(null);
  const openMenuCommunication = communications.find(
    (communication) => communication.id === openMenuId,
  );

  function openCommunicationMenu(
    communicationId: string,
    button: HTMLButtonElement,
  ) {
    const nextOpen = openMenuId !== communicationId;

    setMenuAnchorElement(button);
    setOpenMenuId(nextOpen ? communicationId : null);
  }

  return (
    <section className="rounded-md bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border text-caption-1 font-semibold text-[#2F4B4F]/60">
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Trigger type</th>
              <th className="px-5 py-4">Channel</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Recipients</th>
              <th className="w-16 px-5 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={6}>
                  <div className="flex h-[200px] items-center justify-center">
                    <Loader2
                      aria-label="Loading communications"
                      className="size-6 animate-spin text-primary"
                    />
                  </div>
                </td>
              </tr>
            ) : null}
            {!isLoading && !isError && communications.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState
                    className="flex h-[200px] flex-col items-center justify-center rounded-none border-0 bg-transparent p-0 text-center"
                    icon={<Send className="size-5" />}
                    title={
                      <span className="font-normal text-[#2F4B4F]/55">
                        Communications you create will appear here.
                      </span>
                    }
                  />
                </td>
              </tr>
            ) : null}
            {isError ? (
              <tr>
                <td
                  className="px-5 py-12 text-center text-callout text-error"
                  colSpan={6}
                >
                  Unable to load communications.
                </td>
              </tr>
            ) : null}
            {!isLoading &&
              !isError &&
              communications.map((communication) => {
                const channels = getCommunicationChannels(communication);

                return (
                  <tr
                    className="cursor-pointer text-callout text-[#2F4B4F] transition hover:bg-fill/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                    key={communication.id}
                    onClick={() => onEdit(communication)}
                    onKeyDown={(event) => {
                      if (event.currentTarget !== event.target) return;

                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onEdit(communication);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <td className="px-5 py-4">
                      <p className="max-w-xs truncate font-semibold text-[#2F4B4F]">
                        {communication.name}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-[#2F4B4F]/70">
                      {formatLabel(communication.trigger.type)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {channels.map((channel, index) => (
                          <span
                            className="inline-flex size-8 items-center justify-center rounded-full bg-fill text-[#2F4B4F]/70"
                            key={`${communication.id}-${channel}-${index}`}
                            title={formatLabel(channel)}
                          >
                            <CommunicationChannelIcon
                              channel={channel}
                              className="size-4"
                            />
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2.5 py-1 text-caption-1 font-semibold",
                          statusClassName(communication.status),
                        )}
                      >
                        {formatLabel(communication.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold">
                      {formatNumber(communication.stats.recipients)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="relative inline-flex">
                        <button
                          aria-expanded={openMenuId === communication.id}
                          aria-label={`Open actions for ${communication.name}`}
                          className="flex size-9 items-center justify-center rounded-full text-[#2F4B4F]/65 transition hover:bg-fill hover:text-[#2F4B4F]"
                          onClick={(event) => {
                            event.stopPropagation();
                            openCommunicationMenu(
                              communication.id,
                              event.currentTarget,
                            );
                          }}
                          title="More actions"
                          type="button"
                        >
                          <MoreVertical className="size-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {openMenuCommunication ? (
        <AppPopup
          anchorElement={menuAnchorElement}
          className="w-48 rounded-md border border-border bg-white py-2 text-callout text-[#2F4B4F] shadow-lg"
          onClose={() => setOpenMenuId(null)}
          open={Boolean(openMenuId)}
          placement="bottom-end"
        >
          <MenuButton
            icon={<Pencil className="size-4" />}
            label="Edit"
            onClick={() => {
              setOpenMenuId(null);
              onEdit(openMenuCommunication);
            }}
          />
          <MenuButton
            icon={<UsersRound className="size-4" />}
            label="View recipients"
            onClick={() => {
              setOpenMenuId(null);
              onViewRecipients(openMenuCommunication);
            }}
          />
          <MenuButton
            icon={
              openMenuCommunication.status === "active" ? (
                <CirclePause className="size-4" />
              ) : (
                <CirclePlay className="size-4" />
              )
            }
            label={
              openMenuCommunication.status === "active" ? "Pause" : "Enable"
            }
            onClick={() => {
              setOpenMenuId(null);
              onStatusChange(openMenuCommunication);
            }}
          />
          <MenuButton
            danger
            icon={<Trash2 className="size-4" />}
            label="Delete"
            onClick={() => {
              setOpenMenuId(null);
              onDelete(openMenuCommunication);
            }}
          />
        </AppPopup>
      ) : null}
    </section>
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
