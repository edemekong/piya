import * as React from "react";
import {
  CalendarDays,
  Mail,
  MoreVertical,
  NotebookPen,
  PackagePlus,
  Phone,
  Search,
  Send,
  Trash2,
} from "lucide-react";
import { AppAvatar, cn } from "@piya/ui";
import type { ContactData } from "@piya/shared/types";

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
  onContactSelect: (contact: ContactData) => void;
};

export function ContactsTable({ contacts, onContactSelect }: ContactsTableProps) {
  const [openMenuContactId, setOpenMenuContactId] = React.useState<string | null>(
    null,
  );

  return (
    <section className="rounded-md bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border p-5 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#2F4B4F]/50" />
          <input
            className="h-11 w-full rounded-sm border border-border bg-fill pl-10 pr-3 text-callout text-[#2F4B4F] outline-none transition focus:border-primary focus:bg-white"
            placeholder="Search contacts"
            type="search"
          />
        </div>
        <div className="flex items-center gap-2 text-footnote text-[#2F4B4F]/65">
          <CalendarDays className="size-4" />
          Showing {contacts.length} contacts
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-fill/70 text-caption-1 uppercase text-[#2F4B4F]/65">
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
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <AppAvatar
                      className="size-10"
                      imageUrl={contact.profileImageUrl}
                      name={contact.name}
                    />
                    <div>
                      <p className="font-semibold text-[#2F4B4F]">{contact.name}</p>
                      <p className="text-footnote text-[#2F4B4F]/60">{contact.id}</p>
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
                      statusClassName(contact.status),
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
                          currentId === contact.id ? null : contact.id,
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
                                action.label === "Delete" && "text-error",
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
