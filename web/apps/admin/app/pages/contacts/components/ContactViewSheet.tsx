import * as React from "react";
import {
  MessageCircle,
  SlidersHorizontal,
  UserRound,
  X,
} from "lucide-react";
import { SegmentedTabs } from "@piya/ui";
import type { ContactData } from "@piya/shared/models";
import { ContactConversationsPanel } from "./ContactConversationsPanel";
import type { ContactNoteData } from "./ContactNotesPanel";
import {
  ContactOverviewPanel,
  type ContactOverviewTab,
} from "./ContactOverviewPanel";
import { ContactPreferencePanel } from "./ContactPreferencePanel";

export type ContactViewParentTab =
  | "overview"
  | "preference"
  | "conversations";

type ContactViewSheetProps = {
  addNoteRequestKey?: number;
  contact: ContactData | null;
  initialOverviewTab?: ContactOverviewTab;
  initialTab?: ContactViewParentTab;
  notes: ContactNoteData[];
  onClose: () => void;
  onCreateNote: (
    contact: ContactData,
    note: Omit<ContactNoteData, "contactId" | "createdAt" | "id" | "type">
  ) => void;
  onContactUpdated?: (contact: ContactData) => void;
  onUpdateNote: (
    contact: ContactData,
    noteId: string,
    note: Omit<ContactNoteData, "contactId" | "createdAt" | "id" | "type">
  ) => void;
  open: boolean;
};

const parentTabs = [
  {
    icon: <UserRound className="size-4" />,
    label: "Overview",
    value: "overview",
  },
  {
    icon: <SlidersHorizontal className="size-4" />,
    label: "Preference",
    value: "preference",
  },
  {
    icon: <MessageCircle className="size-4" />,
    label: "Conversations",
    value: "conversations",
  },
] satisfies {
  icon: React.ReactNode;
  label: string;
  value: ContactViewParentTab;
}[];

export function ContactViewSheet({
  addNoteRequestKey = 0,
  contact,
  initialOverviewTab = "events",
  initialTab = "overview",
  notes,
  onClose,
  onCreateNote,
  onContactUpdated,
  onUpdateNote,
  open,
}: ContactViewSheetProps) {
  const [activeParentTab, setActiveParentTab] =
    React.useState<ContactViewParentTab>("overview");
  const [activeOverviewTab, setActiveOverviewTab] =
    React.useState<ContactOverviewTab>("events");

  React.useEffect(() => {
    if (open) {
      setActiveParentTab(initialTab);
      setActiveOverviewTab(initialOverviewTab);
    }
  }, [contact?.id, initialOverviewTab, initialTab, open]);

  if (!open || !contact) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#102A2D]/45">
      <button
        aria-label="Close contact view sheet"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />
      <aside className="relative flex h-full w-full max-w-3xl flex-col bg-white text-[#2F4B4F] shadow-xl">
        <div className="flex items-center gap-3 px-5 py-4 sm:px-6">
          <SegmentedTabs
            className="flex-1"
            items={parentTabs}
            onValueChange={setActiveParentTab}
            value={activeParentTab}
          />
          <button
            aria-label="Close"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-fill text-[#2F4B4F] hover:bg-secondary"
            onClick={onClose}
            type="button"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 pt-0 sm:p-6 sm:pt-0">
          {activeParentTab === "overview" ? (
            <ContactOverviewPanel
              addNoteRequestKey={addNoteRequestKey}
              activeTab={activeOverviewTab}
              contact={contact}
              notes={notes}
              onContactUpdated={onContactUpdated}
              onCreateNote={(note) => onCreateNote(contact, note)}
              onUpdateNote={(noteId, note) =>
                onUpdateNote(contact, noteId, note)
              }
              onTabChange={setActiveOverviewTab}
            />
          ) : null}
          {activeParentTab === "preference" ? (
            <ContactPreferencePanel
              contact={contact}
              onContactUpdated={onContactUpdated}
            />
          ) : null}
          {activeParentTab === "conversations" ? (
            <ContactConversationsPanel />
          ) : null}
        </div>
      </aside>
    </div>
  );
}
