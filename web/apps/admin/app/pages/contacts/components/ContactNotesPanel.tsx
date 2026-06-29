import * as React from "react";
import {
  Bold,
  Check,
  FileText,
  Italic,
  Link,
  List,
  ListOrdered,
  NotebookPen,
  Quote,
  Search,
  Strikethrough,
  Underline,
  X,
} from "lucide-react";
import { AppAvatar, AppPopup, AppSheet, Button, cn } from "@piya/ui";
import { useGetContactsQuery } from "@piya/shared";
import type { ContactData } from "@piya/shared/models";

export type ContactNoteAssignee = {
  assignedAt: number;
  email: string;
  id: string;
  name: string;
  profileImageUrl?: string | null;
};

export type ContactNoteData = {
  assignees: ContactNoteAssignee[];
  body?: string;
  bodyHtml?: string;
  contact?: ContactNoteContact | null;
  contactId: string;
  createdAt: number;
  dueDate?: number;
  id: string;
  title: string;
  type: "note";
};

type ContactNoteContact = {
  email?: string | null;
  id: string;
  name: string;
  phoneNumber?: string | null;
  profileImageUrl?: string | null;
};

type ContactNotesPanelProps = {
  addNoteRequestKey?: number;
  contact: ContactData;
  notes: ContactNoteData[];
  onCreateNote: (note: ContactNoteDraft) => void;
  onEditorClose?: () => void;
  renderPanel?: boolean;
  onUpdateNote: (noteId: string, note: ContactNoteDraft) => void;
};

type ContactNoteDraft = {
  assignees: ContactNoteAssignee[];
  body?: string;
  bodyHtml?: string;
  contact?: ContactNoteContact | null;
  dueDate?: number;
  title: string;
};

type ToolbarAction = {
  command: string;
  icon: typeof Bold;
  label: string;
  value?: string;
};

type HeadingOption = {
  label: string;
  value: "p" | "h1" | "h2" | "h3";
};

const toolbarActions: ToolbarAction[] = [
  { command: "bold", icon: Bold, label: "Bold" },
  { command: "italic", icon: Italic, label: "Italic" },
  { command: "underline", icon: Underline, label: "Underline" },
  { command: "strikeThrough", icon: Strikethrough, label: "Strikethrough" },
  { command: "insertOrderedList", icon: ListOrdered, label: "Numbered list" },
  { command: "insertUnorderedList", icon: List, label: "Bullet list" },
  { command: "formatBlock", icon: Quote, label: "Quote", value: "blockquote" },
];

const headingOptions: HeadingOption[] = [
  { label: "Heading 1", value: "h1" },
  { label: "Heading 2", value: "h2" },
  { label: "Heading 3", value: "h3" },
  { label: "Normal", value: "p" },
];
const normalHeadingOption = headingOptions[headingOptions.length - 1];

