import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@piya/ui";
import type { ContactData } from "@piya/shared/models";
import { useGetContactsQuery, useGetContactTagsQuery } from "@piya/shared";
import type { ContactStatusType } from "@piya/shared/types";
import {
  AddContactSheet,
  ContactsTable,
  ContactViewSheet,
  type ContactFilters,
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
              View, import, and manage people connected to your loyalty program.
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
        onClose={() => setSelectedContact(null)}
        open={Boolean(selectedContact)}
      />
    </>
  );
}
