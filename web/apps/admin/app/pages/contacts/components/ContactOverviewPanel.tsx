import * as React from "react";
import {
  CalendarDays,
  ChevronDown,
  ContactRound,
  Heart,
  Mail,
  MapPin,
  NotebookPen,
  Pencil,
  Phone,
  Plus,
  MousePointerClick,
  Search,
  Send,
  ShoppingBag,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import {
  AppAvatar,
  AppDatePicker,
  AppIconButton,
  Button,
  EmptyState,
  StatCard,
  cn,
} from "@piya/ui";
import type { ContactData } from "@piya/shared/models";
import type { LocationData } from "@piya/shared/models";
import {
  dateInputToDate,
  dateToDateInput,
  showToast,
  useGetBadgesQuery,
  useGetContactTagsQuery,
  useLazyGetLocationDetailsQuery,
  useLazySearchLocationsQuery,
  useUpdateContactMutation,
  type AppDispatch,
} from "@piya/shared";
import type { UpdateContactInput } from "@piya/shared/types";
import { formatMoney } from "@piya/shared/utils";
import { useDispatch } from "react-redux";
import {
  DEFAULT_CONTACT_TAGS,
  MAX_CONTACT_TAGS,
} from "../constants";
import {
  ContactNotesPanel,
  type ContactNoteData,
} from "./ContactNotesPanel";

export type ContactOverviewTab = "events" | "orders" | "contact-info" | "notes";

const overviewTabs: {
  icon: React.ReactNode;
  label: string;
  value: ContactOverviewTab;
}[] = [
  {
    icon: <MousePointerClick className="size-4" />,
    label: "Events",
    value: "events",
  },
  {
    icon: <ShoppingBag className="size-4" />,
    label: "Orders",
    value: "orders",
  },
  {
    icon: <ContactRound className="size-4" />,
    label: "Contact info",
    value: "contact-info",
  },
  {
    icon: <NotebookPen className="size-4" />,
    label: "Notes",
    value: "notes",
  },
];

type ContactOverviewPanelProps = {
  addNoteRequestKey?: number;
  activeTab: ContactOverviewTab;
  contact: ContactData;
  notes: ContactNoteData[];
  onCreateNote: (
    note: Omit<ContactNoteData, "contactId" | "createdAt" | "id" | "type">
  ) => void;
  onContactUpdated?: (contact: ContactData) => void;
  onUpdateNote: (
    noteId: string,
    note: Omit<ContactNoteData, "contactId" | "createdAt" | "id" | "type">
  ) => void;
  onTabChange: (tab: ContactOverviewTab) => void;
};

export function ContactOverviewPanel({
  addNoteRequestKey = 0,
  activeTab,
  contact,
  notes,
  onCreateNote,
  onContactUpdated,
  onUpdateNote,
  onTabChange,
}: ContactOverviewPanelProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [noteComposerRequestKey, setNoteComposerRequestKey] =
    React.useState(0);
  const [currentContact, setCurrentContact] = React.useState(contact);
  const [draftName, setDraftName] = React.useState(contact.name);
  const [isEditingName, setIsEditingName] = React.useState(false);
  const { data: badgePayload } = useGetBadgesQuery();
  const [updateContact] = useUpdateContactMutation();
  const badge = React.useMemo(() => {
    return badgePayload?.badges.find(
      (badgeItem) => badgeItem.id === currentContact.badge.badgeId
    );
  }, [badgePayload, currentContact.badge.badgeId]);
  const badgeName = badge?.name ?? formatBadgeId(currentContact.badge.badgeId);

  React.useEffect(() => {
    setCurrentContact(contact);
    setDraftName(contact.name);
    setIsEditingName(false);
  }, [contact.id, contact.name]);

  function openNoteComposer() {
    setNoteComposerRequestKey((current) => current + 1);
  }

  function startNameEdit() {
    setDraftName(currentContact.name);
    setIsEditingName(true);
  }

  async function saveContactUpdate(input: UpdateContactInput) {
    try {
      const updatedContact = await updateContact({
        contactId: currentContact.id,
        input,
      }).unwrap();
      setCurrentContact(updatedContact);
      onContactUpdated?.(updatedContact);
      return updatedContact;
    } catch (error) {
      showToast(dispatch, {
        message: error instanceof Error ? error.message : "Contact update failed",
        title: "Could not save contact",
        variant: "error",
      });
      return null;
    }
  }

  async function commitNameEdit() {
    const nextName = draftName.trim();
    if (nextName && nextName !== currentContact.name) {
      const updatedContact = await saveContactUpdate({ name: nextName });
      setDraftName(updatedContact?.name ?? currentContact.name);
    } else {
      setDraftName(currentContact.name);
    }
    setIsEditingName(false);
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <AppAvatar
            className="size-16 text-[22px] leading-[1.27]"
            imageUrl={currentContact.profileImageUrl}
            name={currentContact.name}
          />
          <div>
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <input
                  autoFocus
                  className="min-w-0 rounded-sm border border-border bg-white px-2 py-1 text-title-3 font-semibold text-[#2F4B4F] outline-none transition focus:border-primary"
                  onBlur={commitNameEdit}
                  onChange={(event) => setDraftName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.currentTarget.blur();
                    }

                    if (event.key === "Escape") {
                      setDraftName(currentContact.name);
                      setIsEditingName(false);
                    }
                  }}
                  value={draftName}
                />
              ) : (
                <h3 className="text-title-3 font-semibold text-[#2F4B4F]">
                  {currentContact.name}
                </h3>
              )}
              {!isEditingName ? (
                <button
                  aria-label="Edit contact name"
                  className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-[#2F4B4F]/45 transition hover:bg-fill hover:text-[#2F4B4F]"
                  onClick={startNameEdit}
                  type="button"
                >
                  <Pencil className="size-3.5" />
                </button>
              ) : null}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-2.5 py-1">
                <img
                  alt={badgeName}
                  className="size-4 object-contain"
                  src={getBadgeIconSrc(badge?.icon)}
                />
                <span className="text-footnote font-semibold capitalize text-primary">
                  {badgeName}
                </span>
              </span>
              <span className="text-footnote text-[#2F4B4F]/60">
                {currentContact.badge.points.toLocaleString()} pts earned
              </span>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
          <AppIconButton
            className="size-11 rounded-md border border-border bg-transparent text-[#2F4B4F] hover:bg-white"
            icon={<Send className="size-4" />}
            label="Send request"
          />
          <AppIconButton
            className="size-11 rounded-md border border-border bg-transparent text-[#2F4B4F] hover:bg-white"
            icon={<NotebookPen className="size-4" />}
            label="Add note"
            onClick={openNoteComposer}
          />
          <AppIconButton
            className="size-11 rounded-md border border-border bg-transparent text-error hover:bg-error/10"
            icon={<Trash2 className="size-4" />}
            label="Delete contact"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          className="bg-fill"
          label="Lifetime value"
          value={formatMoney(currentContact.counts.lifetimeValue)}
        />
        <StatCard
          className="bg-fill"
          label="Orders"
          value={currentContact.counts.totalOrders.toString()}
        />
        <StatCard
          className="bg-fill"
          label="Last interaction"
          value={formatDate(currentContact.lastInteractionAt)}
        />
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-2">
          {overviewTabs.map((tab) => (
            <button
              className={cn(
                "inline-flex items-center gap-2 border-b-2 px-3 py-3 text-callout font-semibold transition",
                activeTab === tab.value
                  ? "border-primary text-primary"
                  : "border-transparent text-[#2F4B4F]/60 hover:text-[#2F4B4F]"
              )}
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              type="button"
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "events" ? <AuditLogPanel /> : null}
      {activeTab === "orders" ? <OrdersPanel /> : null}
      {activeTab === "contact-info" ? (
        <ContactInfoPanel
          contact={currentContact}
          onContactUpdate={saveContactUpdate}
        />
      ) : null}
      <ContactNotesPanel
        addNoteRequestKey={addNoteRequestKey + noteComposerRequestKey}
        contact={currentContact}
        notes={notes}
        onCreateNote={onCreateNote}
        onUpdateNote={onUpdateNote}
        renderPanel={activeTab === "notes"}
      />
    </div>
  );
}

function AuditLogPanel() {
  return <EmptyState>No audit log entries yet.</EmptyState>;
}

function OrdersPanel() {
  return <EmptyState>No orders yet.</EmptyState>;
}

function ContactInfoPanel({
  contact,
  onContactUpdate,
}: {
  contact: ContactData;
  onContactUpdate: (input: UpdateContactInput) => Promise<ContactData | null>;
}) {
  const { data: reusableTags = [] } = useGetContactTagsQuery();
  const [isAddressDialogOpen, setIsAddressDialogOpen] = React.useState(false);
  const tagNames = new Map(reusableTags.map((tag) => [tag.id, tag.name]));
  const address = contact.address
    ? [
        contact.address.address,
        contact.address.city,
        contact.address.state,
        contact.address.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "No address added";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <EditableContactInfoCard
        field="name"
        icon={<ContactRound className="size-4" />}
        label="Full name"
        onSave={onContactUpdate}
        value={contact.name}
      />
      <EditableContactInfoCard
        field="email"
        icon={<Mail className="size-4" />}
        label="Email"
        onSave={onContactUpdate}
        placeholder="No email added"
        value={contact.email}
      />
      <EditableContactInfoCard
        field="phoneNumber"
        icon={<Phone className="size-4" />}
        label="Phone"
        onSave={onContactUpdate}
        placeholder="No phone added"
        value={contact.phoneNumber}
        renderEditField={({
          cancelEdit,
          commitValue,
          draftValue,
          setDraftValue,
        }) => (
          <PhoneEditField
            cancelEdit={cancelEdit}
            countryCode={contact.countryCode}
            onCommit={commitValue}
            onValueChange={setDraftValue}
            value={draftValue}
          />
        )}
      />
      <EditableTagsCard
        icon={<Tag className="size-4" />}
        onSave={(tags) => onContactUpdate({ tags })}
        reusableTagNames={Array.from(tagNames.values())}
        tagNames={tagNames}
        tags={contact.tags}
      />
      <EditableContactInfoCard
        field="dob"
        icon={<CalendarDays className="size-4" />}
        label="Date of birth"
        onSave={onContactUpdate}
        placeholder="Not provided"
        renderEditField={({ saveValue }) => (
          <ContactDateEditField
            ariaLabel="Choose date of birth"
            onSave={saveValue}
            placeholder="Select date of birth"
            value={contact.dob}
          />
        )}
        value={contact.dob}
      />
      <EditableContactInfoCard
        field="anniversary"
        icon={<Heart className="size-4" />}
        label="Anniversary"
        onSave={onContactUpdate}
        placeholder="Not provided"
        renderEditField={({ saveValue }) => (
          <ContactDateEditField
            ariaLabel="Choose anniversary"
            onSave={saveValue}
            placeholder="Select anniversary"
            value={contact.anniversary}
          />
        )}
        value={contact.anniversary}
      />
      <ContactDisplayCard
        className="sm:col-span-2"
        icon={<MapPin className="size-4" />}
        label="Address"
        onEdit={() => setIsAddressDialogOpen(true)}
        showEditIcon
        value={address}
      />
      <AddressSearchDialog
        onClose={() => setIsAddressDialogOpen(false)}
        onSelect={(location) => {
          void onContactUpdate({ address: location });
          setIsAddressDialogOpen(false);
        }}
        open={isAddressDialogOpen}
        value={contact.address ?? null}
      />
    </div>
  );
}

function EditableContactInfoCard({
  field,
  icon,
  inputType = "text",
  label,
  onSave,
  placeholder = "Not provided",
  renderEditField,
  value,
}: {
  field: keyof Pick<
    UpdateContactInput,
    "anniversary" | "countryCode" | "dob" | "email" | "name" | "phoneNumber"
  >;
  icon?: React.ReactNode;
  inputType?: React.HTMLInputTypeAttribute;
  label: string;
  onSave: (input: UpdateContactInput) => Promise<ContactData | null>;
  placeholder?: string;
  renderEditField?: (props: {
    cancelEdit: () => void;
    commitValue: () => Promise<void>;
    draftValue: string;
    saveValue: (value: string | null) => Promise<void>;
    setDraftValue: (value: string) => void;
  }) => React.ReactNode;
  value?: string | null;
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [draftValue, setDraftValue] = React.useState(value ?? "");

  React.useEffect(() => {
    if (!isEditing) {
      setDraftValue(value ?? "");
    }
  }, [isEditing, value]);

  async function commitValue() {
    const trimmedValue = draftValue.trim();
    const nextValue = trimmedValue || null;
    await saveValue(nextValue);
  }

  async function saveValue(nextValue: string | null) {
    if ((value ?? null) !== nextValue) {
      const result = await onSave({ [field]: nextValue });
      if (!result) {
        setDraftValue(value ?? "");
      }
    }

    setIsEditing(false);
  }

  return (
    <div className="rounded-md border border-border bg-fill/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-footnote font-normal text-[#2F4B4F]/65">
            {icon}
            {label}
          </div>
          {isEditing && renderEditField ? (
            renderEditField({
              cancelEdit: () => {
                setDraftValue(value ?? "");
                setIsEditing(false);
              },
              commitValue,
              draftValue,
              saveValue,
              setDraftValue,
            })
          ) : isEditing ? (
            <input
              autoFocus
              className="mt-2 h-10 w-full rounded-sm border border-border bg-white px-3 text-callout font-semibold text-[#2F4B4F] outline-none transition focus:border-primary"
              onBlur={commitValue}
              onChange={(event) => setDraftValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.currentTarget.blur();
                }

                if (event.key === "Escape") {
                  setDraftValue(value ?? "");
                  setIsEditing(false);
                }
              }}
              type={inputType}
              value={draftValue}
            />
          ) : (
            <div className="mt-2 truncate text-callout font-semibold text-[#2F4B4F]">
              {value || placeholder}
            </div>
          )}
        </div>
        {!isEditing ? (
          <button
            aria-label={`Edit ${label}`}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-[#2F4B4F]/45 transition hover:bg-white hover:text-[#2F4B4F]"
            onClick={() => setIsEditing(true)}
            type="button"
          >
            <Pencil className="size-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function ContactDisplayCard({
  className,
  icon,
  label,
  onEdit,
  showEditIcon,
  value,
}: {
  className?: string;
  icon?: React.ReactNode;
  label: string;
  onEdit?: () => void;
  showEditIcon?: boolean;
  value: React.ReactNode;
}) {
  return (
    <div
      className={cn("rounded-md border border-border bg-fill/40 p-4", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-footnote font-normal text-[#2F4B4F]/65">
            {icon}
            {label}
          </div>
          <div className="mt-2 truncate text-callout text-[#2F4B4F]">
            {value}
          </div>
        </div>
        {showEditIcon ? (
          <button
            aria-label={`Edit ${label}`}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-[#2F4B4F]/45"
            onClick={onEdit}
            type="button"
          >
            <Pencil className="size-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function ContactDateEditField({
  ariaLabel,
  onSave,
  placeholder,
  value,
}: {
  ariaLabel: string;
  onSave: (value: string | null) => Promise<void>;
  placeholder: string;
  value?: string | null;
}) {
  return (
    <div className="mt-2">
      <AppDatePicker
        ariaLabel={ariaLabel}
        onChange={(date) => void onSave(dateToDateInput(date))}
        placeholder={placeholder}
        value={dateInputToDate(value ?? "")}
      />
    </div>
  );
}

function PhoneEditField({
  cancelEdit,
  countryCode,
  onCommit,
  onValueChange,
  value,
}: {
  cancelEdit: () => void;
  countryCode?: string | null;
  onCommit: () => Promise<void>;
  onValueChange: (value: string) => void;
  value: string;
}) {
  const initialCountryCode = getPhoneCountryCode(countryCode, value);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedCountryCode, setSelectedCountryCode] =
    React.useState(initialCountryCode);
  const selectedPrefix = phonePrefixes[selectedCountryCode];
  const [localNumber, setLocalNumber] = React.useState(
    selectedPrefix ? getLocalPhoneNumber(value, selectedPrefix.callingCode) : value
  );

  function updateNumber(nextLocalNumber: string, nextCountryCode = selectedCountryCode) {
    setLocalNumber(nextLocalNumber);
    onValueChange(normalizePhoneNumber(nextCountryCode, nextLocalNumber));
  }

  function selectCountry(nextCountryCode: string) {
    setSelectedCountryCode(nextCountryCode);
    updateNumber(localNumber, nextCountryCode);
    setIsOpen(false);
  }

  return (
    <div
      className="mt-2"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          void onCommit();
        }
      }}
    >
      <div className="flex h-12 overflow-visible rounded-sm border border-border bg-fill transition focus-within:border-primary focus-within:bg-white">
        <span className="relative flex shrink-0">
          <button
            className="inline-flex h-full items-center gap-2 border-r border-border px-3 text-callout font-semibold text-[#2F4B4F] transition hover:bg-secondary/30"
            onClick={() => setIsOpen((current) => !current)}
            type="button"
          >
            <span>{selectedPrefix.flag}</span>
            <span>{selectedPrefix.callingCode}</span>
            <ChevronDown
              className={cn(
                "size-4 text-[#2F4B4F]/65 transition",
                isOpen && "rotate-180"
              )}
            />
          </button>

          {isOpen ? (
            <div className="absolute left-0 top-full z-30 mt-2 w-56 rounded-md border border-border bg-white py-2 text-callout text-[#2F4B4F] shadow-lg">
              {Object.entries(phonePrefixes).map(([code, prefix]) => {
                const isSelected = code === selectedCountryCode;

                return (
                  <button
                    className={cn(
                      "flex w-full items-center justify-between gap-3 border-b border-border px-4 py-3 text-left transition last:border-b-0 hover:bg-fill",
                      isSelected && "bg-secondary/30 text-primary"
                    )}
                    key={code}
                    onClick={() => selectCountry(code)}
                    type="button"
                  >
                    <span className="inline-flex items-center gap-3">
                      <span>{prefix.flag}</span>
                      <span>{prefix.country}</span>
                    </span>
                    <span className="font-semibold">{prefix.callingCode}</span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </span>
        <input
          autoFocus
          className="min-w-0 flex-1 bg-transparent px-3 text-callout font-semibold text-[#2F4B4F] outline-none placeholder:text-[#2F4B4F]/40"
          inputMode="tel"
          onChange={(event) => updateNumber(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.currentTarget.blur();
            }

            if (event.key === "Escape") {
              cancelEdit();
            }
          }}
          placeholder="Enter phone number"
          type="tel"
          value={localNumber}
        />
      </div>
    </div>
  );
}

function EditableTagsCard({
  icon,
  onSave,
  reusableTagNames,
  tagNames,
  tags,
}: {
  icon: React.ReactNode;
  onSave: (tags: string[]) => Promise<ContactData | null>;
  reusableTagNames: string[];
  tagNames: Map<string, string>;
  tags: string[];
}) {
  const [draft, setDraft] = React.useState("");
  const [draftTags, setDraftTags] = React.useState(tags);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const suggestedTags = React.useMemo(() => {
    const names = [...DEFAULT_CONTACT_TAGS, ...reusableTagNames];
    return names.filter(
      (tag, index) =>
        names.findIndex(
          (candidate) =>
            candidate.toLocaleLowerCase() === tag.toLocaleLowerCase()
        ) === index
    );
  }, [reusableTagNames]);

  React.useEffect(() => {
    if (!isEditing) setDraftTags(tags);
  }, [isEditing, tags]);

  React.useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  async function saveTags(nextTags: string[]) {
    setDraftTags(nextTags);
    await onSave(nextTags);
  }

  async function addTag() {
    const nextTag = draft.trim().replace(/\s+/g, " ");
    const isDuplicate = draftTags.some(
      (tag) => tag.toLocaleLowerCase() === nextTag.toLocaleLowerCase()
    );

    if (!nextTag || isDuplicate || draftTags.length >= MAX_CONTACT_TAGS) {
      setDraft("");
      setIsEditing(false);
      setIsOpen(false);
      return;
    }

    await saveTags([...draftTags, nextTag]);
    setDraft("");
    setIsEditing(false);
    setIsOpen(false);
  }

  function removeTag(tagToRemove: string) {
    void saveTags(draftTags.filter((tag) => tag !== tagToRemove));
  }

  function toggleSuggestedTag(suggestedTag: string) {
    const selectedTag = draftTags.find(
      (tag) => tag.toLocaleLowerCase() === suggestedTag.toLocaleLowerCase()
    );

    if (selectedTag) {
      removeTag(selectedTag);
      return;
    }

    if (draftTags.length < MAX_CONTACT_TAGS) {
      void saveTags([...draftTags, suggestedTag]);
    }
  }

  return (
    <div className="rounded-md border border-border bg-fill/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-footnote font-normal text-[#2F4B4F]/65">
            {icon}
            Tags
          </div>
          {!isEditing ? (
            <div className="mt-2 flex min-w-0 gap-2 overflow-hidden whitespace-nowrap text-callout font-semibold text-[#2F4B4F]">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <span
                    className="inline-flex max-w-full shrink-0 items-center rounded-full bg-secondary px-2.5 py-1 text-caption-1 font-semibold text-[#2F4B4F]"
                    key={tag}
                  >
                    <span className="truncate">
                      {tagNames.get(tag) ?? formatTagId(tag)}
                    </span>
                  </span>
                ))
              ) : (
                "No tags added"
              )}
            </div>
          ) : (
            <div className="relative mt-2">
              <div
                className={cn(
                  "flex min-h-12 w-full items-center justify-between gap-3 rounded-sm border border-border bg-fill px-3 py-2 text-left text-callout text-[#2F4B4F] outline-none transition focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20",
                  isOpen && "border-primary bg-white"
                )}
              >
                <span className="flex min-w-0 flex-1 flex-wrap gap-2">
                  {draftTags.map((tag) => (
                    <button
                      aria-label={`Remove ${tag}`}
                      className="inline-flex max-w-full items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-caption-1 font-semibold text-[#2F4B4F]"
                      key={tag}
                      onClick={() => removeTag(tag)}
                      type="button"
                    >
                      <span className="truncate">
                        {tagNames.get(tag) ?? formatTagId(tag)}
                      </span>
                      <X className="size-3 shrink-0" />
                    </button>
                  ))}
                  {draftTags.length < MAX_CONTACT_TAGS ? (
                    <input
                      className="min-w-20 flex-1 bg-transparent text-left text-callout text-[#2F4B4F] outline-none placeholder:text-[#2F4B4F]/40"
                      maxLength={40}
                      onChange={(event) => setDraft(event.target.value)}
                      onFocus={() => setIsOpen(true)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          void addTag();
                        }

                        if (event.key === "Escape") {
                          setIsEditing(false);
                          setIsOpen(false);
                        }
                      }}
                      placeholder={draftTags.length > 0 ? "Add tag" : "Add tags"}
                      ref={inputRef}
                      value={draft}
                    />
                  ) : null}
                </span>
                <button
                  aria-expanded={isOpen}
                  aria-label="Add tags"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-secondary/60"
                  onClick={() => setIsOpen((current) => !current)}
                  type="button"
                >
                  <ChevronDown
                    className={cn(
                      "size-4 text-[#2F4B4F]/55 transition",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
              </div>

              {isOpen ? (
                <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-md border border-border bg-white p-3 shadow-lg">
                  <div className="flex gap-2">
                    <input
                      className="h-10 min-w-0 flex-1 rounded-sm border border-border bg-fill px-3 text-callout text-[#2F4B4F] outline-none placeholder:text-[#2F4B4F]/40 focus:border-primary focus:bg-white"
                      maxLength={40}
                      onChange={(event) => setDraft(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          void addTag();
                        }
                      }}
                      placeholder="Type a tag"
                      value={draft}
                    />
                    <Button
                      disabled={!draft.trim() || draftTags.length >= MAX_CONTACT_TAGS}
                      icon={<Plus />}
                      onClick={() => void addTag()}
                      size="sm"
                      type="button"
                    >
                      Add
                    </Button>
                  </div>
                  {draftTags.length >= MAX_CONTACT_TAGS ? (
                    <p className="mt-2 text-caption-1 text-[#2F4B4F]/55">
                      Maximum of 5 tags reached.
                    </p>
                  ) : null}
                  <div className="mt-4 border-t border-border pt-3">
                    <p className="text-caption-1 font-semibold text-[#2F4B4F]/65">
                      Suggested tags
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {suggestedTags.map((suggestedTag) => {
                        const isSelected = draftTags.some(
                          (tag) =>
                            tag.toLocaleLowerCase() ===
                            suggestedTag.toLocaleLowerCase()
                        );

                        return (
                          <button
                            aria-pressed={isSelected}
                            className={cn(
                              "rounded-full border px-3 py-1.5 text-caption-1 font-semibold transition",
                              isSelected
                                ? "border-primary bg-secondary text-primary"
                                : "border-border bg-fill text-[#2F4B4F]/75 hover:border-primary/50",
                              draftTags.length >= MAX_CONTACT_TAGS &&
                                !isSelected &&
                                "cursor-not-allowed opacity-45"
                            )}
                            disabled={
                              draftTags.length >= MAX_CONTACT_TAGS && !isSelected
                            }
                            key={suggestedTag}
                            onClick={() => toggleSuggestedTag(suggestedTag)}
                            type="button"
                          >
                            {suggestedTag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
        {!isEditing ? (
          <button
            aria-label="Edit Tags"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-[#2F4B4F]/45 transition hover:bg-white hover:text-[#2F4B4F]"
            onClick={() => setIsEditing(true)}
            type="button"
          >
            <Pencil className="size-3.5" />
          </button>
        ) : (
          <button
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-[#2F4B4F]/45 transition hover:bg-white hover:text-[#2F4B4F]"
            onClick={() => {
              setDraftTags(tags);
              setDraft("");
              setIsEditing(false);
              setIsOpen(false);
            }}
            type="button"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

const phonePrefixes: Record<
  string,
  {
    callingCode: string;
    country: string;
    flag: string;
  }
> = {
  GH: { callingCode: "+233", country: "Ghana", flag: "🇬🇭" },
  KE: { callingCode: "+254", country: "Kenya", flag: "🇰🇪" },
  NG: { callingCode: "+234", country: "Nigeria", flag: "🇳🇬" },
  US: { callingCode: "+1", country: "United States", flag: "🇺🇸" },
  ZA: { callingCode: "+27", country: "South Africa", flag: "🇿🇦" },
};

function getPhoneCountryCode(
  countryCode?: string | null,
  phoneNumber?: string | null
) {
  if (countryCode && phonePrefixes[countryCode]) {
    return countryCode;
  }

  if (!phoneNumber) return "NG";

  return (
    Object.entries(phonePrefixes).find(([, prefix]) =>
      phoneNumber.replace(/\s/g, "").startsWith(prefix.callingCode)
    )?.[0] ?? "NG"
  );
}

function normalizePhoneNumber(countryCode: string, localNumber: string) {
  const localDigits = localNumber.replace(/\D/g, "").replace(/^0+/, "");
  if (!localDigits) return "";

  return `${phonePrefixes[countryCode].callingCode}${localDigits}`;
}

function getLocalPhoneNumber(phoneNumber: string, callingCode: string) {
  const compactPhoneNumber = phoneNumber.replace(/\s/g, "");
  if (!compactPhoneNumber.startsWith(callingCode)) return phoneNumber;

  return phoneNumber.replace(callingCode, "").trim() || phoneNumber;
}

function AddressSearchDialog({
  onClose,
  onSelect,
  open,
  value,
}: {
  onClose: () => void;
  onSelect: (location: LocationData) => void;
  open: boolean;
  value: LocationData | null;
}) {
  const [searchLocations, searchState] = useLazySearchLocationsQuery();
  const [getLocationDetails, locationDetailsState] =
    useLazyGetLocationDetailsQuery();
  const resetLocationDetails = locationDetailsState.reset;
  const [search, setSearch] = React.useState(value?.address ?? "");

  React.useEffect(() => {
    if (open) {
      resetLocationDetails();
      setSearch(value?.address ?? "");
    }
  }, [open, resetLocationDetails, value]);

  React.useEffect(() => {
    const input = search.trim();
    if (!open || input.length < 2) return;

    const timeoutId = window.setTimeout(() => {
      void searchLocations(input, true);
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [open, search, searchLocations]);

  if (!open) return null;

  const searchInput = search.trim();
  const predictions =
    searchState.originalArgs === searchInput ? searchState.data ?? [] : [];
  const hasSearchError =
    searchInput.length >= 2 &&
    searchState.originalArgs === searchInput &&
    searchState.isError;

  async function selectPrediction(placeId: string) {
    try {
      const location = await getLocationDetails(placeId, true).unwrap();
      onSelect(location);
    } catch {
      // The query state renders a sanitized API error below the results.
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#102A2D]/45 p-4">
      <button
        aria-label="Close address search"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />
      <div
        aria-modal="true"
        className="relative w-full max-w-xl rounded-md bg-white text-[#2F4B4F] shadow-xl"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-6">
          <div>
            <h3 className="text-title-2 font-semibold">Find location</h3>
          </div>
          <button
            aria-label="Close"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-fill hover:bg-secondary"
            onClick={onClose}
            type="button"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="grid gap-4 p-6">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#2F4B4F]/50" />
            <input
              autoFocus
              className="h-12 w-full rounded-sm border border-border bg-fill pl-10 pr-3 text-callout text-[#2F4B4F] outline-none placeholder:text-[#2F4B4F]/40 focus:border-primary focus:bg-white"
              onChange={(event) => {
                resetLocationDetails();
                setSearch(event.target.value);
              }}
              placeholder="Search street, area, or city"
              value={search}
            />
          </label>

          <div className="min-h-36">
            {searchState.isFetching ? (
              <div className="flex min-h-36 items-center justify-center text-callout text-[#2F4B4F]/60">
                Searching locations...
              </div>
            ) : hasSearchError || locationDetailsState.isError ? (
              <div className="flex min-h-36 items-center justify-center px-6 text-center text-callout text-error">
                {getRequestErrorMessage(
                  locationDetailsState.error ?? searchState.error,
                  "Unable to search locations."
                )}
              </div>
            ) : predictions.length > 0 ? (
              <div className="grid">
                {predictions.map((prediction) => (
                  <button
                    className="flex w-full items-start gap-3 rounded-md p-4 text-left transition hover:bg-fill disabled:cursor-wait disabled:opacity-60"
                    disabled={locationDetailsState.isFetching}
                    key={prediction.placeId}
                    onClick={() => void selectPrediction(prediction.placeId)}
                    type="button"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                      <MapPin className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-callout font-semibold">
                        {prediction.mainText}
                      </span>
                      {prediction.secondaryText ? (
                        <span className="mt-1 block text-footnote text-[#2F4B4F]/60">
                          {prediction.secondaryText}
                        </span>
                      ) : null}
                    </span>
                  </button>
                ))}
              </div>
            ) : searchInput.length >= 2 && searchState.isSuccess ? (
              <div className="flex min-h-36 items-center justify-center px-6 text-center text-callout text-[#2F4B4F]/60">
                No locations found.
              </div>
            ) : (
              <div className="flex min-h-36 flex-col items-center justify-center px-6 text-center">
                <MapPin className="size-6 text-[#2F4B4F]/35" />
                <p className="mt-2 text-callout text-[#2F4B4F]/60">
                  Start typing to find an address.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTagId(tagId: string) {
  return tagId
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(timestamp);
}

function getRequestErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return fallback;
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
