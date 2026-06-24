import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@yinapp/ui";
import type { ContactData } from "@yinapp/shared/types";
import { getContacts } from "@/services/contacts.service";
import { AddContactSheet, ContactsTable, ContactViewSheet } from "./components";
import type { AddContactMode } from "./types";

const contacts = getContacts();

export function ContactsPage() {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [contactMode, setContactMode] = React.useState<AddContactMode>("manual");
  const [selectedContact, setSelectedContact] = React.useState<ContactData | null>(null);

  function handleContactSelect(contact: ContactData) {
    setSelectedContact(contact);
  }

  return (
    <>
      <div className="grid gap-6">
        <header className="flex flex-col gap-4 rounded-md bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="mt-2 text-title-1 font-semibold text-[#2F4B4F]">
              Contacts
            </h1>
            <p className="mt-2 max-w-2xl text-callout text-[#2F4B4F]/75">
              View, import, and manage people connected to your loyalty program.
            </p>
          </div>
          <Button icon={<Plus />} onClick={() => setIsSheetOpen(true)}>
            Add contact
          </Button>
        </header>

        <ContactsTable contacts={contacts} onContactSelect={handleContactSelect} />
      </div>

      <AddContactSheet
        mode={contactMode}
        onClose={() => setIsSheetOpen(false)}
        onModeChange={setContactMode}
        open={isSheetOpen}
      />
      <ContactViewSheet
        contact={selectedContact}
        onClose={() => setSelectedContact(null)}
        open={Boolean(selectedContact)}
      />
    </>
  );
}
