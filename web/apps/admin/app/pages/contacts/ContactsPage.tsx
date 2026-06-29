import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@piya/ui";
import type { ContactData } from "@piya/shared/models";
import { useGetContactsQuery, useGetContactTagsQuery } from "@piya/shared";
import type { ContactStatusType } from "@piya/shared/types";
import {
  AddContactSheet,
  ContactsTable,
  ContactNotesPanel,
  ContactViewSheet,
  type ContactNoteData,
  type ContactOverviewTab,
  type ContactFilters,
  type ContactViewParentTab,
} from "./components";
import type { AddContactMode } from "./types";

const CONTACT_PAGE_SIZE = 20;

export function ContactsPage() {
  const [searchInput, setSearchInput] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<ContactStatusType | "">("");
  const [tagId, setTagId] = React.useState("");
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageCursors, setPageCursors] = React.useState<(string | undefined)[]>([
    undefined,
  ]);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [contactMode, setContactMode] =
    React.useState<AddContactMode>("manual");
  const [selectedContact, setSelectedContact] =
    React.useState<ContactData | null>(null);
  const [selectedContactTab, setSelectedContactTab] =
    React.useState<ContactViewParentTab>("overview");
  const [selectedOverviewTab, setSelectedOverviewTab] =
    React.useState<ContactOverviewTab>("events");
  const [quickNoteContact, setQuickNoteContact] =
    React.useState<ContactData | null>(null);
  const [quickNoteRequestKey, setQuickNoteRequestKey] = React.useState(0);
  const [contactNotes, setContactNotes] = React.useState<ContactNoteData[]>([]);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      setQuery(searchInput.trim());
      setPageIndex(0);
      setPageCursors([undefined]);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  const contactQuery = {
    limit: CONTACT_PAGE_SIZE,
    ...(pageCursors[pageIndex] ? { cursor: pageCursors[pageIndex] } : {}),
    ...(query ? { query } : {}),
    ...(status ? { status } : {}),
    ...(tagId ? { tagId } : {}),
  };
  const {
    data: contactPage,
    isError,
    isFetching,
  } = useGetContactsQuery(contactQuery);
  const { data: contactTags = [] } = useGetContactTagsQuery();
  const contacts = contactPage?.contacts ?? [];

  function handleContactSelect(contact: ContactData) {
    setSelectedContactTab("overview");
    setSelectedOverviewTab("events");
    setSelectedContact(contact);
  }

  function handleAddNote(contact: ContactData) {
    setQuickNoteContact(contact);
    setQuickNoteRequestKey((current) => current + 1);
  }

  function createContactNote(
    contact: ContactData,
    note: Omit<ContactNoteData, "contactId" | "createdAt" | "id" | "type">
  ) {
    const timestamp = Date.now();

    setContactNotes((current) => [
      {
        ...note,
        contactId: contact.id,
        createdAt: timestamp,
        id: createLocalNoteId(),
        type: "note",
      },
      ...current,
    ]);
  }

  function updateContactNote(
    _contact: ContactData,
    noteId: string,
    note: Omit<ContactNoteData, "contactId" | "createdAt" | "id" | "type">
  ) {
    setContactNotes((current) =>
      current.map((currentNote) =>
        currentNote.id === noteId ? { ...currentNote, ...note } : currentNote
      )
    );
  }

  function createQuickContactNote(
    contact: ContactData,
    note: Omit<ContactNoteData, "contactId" | "createdAt" | "id" | "type">
  ) {
    createContactNote(contact, note);
    setQuickNoteContact(null);
    setSelectedContactTab("overview");
    setSelectedOverviewTab("notes");
    setSelectedContact(contact);
  }

  function resetPagination() {
    setPageIndex(0);
    setPageCursors([undefined]);
  }

  function goToNextPage() {
    if (!contactPage?.nextCursor) return;

    setPageCursors((current) => {
      const next = current.slice(0, pageIndex + 1);
      next[pageIndex + 1] = contactPage.nextCursor ?? undefined;
      return next;
    });
    setPageIndex((current) => current + 1);
  }

  function applyFilters(filters: ContactFilters) {
    setStatus(filters.status);
    setTagId(filters.tagId);
    resetPagination();
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
              View, import, and manage people connected to your business.
            </p>
          </div>
          <Button icon={<Plus />} onClick={() => setIsSheetOpen(true)}>
            Add contact
          </Button>
        </header>

        <ContactsTable
          contacts={contacts}
          contactTags={contactTags}
          hasNextPage={contactPage?.hasNextPage ?? false}
          isError={isError}
          isLoading={isFetching}
          onAddNote={handleAddNote}
          onFiltersApply={applyFilters}
          onContactSelect={handleContactSelect}
          onNextPage={goToNextPage}
          onPreviousPage={() =>
            setPageIndex((current) => Math.max(0, current - 1))
          }
          onSearchChange={setSearchInput}
          page={pageIndex + 1}
          searchValue={searchInput}
          status={status}
          tagId={tagId}
        />
      </div>

      <AddContactSheet
        mode={contactMode}
        onClose={() => setIsSheetOpen(false)}
        onModeChange={setContactMode}
        open={isSheetOpen}
      />
      <ContactViewSheet
        contact={selectedContact}
        initialOverviewTab={selectedOverviewTab}
        initialTab={selectedContactTab}
        notes={contactNotes.filter(
          (note) => note.contactId === selectedContact?.id
        )}
        onClose={() => setSelectedContact(null)}
        onContactUpdated={setSelectedContact}
        onCreateNote={createContactNote}
        onUpdateNote={updateContactNote}
        open={Boolean(selectedContact)}
      />
      {quickNoteContact ? (
        <ContactNotesPanel
          addNoteRequestKey={quickNoteRequestKey}
          contact={quickNoteContact}
          notes={contactNotes.filter(
            (note) => note.contactId === quickNoteContact.id
          )}
          onCreateNote={(note) => createQuickContactNote(quickNoteContact, note)}
          onEditorClose={() => setQuickNoteContact(null)}
          onUpdateNote={() => undefined}
          renderPanel={false}
        />
      ) : null}
    </>
  );
}

function createLocalNoteId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `note_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}
