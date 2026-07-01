import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Icon,
  Loader2,
  Mail,
  MoreVertical,
  NotebookPen,
  PackagePlus,
  Phone,
  Search,
  Send,
  Trash2,
  UsersRound,
} from "lucide-react";
import { AppAvatar, AppCheckbox, AppPopup, Badge, Button, EmptyState, cn } from "@piya/ui";
import {
  showToast,
  useGetBadgesQuery,
  type AppDispatch,
} from "@piya/shared";
import type { BadgeData, ContactData, ContactTagData } from "@piya/shared/models";
import type { ContactStatusType } from "@piya/shared/types";
import { useDispatch } from "react-redux";
import { BadgeManagerSheet } from "./BadgeManagerSheet";
import {
  ContactFiltersPopover,
  type ContactFilters,
} from "./ContactFiltersPopover";

function statusClassName(status: ContactData["status"]) {
  if (status === "active") {
    return "border-success/20 bg-success/10 text-success";
  }

  if (status === "lead") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (status === "blocked") {
    return "border-error/20 bg-error/10 text-error";
  }

  return "border-border bg-fill text-[#2F4B4F]/65";
}

function statusLabel(status: ContactData["status"]) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

const contactActions = [
  { icon: PackagePlus, id: "create-order", label: "Create order" },
  { icon: Send, id: "send-request", label: "Send request" },
  { icon: NotebookPen, id: "add-note", label: "Add note" },
  { icon: Trash2, id: "delete", label: "Delete" },
];

type ContactsTableProps = {
  contacts: ContactData[];
  contactTags: ContactTagData[];
  hasNextPage: boolean;
  isError: boolean;
  isLoading: boolean;
  onAddNote: (contact: ContactData) => void;
  onContactSelect: (contact: ContactData) => void;
  onFiltersApply: (filters: ContactFilters) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onSearchChange: (value: string) => void;
  page: number;
  searchValue: string;
  status: ContactStatusType | "";
  tagId: string;
};