export function ContactNotesPanel({
  addNoteRequestKey = 0,
  contact,
  notes,
  onCreateNote,
  onEditorClose,
  renderPanel = true,
  onUpdateNote,
}: ContactNotesPanelProps) {
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [editingNote, setEditingNote] = React.useState<ContactNoteData | null>(
    null
  );
  const previousRequestKeyRef = React.useRef(0);
  const sortedNotes = React.useMemo(() => {
    return [...notes].sort(
      (first, second) => second.createdAt - first.createdAt
    );
  }, [notes]);

  React.useEffect(() => {
    if (
      addNoteRequestKey > 0 &&
      addNoteRequestKey !== previousRequestKeyRef.current
    ) {
      setEditingNote(null);
      setIsEditorOpen(true);
    }
    previousRequestKeyRef.current = addNoteRequestKey;
  }, [addNoteRequestKey]);

  return (
    <div className="grid gap-4">
      {renderPanel ? (
        sortedNotes.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-5 py-10 text-center">
            <FileText className="size-10 text-[#2F4B4F]/35" />
            <p className="mt-3 text-callout font-semibold text-[#2F4B4F]">
              No notes yet
            </p>
            <Button
              className="mt-4"
              icon={<NotebookPen />}
              onClick={() => setIsEditorOpen(true)}
              size="sm"
              type="button"
            >
              Add notes
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-title-3 font-semibold text-[#2F4B4F]">
                Notes
              </h4>
              <Button
                icon={<NotebookPen />}
                onClick={() => setIsEditorOpen(true)}
                size="sm"
                type="button"
              >
                Add notes
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {sortedNotes.map((note) => (
                <button
                  className="flex min-h-44 flex-col rounded-md border border-border bg-white p-4 text-left transition hover:bg-fill/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  key={note.id}
                  onClick={() => {
                    setEditingNote(note);
                    setIsEditorOpen(true);
                  }}
                  type="button"
                >
                  <h5 className="line-clamp-2 text-callout font-semibold text-[#2F4B4F]">
                    {note.title}
                  </h5>
                  {note.body ? (
                    <p className="mt-2 line-clamp-3 text-footnote leading-relaxed text-[#2F4B4F]/60">
                      {note.body}
                    </p>
                  ) : null}
                  <div className="mt-auto flex justify-end pt-4">
                    <span className="shrink-0 text-caption-1 text-[#2F4B4F]/50">
                      {formatRelativeDate(note.createdAt)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )
      ) : null}

      <ContactNoteEditorSheet
        contact={contact}
        editingNote={editingNote}
        onClose={() => {
          setEditingNote(null);
          setIsEditorOpen(false);
          onEditorClose?.();
        }}
        onCreateNote={(note) => {
          onCreateNote(note);
          setEditingNote(null);
          setIsEditorOpen(false);
        }}
        onUpdateNote={(noteId, note) => {
          onUpdateNote(noteId, note);
          setEditingNote(null);
          setIsEditorOpen(false);
        }}
        open={isEditorOpen}
      />
    </div>
  );
}

function ContactNoteEditorSheet({
  contact,
  editingNote,
  onClose,
  onCreateNote,
  onUpdateNote,
  open,
}: {
  contact: ContactData;
  editingNote: ContactNoteData | null;
  onClose: () => void;
  onCreateNote: (note: ContactNoteDraft) => void;
  onUpdateNote: (noteId: string, note: ContactNoteDraft) => void;
  open: boolean;
}) {
  const editorRef = React.useRef<HTMLDivElement | null>(null);
  const linkButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const headingButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const [title, setTitle] = React.useState("");
  const [editorHtml, setEditorHtml] = React.useState("");
  const [linkedContact, setLinkedContact] =
    React.useState<ContactNoteContact | null>(() => getNoteContact(contact));
  const [isContactPickerOpen, setIsContactPickerOpen] = React.useState(false);
  const [isHeadingPickerOpen, setIsHeadingPickerOpen] = React.useState(false);
  const [selectedHeading, setSelectedHeading] = React.useState<HeadingOption>(
    normalHeadingOption
  );
  const [contactSearchInput, setContactSearchInput] = React.useState("");
  const [contactQuery, setContactQuery] = React.useState("");
  const [titleError, setTitleError] = React.useState("");

  React.useEffect(() => {
    if (!open) return;

    const nextHtml = editingNote?.bodyHtml ?? escapeHtml(editingNote?.body ?? "");

    setTitle(editingNote?.title ?? "");
    setEditorHtml(nextHtml);
    setTitleError("");
    setLinkedContact(editingNote?.contact ?? getNoteContact(contact));
    setIsHeadingPickerOpen(false);
    setSelectedHeading(normalHeadingOption);
    setContactSearchInput("");
    setContactQuery("");
    if (editorRef.current) editorRef.current.innerHTML = nextHtml;
  }, [contact, editingNote, open]);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      setContactQuery(contactSearchInput.trim());
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [contactSearchInput]);

  const { data: contactsPage, isFetching: contactsAreFetching } =
    useGetContactsQuery({
      limit: 10,
      ...(contactQuery ? { query: contactQuery } : {}),
    });
  const contactOptions = contactsPage?.contacts ?? [];

  function applyToolbarCommand(command: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    setEditorHtml(editorRef.current?.innerHTML ?? "");
  }

  function applyHeading(option: HeadingOption) {
    setSelectedHeading(option);
    setIsHeadingPickerOpen(false);
    applyToolbarCommand("formatBlock", option.value);
  }

  function createNote() {
    const trimmedTitle = title.trim();
    const bodyText = editorRef.current?.innerText.trim() ?? "";
    const bodyHtml = editorRef.current?.innerHTML.trim() ?? "";

    if (!trimmedTitle) {
      setTitleError("Add a title for this note.");
      return;
    }

    const nextNote = {
      assignees: [],
      body: bodyText || undefined,
      bodyHtml: bodyHtml || undefined,
      contact: linkedContact,
      title: trimmedTitle,
    };

    if (editingNote) {
      onUpdateNote(editingNote.id, nextNote);
      return;
    }

    onCreateNote(nextNote);
  }

  return (
    <AppSheet
      ariaLabel={`add note for ${contact.name}`}
      bodyClassName="flex flex-1 flex-col px-6 pb-6 pt-0"
      footer={
        <div className="-m-6 w-[calc(100%+3rem)]">
          <div className="flex h-16 items-center justify-between gap-1 border-b border-border px-6">
            <div className="flex items-center gap-1">
              {toolbarActions.slice(0, 4).map((action) => (
                <ToolbarButton
                  action={action}
                  key={`${action.command}-${action.label}`}
                  onApply={applyToolbarCommand}
                />
              ))}
            </div>
            <div className="h-8 border-l border-border" />
            <span className="group relative inline-flex">
              <button
                aria-expanded={isHeadingPickerOpen}
                aria-label="Text style"
                className="inline-flex h-9 items-center gap-2 rounded-sm px-2.5 text-callout text-[#2F4B4F] transition hover:bg-fill"
                onClick={() => setIsHeadingPickerOpen((current) => !current)}
                ref={headingButtonRef}
                title="Text style"
                type="button"
              >
                {selectedHeading.label}
                <span className="size-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-[#2F4B4F]" />
              </button>
              <ToolbarTooltip label="Text style" />
            </span>
            <HeadingPickerPopup
              anchorElement={headingButtonRef.current}
              onClose={() => setIsHeadingPickerOpen(false)}
              onSelect={applyHeading}
              open={isHeadingPickerOpen}
              value={selectedHeading.value}
            />
            <div className="h-8 border-l border-border" />
            <div className="flex items-center gap-1">
              {toolbarActions.slice(4, 6).map((action) => (
                <ToolbarButton
                  action={action}
                  key={`${action.command}-${action.label}`}
                  onApply={applyToolbarCommand}
                />
              ))}
            </div>
            <div className="h-8 border-l border-border" />
            <ToolbarButton
              action={toolbarActions[6]}
              onApply={applyToolbarCommand}
            />
          </div>
          <div className="flex items-center justify-between gap-4 px-6 py-4">
            <Button
              className="h-12 min-w-40 justify-center rounded-md bg-white"
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="h-12 min-w-44 justify-center rounded-md bg-secondary text-primary hover:bg-secondary-dark"
              type="button"
              onClick={createNote}
            >
              {editingNote ? "Save" : "Create"}
            </Button>
          </div>
        </div>
      }
      header={
        <div className="flex items-center justify-between gap-4 px-6 pb-1 pt-5">
          <div className="inline-flex items-center gap-2 text-callout font-semibold text-[#2F4B4F]">
            <NotebookPen className="size-4" />
            {editingNote ? "Edit note" : "Add note"}
          </div>
          <button
            aria-label="Close"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-fill text-[#2F4B4F] hover:bg-secondary"
            onClick={onClose}
            type="button"
          >
            <X className="size-5" />
          </button>
        </div>
      }
      maxWidthClassName="max-w-lg"
      onClose={onClose}
      open={open}
    >
      <input
        aria-label="Note title"
        className={cn(
          "w-full border-0 bg-transparent px-1 py-2 text-title-2 font-semibold text-[#2F4B4F] outline-none placeholder:text-[#2F4B4F]/35",
          titleError && "placeholder:text-error/70"
        )}
        onChange={(event) => {
          setTitle(event.target.value);
          if (titleError) setTitleError("");
        }}
        placeholder={titleError || "Untitled note"}
        value={title}
      />

      <div className="relative px-1 py-2">
        <button
          className={cn(
            "inline-flex h-9 max-w-full items-center gap-2 rounded-full border border-border bg-fill px-3 text-footnote font-semibold text-[#2F4B4F] transition hover:bg-secondary/35",
            linkedContact && "bg-white"
          )}
          onClick={() => setIsContactPickerOpen((current) => !current)}
          ref={linkButtonRef}
          type="button"
        >
          {linkedContact ? (
            <>
              <AppAvatar
                className="size-6"
                imageUrl={linkedContact.profileImageUrl}
                name={linkedContact.name}
              />
              <span className="truncate">{linkedContact.name}</span>
            </>
          ) : (
            <>
              <Link className="size-4" />
              Link contact
            </>
          )}
        </button>
        {linkedContact ? (
          <button
            aria-label={`Remove ${linkedContact.name}`}
            className="ml-2 inline-flex size-8 items-center justify-center rounded-full text-[#2F4B4F]/55 transition hover:bg-fill hover:text-[#2F4B4F]"
            onClick={() => setLinkedContact(null)}
            type="button"
          >
            <X className="size-4" />
          </button>
        ) : null}

        <ContactPickerPopup
          anchorElement={linkButtonRef.current}
          contacts={contactOptions}
          isFetching={contactsAreFetching}
          onClose={() => setIsContactPickerOpen(false)}
          onSearchChange={setContactSearchInput}
          onSelect={(selectedContact) => {
            setLinkedContact(getNoteContact(selectedContact));
            setIsContactPickerOpen(false);
          }}
          open={isContactPickerOpen}
          searchValue={contactSearchInput}
          selectedContactId={linkedContact?.id}
        />
      </div>

      <div className="-mx-6 mt-4 border-t border-border" />

      <div className="relative min-h-80 flex-1 px-1 py-5">
        {!editorHtml ? (
          <span className="pointer-events-none absolute left-1 top-5 text-callout text-[#2F4B4F]/35">
            Start typing...
          </span>
        ) : null}
        <div
          aria-label="Note body"
          className="prose prose-sm max-w-none text-callout leading-relaxed text-[#2F4B4F] outline-none [&_blockquote]:border-l-2 [&_blockquote]:border-primary/35 [&_blockquote]:pl-3 [&_blockquote]:text-[#2F4B4F]/70 [&_h1]:text-title-1 [&_h1]:font-semibold [&_h2]:text-title-2 [&_h2]:font-semibold [&_h3]:text-title-3 [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
          contentEditable
          onInput={() => setEditorHtml(editorRef.current?.innerHTML ?? "")}
          ref={editorRef}
          role="textbox"
          suppressContentEditableWarning
        />
      </div>

    </AppSheet>
  );
}

function ToolbarButton({
  action,
  onApply,
}: {
  action: ToolbarAction;
  onApply: (command: string, value?: string) => void;
}) {
  const Icon = action.icon;

  return (
    <span className="group relative inline-flex">
      <button
        aria-label={action.label}
        className="inline-flex size-9 items-center justify-center rounded-sm text-[#202829] transition hover:bg-fill"
        onMouseDown={(event) => {
          event.preventDefault();
          onApply(action.command, action.value);
        }}
        title={action.label}
        type="button"
      >
        <Icon className="size-4" strokeWidth={3} />
      </button>
      <ToolbarTooltip label={action.label} />
    </span>
  );
}

function ToolbarTooltip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-sm bg-[#102A2D] px-2 py-1 text-[11px] font-semibold text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-within:opacity-100">
      {label}
    </span>
  );
}

function HeadingPickerPopup({
  anchorElement,
  onClose,
  onSelect,
  open,
  value,
}: {
  anchorElement: HTMLElement | null;
  onClose: () => void;
  onSelect: (option: HeadingOption) => void;
  open: boolean;
  value: HeadingOption["value"];
}) {
  return (
    <AppPopup
      anchorElement={anchorElement}
      className="w-40 rounded-md border border-border bg-white py-2 text-callout text-[#2F4B4F] shadow-lg"
      onClose={onClose}
      open={open}
      placement="top-start"
    >
      {headingOptions.map((option) => {
        const selected = option.value === value;

        return (
          <button
            className={cn(
              "flex w-full items-center justify-between gap-3 px-4 py-2 text-left transition hover:bg-fill",
              selected && "bg-secondary/30 font-semibold text-primary"
            )}
            key={option.value}
            onClick={() => onSelect(option)}
            title={option.label}
            type="button"
          >
            {option.label}
            {selected ? <Check className="size-4" /> : null}
          </button>
        );
      })}
    </AppPopup>
  );
}

function ContactPickerPopup({
  anchorElement,
  contacts,
  isFetching,
  onClose,
  onSearchChange,
  onSelect,
  open,
  searchValue,
  selectedContactId,
}: {
  anchorElement: HTMLElement | null;
  contacts: ContactData[];
  isFetching: boolean;
  onClose: () => void;
  onSearchChange: (value: string) => void;
  onSelect: (contact: ContactData) => void;
  open: boolean;
  searchValue: string;
  selectedContactId?: string;
}) {
  return (
    <AppPopup
      anchorElement={anchorElement}
      className="w-80 rounded-md border border-border bg-white p-2 shadow-lg"
      onClose={onClose}
      open={open}
      placement="bottom-start"
    >
      <div className="relative mb-2">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#2F4B4F]/45" />
        <input
          className="h-10 w-full rounded-sm border border-border bg-fill pl-9 pr-3 text-footnote text-[#2F4B4F] outline-none transition placeholder:text-[#2F4B4F]/40 focus:border-primary focus:bg-white"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search contacts"
          type="search"
          value={searchValue}
        />
      </div>

      <div className="max-h-96 overflow-y-auto">
        {contacts.map((contact) => {
          const selected = contact.id === selectedContactId;

          return (
            <button
              className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left transition hover:bg-fill"
              key={contact.id}
              onClick={() => onSelect(contact)}
              type="button"
            >
              <AppAvatar
                className="size-9"
                imageUrl={contact.profileImageUrl}
                name={contact.name}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-callout font-semibold text-[#2F4B4F]">
                  {contact.name}
                </span>
                <span className="block truncate text-footnote text-[#2F4B4F]/55">
                  {contact.email || contact.phoneNumber || "No contact detail"}
                </span>
              </span>
              {selected ? <Check className="size-4 text-primary" /> : null}
            </button>
          );
        })}

        {!isFetching && contacts.length === 0 ? (
          <div className="px-3 py-6 text-center text-footnote text-[#2F4B4F]/55">
            No contacts found.
          </div>
        ) : null}
        {isFetching ? (
          <div className="px-3 py-3 text-center text-footnote text-[#2F4B4F]/55">
            Loading contacts...
          </div>
        ) : null}
      </div>
    </AppPopup>
  );
}

function getNoteContact(contact: ContactData): ContactNoteContact {
  return {
    email: contact.email,
    id: contact.id,
    name: contact.name,
    phoneNumber: contact.phoneNumber,
    profileImageUrl: contact.profileImageUrl,
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatRelativeDate(timestamp: number) {
  const diff = Date.now() - timestamp;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "Just now";
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;
  if (diff < day * 7) return `${Math.floor(diff / day)}d ago`;

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(timestamp);
}
