import * as React from "react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Plus,
  X,
} from "lucide-react";
import {
  AppCheckbox,
  AppSelectField,
  AppTextField,
  Button,
  PhoneNumberField,
  cn,
} from "@piya/ui";
import {
  showToast,
  useBulkCreateContactsMutation,
  useGetContactTagsQuery,
  type AppDispatch,
} from "@piya/shared";
import type {
  BulkCreateContactsPayload,
  CreateContactInput,
  UserGenderType,
} from "@piya/shared/types";
import { useDispatch } from "react-redux";
import {
  CONTACT_GENDER_OPTIONS,
  DEFAULT_CONTACT_TAGS,
  MAX_CONTACT_TAGS,
} from "../constants";

type CsvImportStep = "upload" | "map" | "review";
type CsvDestinationColumn =
  | "ignore"
  | "name"
  | "email"
  | "phoneNumber"
  | "tags"
  | "gender";

type CsvColumnMap = {
  destinationColumn: CsvDestinationColumn;
  fileColumn: string;
  id: string;
  include: boolean;
  sampleData: string[];
};

type CsvContactDraft = {
  email: string;
  gender: UserGenderType | "";
  id: string;
  name: string;
  phoneNumber: string;
  tags: string[];
};

type CsvContactImportWorkflowProps = {
  onClose: () => void;
};

const csvImportSteps: { key: CsvImportStep; label: string }[] = [
  { key: "upload", label: "Upload" },
  { key: "map", label: "Map column" },
  { key: "review", label: "Review" },
];

const destinationColumnOptions: {
  label: string;
  value: CsvDestinationColumn;
}[] = [
  { label: "Select one", value: "ignore" },
  { label: "Name", value: "name" },
  { label: "Email", value: "email" },
  { label: "Phone", value: "phoneNumber" },
  { label: "Tags", value: "tags" },
  { label: "Gender", value: "gender" },
];

