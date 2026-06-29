import * as React from "react";
import {
  CheckCircle2,
  ChevronDown,
  MapPin,
  Plus,
  Search,
  Upload,
  X,
} from "lucide-react";
import {
  AppDatePicker,
  AppSelectField,
  AppTextField,
  Button,
  PhoneNumberField,
  cn,
  isValidSupportedPhoneNumber,
} from "@piya/ui";
import {
  dateToDateInput,
  showToast,
  useCreateContactMutation,
  useGetContactTagsQuery,
  useLazyGetLocationDetailsQuery,
  useLazySearchLocationsQuery,
  type AppDispatch,
} from "@piya/shared";
import type { LocationData } from "@piya/shared/models";
import type { CreateContactInput } from "@piya/shared/types";
import { useDispatch } from "react-redux";
import {
  CONTACT_GENDER_OPTIONS,
  DEFAULT_CONTACT_TAGS,
  MANUAL_CONTACT_FORM_ID,
  MAX_CONTACT_TAGS,
} from "../constants";
import type { AddContactSheetProps } from "../types";

export function AddContactSheet({
  mode,
  onClose,
  onModeChange,
  open,
}: AddContactSheetProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [createContact, createContactState] = useCreateContactMutation();

  if (!open) return null;

  async function saveContact(input: CreateContactInput) {
    try {
      await createContact(input).unwrap();
      showToast(dispatch, {
        message: "Contact created.",
        variant: "success",
      });
      onClose();
    } catch (error) {
      showToast(dispatch, {
        message: getRequestErrorMessage(error, "Unable to create contact."),
        variant: "error",
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#102A2D]/45">
      <button
        aria-label="Close add contact sheet"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />
      <aside className="relative flex h-full w-full max-w-xl flex-col bg-white text-[#2F4B4F] shadow-xl">
        <div className="flex items-start justify-between border-b border-border p-6">
          <div>
            <h2 className="text-title-2 font-semibold text-[#2F4B4F]">
              Add contact
            </h2>
            <p className="mt-1 text-callout text-[#2F4B4F]/70">
              Create one contact manually or upload a CSV file.
            </p>
          </div>
          <button
            aria-label="Close"
            className="flex size-10 items-center justify-center rounded-full bg-fill text-[#2F4B4F] hover:bg-secondary"
            onClick={onClose}
            type="button"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="border-b border-border px-6 py-4">
          <div className="grid grid-cols-2 rounded-md bg-fill p-1">
            <ModeButton
              active={mode === "manual"}
              onClick={() => onModeChange("manual")}
            >
              Manual
            </ModeButton>
            <ModeButton
              active={mode === "csv"}
              onClick={() => onModeChange("csv")}
            >
              CSV
            </ModeButton>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {mode === "manual" ? (
            <ManualContactForm onSave={saveContact} />
          ) : (
            <CsvContactForm />
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border p-6">
          <Button
            className="bg-fill text-[#2F4B4F] hover:bg-fill-secondary"
            onClick={onClose}
            type="button"
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            buttonState={createContactState.isLoading ? "loading" : "enabled"}
            form={mode === "manual" ? MANUAL_CONTACT_FORM_ID : undefined}
            icon={mode === "csv" ? <Upload /> : <CheckCircle2 />}
            loadingLabel="Saving contact"
            type={mode === "manual" ? "submit" : "button"}
          >
            {mode === "csv" ? "Import contacts" : "Save contact"}
          </Button>
        </div>
      </aside>
    </div>
  );
}

function ModeButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "rounded-sm px-4 py-2 text-callout font-semibold transition",
        active ? "bg-white text-[#2F4B4F] shadow-sm" : "text-[#2F4B4F]/65"
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function ManualContactForm({
  onSave,
}: {
  onSave: (input: CreateContactInput) => Promise<void>;
}) {
  const [address, setAddress] = React.useState<LocationData | null>(null);
  const [dob, setDob] = React.useState<Date | null>(null);
  const [email, setEmail] = React.useState("");
  const [gender, setGender] = React.useState<
    NonNullable<CreateContactInput["gender"]> | ""
  >("");
  const [isAddressDialogOpen, setIsAddressDialogOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [submitAttempted, setSubmitAttempted] = React.useState(false);
  const [tags, setTags] = React.useState<string[]>([]);
  const hasContactMethod = Boolean(email.trim() || phoneNumber.trim());
  const hasValidPhoneNumber =
    !phoneNumber.trim() || isValidSupportedPhoneNumber(phoneNumber);

  async function submitManualContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitAttempted(true);

    if (!hasContactMethod || !hasValidPhoneNumber) return;

    await onSave({
      name: name.trim(),
      email: email.trim() || null,
      phoneNumber: phoneNumber || null,
      address,
      dob: dob ? dateToDateInput(dob) : null,
      gender: gender || null,
      tags,
    });
  }

  return (
    <>
      <form
        className="grid gap-4 pb-32"
        id={MANUAL_CONTACT_FORM_ID}
        onSubmit={(event) => void submitManualContact(event)}
      >
        <AppTextField
          label="Full name"
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter full name"
          required
          value={name}
        />
        <AppTextField
          label="Email address"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter email address"
          type="email"
          value={email}
        />
        <PhoneNumberField
          label="Phone number"
          onChange={setPhoneNumber}
          placeholder="Enter phone number"
          value={phoneNumber}
        />
        {submitAttempted && !hasContactMethod ? (
          <p className="-mt-2 text-footnote leading-relaxed text-error">
            Enter an email address or phone number.
          </p>
        ) : null}

        <TagField onChange={setTags} tags={tags} />

        <AddressField
          onClick={() => setIsAddressDialogOpen(true)}
          value={address?.address ?? ""}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid min-w-0 gap-2">
            <span className="text-footnote font-normal text-[#2F4B4F]">
              Date of birth
            </span>
            <AppDatePicker
              ariaLabel="Choose date of birth"
              onChange={setDob}
              placeholder="Select date"
              value={dob}
            />
          </label>
          <AppSelectField
            label="Gender"
            onChange={(event) =>
              setGender(
                event.target.value as
                  | NonNullable<CreateContactInput["gender"]>
                  | ""
              )
            }
            options={CONTACT_GENDER_OPTIONS}
            value={gender}
          />
        </div>
      </form>

      <AddressSearchDialog
        onClose={() => setIsAddressDialogOpen(false)}
        onSelect={(location) => {
          setAddress(location);
          setIsAddressDialogOpen(false);
        }}
        open={isAddressDialogOpen}
        value={address}
      />
    </>
  );
}

function TagField({
  onChange,
  tags,
}: {
  onChange: (tags: string[]) => void;
  tags: string[];
}) {
  const [draft, setDraft] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const { data: reusableTags = [] } = useGetContactTagsQuery();
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const suggestedTags = React.useMemo(() => {
    const tagNames = [
      ...DEFAULT_CONTACT_TAGS,
      ...reusableTags.map((tag) => tag.name),
    ];

    return tagNames.filter(
      (tag, index) =>
        tagNames.findIndex(
          (candidate) =>
            candidate.toLocaleLowerCase() === tag.toLocaleLowerCase()
        ) === index
    );
  }, [reusableTags]);

  React.useEffect(() => {
    if (!isOpen) return;

    function closeOnOutsidePress(event: PointerEvent) {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsidePress);
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  function addTag() {
    const nextTag = draft.trim().replace(/\s+/g, " ");
    const isDuplicate = tags.some(
      (tag) => tag.toLocaleLowerCase() === nextTag.toLocaleLowerCase()
    );

    if (!nextTag || isDuplicate || tags.length >= MAX_CONTACT_TAGS) return;

    onChange([...tags, nextTag]);
    setDraft("");
  }

  function removeTag(tagToRemove: string) {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  }

  function toggleDefaultTag(defaultTag: string) {
    const selectedTag = tags.find(
      (tag) => tag.toLocaleLowerCase() === defaultTag.toLocaleLowerCase()
    );

    if (selectedTag) {
      removeTag(selectedTag);
      return;
    }

    if (tags.length < MAX_CONTACT_TAGS) onChange([...tags, defaultTag]);
  }

  return (
    <div className="grid gap-2" ref={rootRef}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-footnote font-normal text-[#2F4B4F]">Tags</span>
        <span className="text-caption-1 text-[#2F4B4F]/50">
          {tags.length}/{MAX_CONTACT_TAGS}
        </span>
      </div>
      <div className="relative">
        <div
          className={cn(
            "flex min-h-12 w-full items-center justify-between gap-3 rounded-sm border border-border bg-fill px-3 py-2 text-left text-callout text-[#2F4B4F] outline-none transition focus-visible:ring-2 focus-visible:ring-primary/20",
            isOpen && "border-primary bg-white"
          )}
        >
          <span className="flex min-w-0 flex-1 flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                aria-label={`Remove ${tag}`}
                className="inline-flex max-w-full items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-caption-1 font-semibold text-[#2F4B4F]"
                key={tag}
                onClick={() => removeTag(tag)}
                type="button"
              >
                <span className="truncate">{tag}</span>
                <X className="size-3 shrink-0" />
              </button>
            ))}
            {tags.length < MAX_CONTACT_TAGS ? (
              <button
                className="min-w-20 flex-1 text-left text-[#2F4B4F]/40"
                onClick={() => setIsOpen(true)}
                type="button"
              >
                {tags.length > 0 ? "Add tag" : "Add tags"}
              </button>
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
                    addTag();
                  }
                }}
                placeholder="Type a tag"
                ref={inputRef}
                value={draft}
              />
              <Button
                disabled={!draft.trim() || tags.length >= MAX_CONTACT_TAGS}
                icon={<Plus />}
                onClick={addTag}
                size="sm"
                type="button"
              >
                Add
              </Button>
            </div>
            {tags.length >= MAX_CONTACT_TAGS ? (
              <p className="mt-2 text-caption-1 text-[#2F4B4F]/55">
                Maximum of 5 tags reached.
              </p>
            ) : null}
            <div className="mt-4 border-t border-border pt-3">
              <p className="text-caption-1 font-semibold text-[#2F4B4F]/65">
                Suggested tags
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {suggestedTags.map((defaultTag) => {
                  const isSelected = tags.some(
                    (tag) =>
                      tag.toLocaleLowerCase() === defaultTag.toLocaleLowerCase()
                  );

                  return (
                    <button
                      aria-pressed={isSelected}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-caption-1 font-semibold transition",
                        isSelected
                          ? "border-primary bg-secondary text-primary"
                          : "border-border bg-fill text-[#2F4B4F]/75 hover:border-primary/50",
                        tags.length >= MAX_CONTACT_TAGS &&
                          !isSelected &&
                          "cursor-not-allowed opacity-45"
                      )}
                      disabled={tags.length >= MAX_CONTACT_TAGS && !isSelected}
                      key={defaultTag}
                      onClick={() => toggleDefaultTag(defaultTag)}
                      type="button"
                    >
                      {defaultTag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function AddressField({
  onClick,
  value,
}: {
  onClick: () => void;
  value: string;
}) {
  return (
    <div className="grid gap-2">
      <span className="text-footnote font-normal text-[#2F4B4F]">Address</span>
      <button
        className="flex min-h-12 w-full items-center gap-3 rounded-sm border border-border bg-fill px-3 py-2 text-left text-callout text-[#2F4B4F] outline-none transition hover:bg-secondary/20 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
        onClick={onClick}
        type="button"
      >
        <MapPin className="size-4 shrink-0 text-[#2F4B4F]/55" />
        <span className={cn("truncate", !value && "text-[#2F4B4F]/40")}>
          {value || "Search for an address"}
        </span>
      </button>
    </div>
  );
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
                Searching locations…
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

function CsvContactForm() {
  return (
    <div className="grid gap-5">
      <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-primary bg-fill px-6 py-10 text-center transition hover:bg-secondary/30">
        <Upload className="size-9 text-primary" />
        <span className="mt-4 text-headline font-semibold text-[#2F4B4F]">
          Upload CSV file
        </span>
        <span className="mt-2 max-w-sm text-callout text-[#2F4B4F]/65">
          Use columns for name, email, phone number, country code, and tags.
        </span>
        <input accept=".csv,text/csv" className="sr-only" type="file" />
      </label>

      <div className="rounded-md border border-border bg-fill p-4">
        <p className="text-headline font-semibold text-[#2F4B4F]">CSV format</p>
        <p className="mt-2 text-callout text-[#2F4B4F]/70">
          Required columns: name and either email or phone number. Optional
          columns: country code, status, and tags.
        </p>
      </div>
    </div>
  );
}