export function ContactsTable({
  contacts,
  contactTags,
  hasNextPage,
  isError,
  isLoading,
  onAddNote,
  onContactSelect,
  onFiltersApply,
  onNextPage,
  onPreviousPage,
  onSearchChange,
  page,
  searchValue,
  status,
  tagId,
}: ContactsTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { data: badgePayload } = useGetBadgesQuery();
  const [openMenuContactId, setOpenMenuContactId] = React.useState<
    string | null
  >(null);
  const [contactMenuAnchorElement, setContactMenuAnchorElement] =
    React.useState<HTMLButtonElement | null>(null);
  const [hoveredBadge, setHoveredBadge] = React.useState<{
    anchorElement: HTMLElement;
    name: string;
    points: number;
  } | null>(null);
  const [selectedContactIds, setSelectedContactIds] = React.useState<
    Set<string>
  >(new Set());
  const [isBadgeSheetOpen, setIsBadgeSheetOpen] = React.useState(false);
  const areAllPageContactsSelected =
    contacts.length > 0 &&
    contacts.every((contact) => selectedContactIds.has(contact.id));
  const selectedContactCount = selectedContactIds.size;
  const openMenuContact = contacts.find(
    (contact) => contact.id === openMenuContactId
  );
  const badgesById = React.useMemo(() => {
    return new Map((badgePayload?.badges ?? []).map((badge) => [badge.id, badge]));
  }, [badgePayload]);

  function setContactSelected(contactId: string, selected: boolean) {
    setSelectedContactIds((current) => {
      const next = new Set(current);
      if (selected) next.add(contactId);
      else next.delete(contactId);
      return next;
    });
  }

  function setPageContactsSelected(selected: boolean) {
    setSelectedContactIds((current) => {
      const next = new Set(current);
      contacts.forEach((contact) => {
        if (selected) next.add(contact.id);
        else next.delete(contact.id);
      });
      return next;
    });
  }

  function openContactMenu(
    contactId: string,
    button: HTMLButtonElement,
  ) {
    const nextOpen = openMenuContactId !== contactId;

    setContactMenuAnchorElement(button);
    setOpenMenuContactId(nextOpen ? contactId : null);
  }

  return (
    <section className="rounded-md bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 border-b border-border p-5">
        <div className="flex w-full max-w-xl items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#2F4B4F]/50" />
            <input
              className="h-11 w-full rounded-sm border border-border bg-fill pl-10 pr-3 text-callout text-[#2F4B4F] outline-none transition focus:border-primary focus:bg-white"
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search contacts"
              type="search"
              value={searchValue}
            />
          </div>
          <ContactFiltersPopover
            contactTags={contactTags}
            onApply={onFiltersApply}
            value={{ status, tagId }}
          />
        </div>
        <button
          className="ml-auto text-callout font-semibold text-[#2F4B4F]/55 underline underline-offset-4 transition hover:text-[#2F4B4F]"
          onClick={() => setIsBadgeSheetOpen(true)}
          type="button"
        >
          Points & Badges
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border text-caption-1 text-[#2F4B4F]/60">
              <th className="w-10 py-4 pl-4 pr-2">
                <AppCheckbox
                  checked={areAllPageContactsSelected}
                  disabled={contacts.length === 0}
                  label="Select all contacts on this page"
                  onCheckedChange={setPageContactsSelected}
                />
              </th>
              <th className="py-4 pl-2 pr-5 font-semibold">Name</th>
              <th className="px-5 py-4 font-semibold">Contact</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold">Last interaction</th>
              <th className="px-5 py-4 font-semibold">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6}>
                  <div className="flex h-[200px] items-center justify-center">
                    <Loader2
                      aria-label="Loading contacts"
                      className="size-6 animate-spin text-primary"
                    />
                  </div>
                </td>
              </tr>
            ) : null}
            {!isLoading && !isError && contacts.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState
                    className="flex h-[200px] flex-col items-center justify-center rounded-none border-0 bg-transparent p-0 text-center"
                    icon={<UsersRound className="size-5" />}
                    title={
                      <span className="font-normal text-[#2F4B4F]/55">
                        Contacts you add will appear here.
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
                  Unable to load contacts.
                </td>
              </tr>
            ) : null}
            {!isLoading && contacts.map((contact) => (
              <tr
                className="cursor-pointer border-b border-border transition hover:bg-fill/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary last:border-0"
                key={contact.id}
                onClick={() => onContactSelect(contact)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onContactSelect(contact);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <td className="w-10 py-4 pl-4 pr-2">
                  <div
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
                  >
                    <AppCheckbox
                      checked={selectedContactIds.has(contact.id)}
                      label={`Select ${contact.name}`}
                      onCheckedChange={(selected) =>
                        setContactSelected(contact.id, selected)
                      }
                    />
                  </div>
                </td>
                <td className="py-4 pl-2 pr-5">
                  <div className="flex items-center gap-3">
                    <AppAvatar
                      className="size-10"
                      imageUrl={contact.profileImageUrl}
                      name={contact.name}
                    />
                    <div className="min-w-0">
                      <p className="flex min-w-0 items-center gap-1.5 font-semibold text-[#2F4B4F]">
                        <span className="truncate">{contact.name}</span>
                        <ContactBadgeIcon
                          badge={badgesById.get(contact.badge.badgeId)}
                          badgeId={contact.badge.badgeId}
                          onTooltipClose={() => setHoveredBadge(null)}
                          onTooltipOpen={setHoveredBadge}
                          points={contact.badge.points}
                        />
                      </p>
                      {contact.address ? (
                        <p className="mt-1 max-w-48 truncate text-footnote text-[#2F4B4F]/55">
                          {formatContactAddress(contact.address)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-callout text-[#2F4B4F]/75">
                  <div className="grid gap-0.5">
                    <ContactValueLine
                      icon={Mail}
                      label={`${contact.name} email`}
                      onCopy={() =>
                        showToast(dispatch, {
                          message: "Email copied.",
                          variant: "success",
                        })
                      }
                      value={contact.email}
                    />
                    <ContactValueLine
                      icon={Phone}
                      label={`${contact.name} phone number`}
                      onCopy={() =>
                        showToast(dispatch, {
                          message: "Phone number copied.",
                          variant: "success",
                        })
                      }
                      value={contact.phoneNumber}
                    />
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Badge
                    className={cn(
                      "h-auto rounded-full px-3 py-1.5 text-caption-1 font-semibold",
                      statusClassName(contact.status)
                    )}
                  >
                    {statusLabel(contact.status)}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-callout text-[#2F4B4F]/65">
                  {formatDate(contact.lastInteractionAt)}
                </td>
                <td className="px-5 py-4">
                  <div className="relative flex justify-end">
                    <button
                      aria-expanded={openMenuContactId === contact.id}
                      aria-label={`Open actions for ${contact.name}`}
                      className="flex size-9 items-center justify-center rounded-full text-[#2F4B4F]/65 transition hover:bg-fill hover:text-[#2F4B4F]"
                      onClick={(event) => {
                        event.stopPropagation();
                        openContactMenu(contact.id, event.currentTarget);
                      }}
                      type="button"
                    >
                      <MoreVertical className="size-5" />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="flex items-center justify-between gap-4 border-t border-border px-5 py-4">
        <span className="text-footnote text-[#2F4B4F]/65">
          {isLoading
            ? "Loading"
            : `Page ${page} · ${contacts.length} contacts`}
        </span>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex h-9 items-center gap-1 rounded-sm border border-border px-3 text-footnote font-semibold text-[#2F4B4F] transition hover:bg-fill disabled:cursor-not-allowed disabled:opacity-45"
            disabled={page === 1 || isLoading}
            onClick={onPreviousPage}
            type="button"
          >
            <ChevronLeft className="size-4" />
            Previous
          </button>
          <button
            className="inline-flex h-9 items-center gap-1 rounded-sm border border-border px-3 text-footnote font-semibold text-[#2F4B4F] transition hover:bg-fill disabled:cursor-not-allowed disabled:opacity-45"
            disabled={!hasNextPage || isLoading}
            onClick={onNextPage}
            type="button"
          >
            Next
            <ChevronRight className="size-4" />
          </button>
        </div>
      </footer>
      {selectedContactCount > 0 ? (
        <div
          aria-live="polite"
          className="fixed bottom-0 left-24 right-0 z-40 border-t border-primary/20 bg-secondary px-8 py-4 shadow-[0_-12px_30px_rgba(16,42,45,0.12)] lg:px-14"
        >
          <div className="mx-auto flex w-full max-w-web flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-callout font-semibold text-primary">
              {selectedContactCount} selected contact
              {selectedContactCount === 1 ? "" : "s"}
            </span>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              <Button
                className="bg-white"
                icon={<PackagePlus />}
                size="sm"
                type="button"
                variant="outline"
              >
                Create order
              </Button>
              <Button
                className="bg-primary text-white hover:bg-primary/90"
                icon={<Send />}
                size="sm"
                type="button"
              >
                Send request
              </Button>
            </div>
          </div>
        </div>
      ) : null}
      <BadgeManagerSheet
        onClose={() => setIsBadgeSheetOpen(false)}
        open={isBadgeSheetOpen}
      />
      {hoveredBadge ? (
        <AppPopup
          anchorElement={hoveredBadge.anchorElement}
          className="w-max max-w-48 rounded-md bg-[#102A2D] px-3 py-2 text-center text-[11px] font-semibold leading-snug text-white shadow-lg"
          onClose={() => setHoveredBadge(null)}
          open={Boolean(hoveredBadge)}
          placement="bottom-start"
        >
          {hoveredBadge.name}
          <span className="mt-0.5 block font-normal text-white/75">
            {hoveredBadge.points.toLocaleString()} pts earned
          </span>
        </AppPopup>
      ) : null}
      {openMenuContactId ? (
        <AppPopup
          anchorElement={contactMenuAnchorElement}
          className="w-44 rounded-md border border-border bg-white py-2 text-callout text-[#2F4B4F] shadow-lg"
          onClose={() => setOpenMenuContactId(null)}
          open={Boolean(openMenuContactId)}
          placement="bottom-end"
        >
          {contactActions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                className={cn(
                  "flex w-full items-center gap-3 border-b border-border px-5 py-3 text-left transition last:border-b-0 hover:bg-fill",
                  action.label === "Delete" && "text-error",
                )}
                key={action.label}
                onClick={(event) => {
                  event.stopPropagation();
                  setOpenMenuContactId(null);
                  if (action.id === "add-note" && openMenuContact) {
                    onAddNote(openMenuContact);
                  }
                }}
                type="button"
              >
                <Icon className="size-4" />
                {action.label}
              </button>
            );
          })}
        </AppPopup>
      ) : null}
    </section>
  );
}

function ContactBadgeIcon({
  badge,
  badgeId,
  onTooltipClose,
  onTooltipOpen,
  points,
}: {
  badge?: BadgeData;
  badgeId: string;
  onTooltipClose: () => void;
  onTooltipOpen: (tooltip: {
    anchorElement: HTMLElement;
    name: string;
    points: number;
  }) => void;
  points: number;
}) {
  const name = badge?.name ?? formatBadgeId(badgeId);

  function showTooltip(element: HTMLElement) {
    onTooltipOpen({
      anchorElement: element,
      name,
      points,
    });
  }

  return (
    <span
      className="inline-flex shrink-0"
      onBlur={onTooltipClose}
      onFocus={(event) => showTooltip(event.currentTarget)}
      onMouseEnter={(event) => showTooltip(event.currentTarget)}
      onMouseLeave={onTooltipClose}
      tabIndex={0}
    >
      <img
        alt={name}
        className="size-5 object-contain"
        src={getBadgeIconSrc(badge?.icon)}
      />
    </span>
  );
}

function ContactValueLine({
  icon: Icon,
  label,
  onCopy,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onCopy: () => void;
  value?: string | null;
}) {
  if (!value) {
    return <span className="text-[#2F4B4F]/45">Not set</span>;
  }

  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <Icon className="size-4 shrink-0" />
      <span className="min-w-0 truncate">{value}</span>
      <button
        aria-label={`Copy ${label}`}
        className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-[#2F4B4F]/45 transition hover:bg-fill hover:text-[#2F4B4F]"
        onClick={(event) => {
          event.stopPropagation();
          void copyToClipboard(value, onCopy);
        }}
        type="button"
      >
        <Copy className="size-3.5" />
      </button>
    </span>
  );
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(timestamp);
}

function getBadgeIconSrc(icon?: string | null) {
  return `/assets/badges/${icon || "sage-round-seal"}.png`;
}

function formatBadgeId(badgeId: string) {
  return badgeId
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatContactAddress(address: NonNullable<ContactData["address"]>) {
  return [
    address.displayName,
    address.streetAddress,
    address.city,
    address.state,
    address.country,
  ]
    .filter(Boolean)
    .filter((part, index, parts) => parts.indexOf(part) === index)
    .join(", ");
}

async function copyToClipboard(value: string, onCopy: () => void) {
  if (!navigator.clipboard) return;
  try {
    await navigator.clipboard.writeText(value);
    onCopy();
  } catch {
    // Copy can be blocked by browser permissions or insecure contexts.
  }
}
