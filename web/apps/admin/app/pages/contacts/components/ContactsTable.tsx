import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  MoreVertical,
  NotebookPen,
  PackagePlus,
  Phone,
  Search,
  Send,
  Trash2,
} from "lucide-react";
import { AppAvatar, AppCheckbox, Badge, cn } from "@piya/ui";
import type { ContactData, ContactTagData } from "@piya/shared/models";
import type { ContactStatusType } from "@piya/shared/types";
import {
  ContactFiltersPopover,
  type ContactFilters,
} from "./ContactFiltersPopover";

function statusClassName(status: ContactData["status"]) {
  if (status === "active") {
    return "border-success/20 bg-success/10 text-success";
  }

  if (status === "lead") {
    return "border-secondary-dark/20 bg-secondary/40 text-primary";
  }

  if (status === "blocked") {
    return "border-error/20 bg-error/10 text-error";
  }

  return "border-border bg-fill text-text-tertiary";
}

function statusLabel(status: ContactData["status"]) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

const contactActions = [
  { icon: PackagePlus, label: "Create order" },
  { icon: Send, label: "Send request" },
  { icon: NotebookPen, label: "Add note" },
  { icon: Trash2, label: "Delete" },
];

type ContactsTableProps = {
  contacts: ContactData[];
  contactTags: ContactTagData[];
  hasNextPage: boolean;
  isError: boolean;
  isLoading: boolean;
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
  const [openMenuContactId, setOpenMenuContactId] = React.useState<
    string | null
  >(null);
  const [selectedContactIds, setSelectedContactIds] = React.useState<
    Set<string>
  >(new Set());
  const areAllPageContactsSelected =
    contacts.length > 0 &&
    contacts.every((contact) => selectedContactIds.has(contact.id));

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

  return (
    <section className="rounded-md bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-border p-5">
        <div className="relative w-full max-w-lg">
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

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-fill/70 text-caption-1 uppercase text-[#2F4B4F]/65">
              <th className="w-12 px-5 py-4">
                <AppCheckbox
                  checked={areAllPageContactsSelected}
                  disabled={contacts.length === 0}
                  label="Select all contacts on this page"
                  onCheckedChange={setPageContactsSelected}
                />
              </th>
              <th className="px-5 py-4 font-semibold">Name</th>
              <th className="px-5 py-4 font-semibold">Contact</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold">Last interaction</th>
              <th className="px-5 py-4 font-semibold">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {!isLoading && !isError && contacts.length === 0 ? (
              <tr>
                <td
                  className="px-5 py-12 text-center text-callout text-[#2F4B4F]/60"
                  colSpan={6}
                >
                  No contacts match these filters.
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
            {contacts.map((contact) => (
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
                <td className="w-12 px-5 py-4">
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
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <AppAvatar
                      className="size-10"
                      imageUrl={contact.profileImageUrl}
                      name={contact.name}
                    />
                    <div>
                      <p className="font-semibold text-[#2F4B4F]">
                        {contact.name}
                      </p>
                      <Badge className="mt-1 h-5 bg-fill px-2 text-[10px] capitalize text-[#2F4B4F]/70">
                        {contact.badge.badgeId}
                      </Badge>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-callout text-[#2F4B4F]/75">
                  <div className="grid gap-1">
                    <span className="inline-flex items-center gap-2">
                      <Mail className="size-4" /> {contact.email}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Phone className="size-4" /> {contact.phoneNumber}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      "inline-flex rounded-full border px-2.5 py-1 text-caption-1 font-semibold",
                      statusClassName(contact.status)
                    )}
                  >
                    {statusLabel(contact.status)}
                  </span>
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
                        setOpenMenuContactId((currentId) =>
                          currentId === contact.id ? null : contact.id
                        );
                      }}
                      type="button"
                    >
                      <MoreVertical className="size-5" />
                    </button>

                    {openMenuContactId === contact.id ? (
                      <div
                        className="absolute right-0 top-10 z-20 w-44 rounded-md border border-border bg-white py-2 text-callout text-[#2F4B4F] shadow-lg"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {contactActions.map((action) => {
                          const Icon = action.icon;

                          return (
                            <button
                              className={cn(
                                "flex w-full items-center gap-3 border-b border-border px-5 py-3 text-left transition last:border-b-0 hover:bg-fill",
                                action.label === "Delete" && "text-error"
                              )}
                              key={action.label}
                              onClick={() => setOpenMenuContactId(null)}
                              type="button"
                            >
                              <Icon className="size-4" />
                              {action.label}
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
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
            ? "Loading contacts…"
            : `Page ${page} · ${contacts.length} contacts${
                selectedContactIds.size > 0
                  ? ` · ${selectedContactIds.size} selected`
                  : ""
              }`}
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
    </section>
  );
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(timestamp);
}