export function CsvContactImportWorkflow({
  onClose,
}: CsvContactImportWorkflowProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [bulkCreateContacts, bulkCreateContactsState] =
    useBulkCreateContactsMutation();
  const [activeStep, setActiveStep] = React.useState<CsvImportStep>("upload");
  const [contactDrafts, setContactDrafts] = React.useState<CsvContactDraft[]>(
    []
  );
  const [csvError, setCsvError] = React.useState("");
  const [fileName, setFileName] = React.useState("");
  const [isParsingCsv, setIsParsingCsv] = React.useState(false);
  const [mappings, setMappings] = React.useState<CsvColumnMap[]>([]);
  const [rows, setRows] = React.useState<string[][]>([]);
  const [importResult, setImportResult] =
    React.useState<BulkCreateContactsPayload | null>(null);
  const canReview = mappings.some(
    (mapping) => mapping.include && mapping.destinationColumn !== "ignore"
  );
  const hasInvalidReviewContact = contactDrafts.some(
    (contact) =>
      !contact.name.trim() ||
      (!contact.email.trim() && !contact.phoneNumber.trim())
  );
  const exceedsBulkLimit = contactDrafts.length > 1000;

  async function selectImportFile(file: File | undefined) {
    if (!file) return;

    setCsvError("");
    setIsParsingCsv(true);

    try {
      const parsedRows = await getContactImportRows(file);
      const headerRow = parsedRows[0] ?? [];
      const dataRows = parsedRows.slice(1).filter((row) =>
        row.some((cell) => cell.trim())
      );

      if (headerRow.length === 0 || dataRows.length === 0) {
        setCsvError(
          "Upload a CSV or XLSX file with a header row and at least one contact."
        );
        return;
      }

      setFileName(file.name);
      setRows(dataRows);
      setMappings(createColumnMaps(headerRow, dataRows));
      setContactDrafts([]);
      setActiveStep("map");
    } catch (error) {
      setCsvError(
        error instanceof Error
          ? error.message
          : "Unable to read this file. Please check the file format."
      );
    } finally {
      setIsParsingCsv(false);
    }
  }

  function updateMapping(columnId: string, updates: Partial<CsvColumnMap>) {
    setMappings((current) =>
      current.map((mapping) =>
        mapping.id === columnId
          ? {
              ...mapping,
              ...updates,
              include:
                updates.destinationColumn === "ignore"
                  ? false
                  : updates.destinationColumn
                    ? true
                    : updates.include ?? mapping.include,
            }
          : mapping
      )
    );
  }

  function continueToReview() {
    const nextDrafts = createContactDrafts(rows, mappings);
    setContactDrafts(nextDrafts);
    setImportResult(null);
    setActiveStep("review");
  }

  function updateContactDraft(
    contactId: string,
    updates: Partial<CsvContactDraft>
  ) {
    setContactDrafts((current) =>
      current.map((contact) =>
        contact.id === contactId ? { ...contact, ...updates } : contact
      )
    );
  }

  async function importReviewedContacts() {
    if (
      contactDrafts.length === 0 ||
      contactDrafts.length > 1000 ||
      hasInvalidReviewContact
    ) {
      return;
    }

    try {
      const result = await bulkCreateContacts({
        contacts: contactDrafts.map(createContactInputFromDraft),
      }).unwrap();

      setImportResult(result);
      showToast(dispatch, {
        message: `Imported ${result.createdCount} of ${result.total} contacts.`,
        variant: result.createdCount > 0 ? "success" : "info",
      });
    } catch (error) {
      showToast(dispatch, {
        message: getImportErrorMessage(error),
        variant: "error",
      });
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      <CsvImportStepper activeStep={activeStep} />

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {activeStep === "upload" ? (
          <CsvUploadStep
            csvError={csvError}
            isParsingCsv={isParsingCsv}
            onFileSelect={(file) => void selectImportFile(file)}
          />
        ) : null}

        {activeStep === "map" ? (
          <CsvMapStep
            fileName={fileName}
            mappings={mappings}
            onMappingChange={updateMapping}
            rowCount={rows.length}
          />
        ) : null}

        {activeStep === "review" ? (
          <CsvReviewStep
            contactDrafts={contactDrafts}
            importResult={importResult}
            onContactChange={updateContactDraft}
            hasInvalidContact={hasInvalidReviewContact}
            exceedsBulkLimit={exceedsBulkLimit}
          />
        ) : null}
      </div>

      <div className="-mx-6 -mb-6 flex shrink-0 items-center justify-between gap-3 border-t border-border bg-white p-6">
        <Button
          className="bg-fill text-[#2F4B4F] hover:bg-fill-secondary"
          icon={activeStep === "upload" ? undefined : <ChevronLeft />}
          onClick={() => {
            if (activeStep === "upload") {
              onClose();
            } else if (activeStep === "map") {
              setActiveStep("upload");
            } else {
              setActiveStep("map");
            }
          }}
          type="button"
          variant="secondary"
        >
          {activeStep === "upload" ? "Cancel" : "Back"}
        </Button>

        {activeStep === "map" ? (
          <Button
            disabled={!canReview}
            icon={<ChevronRight />}
            onClick={continueToReview}
            type="button"
          >
            Review contacts
          </Button>
        ) : null}

        {activeStep === "review" ? (
          <Button
            buttonState={
              bulkCreateContactsState.isLoading ? "loading" : "enabled"
            }
            disabled={
              contactDrafts.length === 0 ||
              hasInvalidReviewContact ||
              exceedsBulkLimit ||
              bulkCreateContactsState.isLoading
            }
            icon={<Check />}
            loadingLabel="Importing contacts"
            onClick={() => void importReviewedContacts()}
            type="button"
          >
            Import contacts
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function CsvImportStepper({ activeStep }: { activeStep: CsvImportStep }) {
  const activeIndex = csvImportSteps.findIndex((step) => step.key === activeStep);

  return (
    <div className="flex items-center justify-center overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {csvImportSteps.map((step, index) => {
        const isActive = index === activeIndex;
        const isComplete = index < activeIndex;

        return (
          <React.Fragment key={step.key}>
            <div className="flex shrink-0 items-center gap-2">
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border text-footnote font-semibold",
                  isActive
                    ? "border-primary bg-primary text-white"
                    : isComplete
                      ? "border-primary bg-secondary text-primary"
                      : "border-border bg-white text-[#2F4B4F]/55"
                )}
              >
                {isComplete ? <Check className="size-4" /> : index + 1}
              </span>
              <span
                className={cn(
                  "whitespace-nowrap text-callout font-semibold",
                  isActive || isComplete
                    ? "text-primary"
                    : "text-[#2F4B4F]/55"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < csvImportSteps.length - 1 ? (
              <span
                className={cn(
                  "mx-3 h-px w-12 shrink-0",
                  isComplete ? "bg-primary" : "bg-border"
                )}
              />
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function CsvUploadStep({
  csvError,
  isParsingCsv,
  onFileSelect,
}: {
  csvError: string;
  isParsingCsv: boolean;
  onFileSelect: (file: File | undefined) => void;
}) {
  return (
    <div className="mx-auto grid w-full max-w-xl gap-5 pb-24">
      <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-primary bg-fill px-6 py-10 text-center transition hover:bg-secondary/30">
        <FileSpreadsheet className="size-10 text-primary" />
        <span className="mt-4 text-headline font-semibold text-[#2F4B4F]">
          Upload CSV or XLSX file
        </span>
        <span className="mt-2 max-w-sm text-callout text-[#2F4B4F]/65">
          Use a header row with columns for name, email, phone, tags, and
          gender.
        </span>
        <input
          accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="sr-only"
          disabled={isParsingCsv}
          onChange={(event) => onFileSelect(event.target.files?.[0])}
          type="file"
        />
      </label>

      {csvError ? (
        <p className="rounded-md border border-error/20 bg-error/10 p-3 text-callout text-error">
          {csvError}
        </p>
      ) : null}

    </div>
  );
}

function CsvMapStep({
  fileName,
  mappings,
  onMappingChange,
  rowCount,
}: {
  fileName: string;
  mappings: CsvColumnMap[];
  onMappingChange: (columnId: string, updates: Partial<CsvColumnMap>) => void;
  rowCount: number;
}) {
  return (
    <div className="grid gap-4 pb-24">
    

      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full table-fixed border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-fill/70 text-caption-1 text-[#2F4B4F]/65">
              <th className="w-[32%] px-2 py-3 font-semibold">
                Your file column
              </th>
              <th className="w-[27%] px-2 py-3 font-semibold">
                Your sample data
              </th>
              <th className="w-[27%] px-2 py-3 font-semibold">
                Destination column
              </th>
              <th className="w-[14%] px-2 py-3 text-center font-semibold">
                Include
              </th>
            </tr>
          </thead>
          <tbody>
            {mappings.map((mapping) => (
              <tr className="border-b border-border last:border-0" key={mapping.id}>
                <td className="px-2 py-3 text-callout font-semibold text-[#2F4B4F]">
                  <span className="block truncate">
                    {mapping.fileColumn || "Untitled column"}
                  </span>
                </td>
                <td className="px-2 py-3 text-callout text-[#2F4B4F]/70">
                  <span className="block truncate">
                    {mapping.sampleData.filter(Boolean).join(", ") || "-"}
                  </span>
                </td>
                <td className="px-2 py-3">
                  <AppSelectField
                    aria-label={`Destination column for ${mapping.fileColumn}`}
                    label=""
                    onChange={(event) =>
                      onMappingChange(mapping.id, {
                        destinationColumn: event.target
                          .value as CsvDestinationColumn,
                      })
                    }
                    options={destinationColumnOptions}
                    selectClassName="h-10"
                    value={mapping.destinationColumn}
                  />
                </td>
                <td className="px-2 py-3">
                  <AppCheckbox
                    className="mx-auto"
                    checked={mapping.include}
                    disabled={mapping.destinationColumn === "ignore"}
                    label={`Include ${mapping.fileColumn}`}
                    onCheckedChange={(include) =>
                      onMappingChange(mapping.id, { include })
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CsvReviewStep({
  contactDrafts,
  exceedsBulkLimit,
  hasInvalidContact,
  importResult,
  onContactChange,
}: {
  contactDrafts: CsvContactDraft[];
  exceedsBulkLimit: boolean;
  hasInvalidContact: boolean;
  importResult: BulkCreateContactsPayload | null;
  onContactChange: (contactId: string, updates: Partial<CsvContactDraft>) => void;
}) {
  const [openContactIds, setOpenContactIds] = React.useState<Set<string>>(
    () => new Set(contactDrafts.slice(0, 1).map((contact) => contact.id))
  );

  React.useEffect(() => {
    setOpenContactIds(new Set(contactDrafts.slice(0, 1).map((contact) => contact.id)));
  }, [contactDrafts]);

  function toggleContact(contactId: string) {
    setOpenContactIds((current) => {
      const next = new Set(current);
      if (next.has(contactId)) next.delete(contactId);
      else next.add(contactId);
      return next;
    });
  }

  return (
    <div className="grid gap-4 pb-24">
      {exceedsBulkLimit ? (
        <p className="rounded-md border border-error/20 bg-error/10 p-3 text-callout text-error">
          Bulk import supports up to 1000 contacts per upload.
        </p>
      ) : null}

      {hasInvalidContact ? (
        <p className="rounded-md border border-error/20 bg-error/10 p-3 text-callout text-error">
          Each contact needs a name and either an email address or phone number.
        </p>
      ) : null}

      {importResult ? (
        <p className="rounded-md border border-primary/20 bg-secondary/30 p-3 text-callout text-primary">
          Imported {importResult.createdCount} of {importResult.total} contacts.
          {importResult.duplicateCount > 0
            ? ` ${importResult.duplicateCount} duplicate${
                importResult.duplicateCount === 1 ? "" : "s"
              } skipped.`
            : ""}
        </p>
      ) : null}

      <div className="grid gap-2">
        {contactDrafts.map((contact, index) => {
          const isOpen = openContactIds.has(contact.id);

          return (
            <div
              className="overflow-hidden rounded-md border border-border bg-white"
              key={contact.id}
            >
              <button
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 bg-fill/60 px-4 py-3 text-left transition hover:bg-fill"
                onClick={() => toggleContact(contact.id)}
                type="button"
              >
                <span className="min-w-0">
                  <span className="block truncate text-callout font-semibold text-[#2F4B4F]">
                    {contact.name || `Contact ${index + 1}`}
                  </span>
                  <span className="mt-1 block truncate text-footnote text-[#2F4B4F]/60">
                    {[contact.email, contact.phoneNumber].filter(Boolean).join(" | ") ||
                      "No email or phone"}
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    "size-5 shrink-0 text-[#2F4B4F]/60 transition",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              {isOpen ? (
                <div className="grid gap-4 p-4">
                  <div className="grid gap-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <AppTextField
                      label="Name"
                      onChange={(event) =>
                        onContactChange(contact.id, {
                          name: event.target.value,
                        })
                      }
                      placeholder="Enter name"
                      value={contact.name}
                    />
                    <PhoneNumberField
                      label="Phone"
                      onChange={(phoneNumber) =>
                        onContactChange(contact.id, { phoneNumber })
                      }
                      placeholder="Enter phone"
                      value={contact.phoneNumber}
                    />
                  </div>
                  <AppTextField
                    label="Email"
                    onChange={(event) =>
                      onContactChange(contact.id, { email: event.target.value })
                    }
                    placeholder="Enter email"
                    type="email"
                    value={contact.email}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <AppSelectField
                      label="Gender"
                      onChange={(event) =>
                        onContactChange(contact.id, {
                          gender: event.target.value as UserGenderType | "",
                        })
                      }
                      options={CONTACT_GENDER_OPTIONS}
                      value={contact.gender}
                    />
                    <CsvReviewTagField
                      onChange={(tags) => onContactChange(contact.id, { tags })}
                      tags={contact.tags}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CsvReviewTagField({
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

function createColumnMaps(headers: string[], dataRows: string[][]) {
  return headers.map((header, index) => {
    const destinationColumn = getDestinationColumnForHeader(header);

    return {
      destinationColumn,
      fileColumn: header.trim() || `Column ${index + 1}`,
      id: `${index}-${header || "column"}`,
      include: destinationColumn !== "ignore",
      sampleData: dataRows.slice(0, 5).map((row) => row[index] ?? ""),
    };
  });
}

function createContactDrafts(rows: string[][], mappings: CsvColumnMap[]) {
  const includedMappings = mappings.filter(
    (mapping) => mapping.include && mapping.destinationColumn !== "ignore"
  );

  return rows
    .map((row, rowIndex) => {
      const contact: CsvContactDraft = {
        email: "",
        gender: "",
        id: `csv-contact-${rowIndex}`,
        name: "",
        phoneNumber: "",
        tags: [],
      };

      includedMappings.forEach((mapping) => {
        const columnIndex = mappings.findIndex(
          (candidate) => candidate.id === mapping.id
        );
        const value = row[columnIndex]?.trim() ?? "";

        if (mapping.destinationColumn === "name") contact.name = value;
        if (mapping.destinationColumn === "email") contact.email = value;
        if (mapping.destinationColumn === "phoneNumber") {
          contact.phoneNumber = value;
        }
        if (mapping.destinationColumn === "tags") contact.tags = splitTags(value);
        if (mapping.destinationColumn === "gender") {
          contact.gender = getGenderValue(value);
        }
      });

      return contact;
    })
    .filter((contact) =>
      [contact.name, contact.email, contact.phoneNumber, ...contact.tags].some(
        Boolean
      )
    );
}

function createContactInputFromDraft(
  contact: CsvContactDraft
): CreateContactInput {
  return {
    name: contact.name.trim(),
    email: contact.email.trim() || null,
    phoneNumber: contact.phoneNumber.trim() || null,
    address: null,
    dob: null,
    gender: contact.gender || null,
    tags: contact.tags,
  };
}

function getImportErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Unable to import contacts.";
}

function getDestinationColumnForHeader(header: string): CsvDestinationColumn {
  const normalizedHeader = header.toLocaleLowerCase().replace(/[\s_-]+/g, "");

  if (["name", "fullname", "firstname", "lastname"].includes(normalizedHeader)) {
    return "name";
  }

  if (["email", "emailaddress", "e-mail"].includes(normalizedHeader)) {
    return "email";
  }

  if (
    ["phone", "phonenumber", "phoneNo", "mobile", "cellphone"]
      .map((value) => value.toLocaleLowerCase())
      .includes(normalizedHeader)
  ) {
    return "phoneNumber";
  }

  if (["tag", "tags", "labels"].includes(normalizedHeader)) return "tags";
  if (["gender", "sex"].includes(normalizedHeader)) return "gender";

  return "ignore";
}

function getGenderValue(value: string): UserGenderType | "" {
  const normalizedValue = value.trim().toLocaleLowerCase();

  if (normalizedValue === "male" || normalizedValue === "m") return "male";
  if (normalizedValue === "female" || normalizedValue === "f") return "female";
  if (normalizedValue === "other") return "other";

  return "";
}

async function getContactImportRows(file: File) {
  const fileExtension = getFileExtension(file.name);

  if (fileExtension === "csv" || file.type === "text/csv") {
    return parseCsvText(await file.text());
  }

  if (
    fileExtension === "xlsx" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    return parseXlsxFile(file);
  }

  throw new Error("Upload a CSV or XLSX file.");
}

async function parseXlsxFile(file: File) {
  const XLSX = await import("xlsx");
  const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
  const worksheetName = workbook.SheetNames[0];

  if (!worksheetName) return [];

  const worksheet = workbook.Sheets[worksheetName];
  if (!worksheet) return [];

  const worksheetRows = XLSX.utils.sheet_to_json(worksheet, {
    blankrows: false,
    defval: "",
    header: 1,
    raw: false,
  }) as unknown[][];

  return worksheetRows
    .map((row) => row.map(formatImportCell))
    .filter((row) => row.some((cell) => cell.trim()));
}

function parseCsvText(text: string) {
  const rows: string[][] = [];
  let currentCell = "";
  let currentRow: string[] = [];
  let isInsideQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const nextCharacter = text[index + 1];

    if (character === '"' && isInsideQuotes && nextCharacter === '"') {
      currentCell += '"';
      index += 1;
      continue;
    }

    if (character === '"') {
      isInsideQuotes = !isInsideQuotes;
      continue;
    }

    if (character === "," && !isInsideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = "";
      continue;
    }

    if ((character === "\n" || character === "\r") && !isInsideQuotes) {
      if (character === "\r" && nextCharacter === "\n") index += 1;
      currentRow.push(currentCell.trim());
      rows.push(currentRow);
      currentCell = "";
      currentRow = [];
      continue;
    }

    currentCell += character;
  }

  currentRow.push(currentCell.trim());
  rows.push(currentRow);

  return rows.filter((row) => row.some((cell) => cell.trim()));
}

function formatImportCell(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function getFileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLocaleLowerCase() ?? "";
}

function splitTags(value: string) {
  return value
    .split(/[;,]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 5);
}
