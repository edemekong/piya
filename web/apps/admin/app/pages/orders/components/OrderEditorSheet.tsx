import * as React from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Package,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  AppAvatar,
  AppCheckbox,
  AppSelectField,
  AppSheet,
  AppTextField,
  Button,
  PhoneNumberField,
  cn,
  isValidSupportedPhoneNumber,
} from "@piya/ui";
import {
  showToast,
  useCreateContactMutation,
  useGetAccountSetupQuery,
  useGetContactsQuery,
  useGetOfferingsPageQuery,
  type AppDispatch,
} from "@piya/shared";
import type {
  ContactData,
  OfferingData,
  OrderData,
  OrderItem,
  OrderItemType,
  OrderPaymentMode,
  OrderPaymentStatus,
} from "@piya/shared/models";
import { formatMoney, formatOrderLabel } from "@piya/shared/utils";
import { getOfferingDisplayConfig } from "@/utils/offering-display";
import { useDispatch } from "react-redux";

type OrderEditorSheetProps = {
  onClose: () => void;
  onSave: (order: OrderData) => void;
  open: boolean;
};

type OrderEditorStep = "contact" | "offerings" | "payment";
type ContactPickerMode = "search" | "create";

type SelectedOrderItem = {
  offering: OfferingData;
  quantity: number;
};

const orderEditorSteps: { key: OrderEditorStep; label: string }[] = [
  { key: "contact", label: "Add Contact" },
  { key: "offerings", label: "Add Offerings" },
  { key: "payment", label: "Payment" },
];

const paymentStatusOptions: OrderPaymentStatus[] = [
  "unpaid",
  "paid",
  "partial",
  "refunded",
];

export function OrderEditorSheet({
  onClose,
  onSave,
  open,
}: OrderEditorSheetProps) {
  const { data: accountSetup } = useGetAccountSetupQuery();
  const offeringDisplay = getOfferingDisplayConfig(
    accountSetup?.business?.category ?? null
  );
  const [activeStep, setActiveStep] =
    React.useState<OrderEditorStep>("contact");
  const [contactSearch, setContactSearch] = React.useState("");
  const [offeringSearch, setOfferingSearch] = React.useState("");
  const [contactPickerMode, setContactPickerMode] =
    React.useState<ContactPickerMode>("search");
  const [isContactPickerOpen, setIsContactPickerOpen] = React.useState(false);
  const [isOfferingPickerOpen, setIsOfferingPickerOpen] = React.useState(false);
  const [selectedContact, setSelectedContact] =
    React.useState<ContactData | null>(null);
  const [selectedItems, setSelectedItems] = React.useState<SelectedOrderItem[]>(
    []
  );
  const [paymentMode, setPaymentMode] =
    React.useState<OrderPaymentMode>("pay_now");
  const [paymentStatus, setPaymentStatus] =
    React.useState<OrderPaymentStatus>("unpaid");
  const normalizedContactSearch = contactSearch.trim();
  const normalizedOfferingSearch = offeringSearch.trim();
  const { data: contactsPage, isFetching: isFetchingContacts } =
    useGetContactsQuery(
      {
        limit: normalizedContactSearch ? 10 : 5,
        query: normalizedContactSearch || undefined,
      },
      {
        skip: !open || !isContactPickerOpen || contactPickerMode !== "search",
      }
    );
  const { data: offeringsPage, isFetching: isFetchingOfferings } =
    useGetOfferingsPageQuery(
      {
        limit: normalizedOfferingSearch ? 10 : 5,
        query: normalizedOfferingSearch || undefined,
      },
      { skip: !open || !isOfferingPickerOpen }
    );
  const contacts = contactsPage?.contacts ?? [];
  const offerings = offeringsPage?.offerings ?? [];
  const activeStepIndex = orderEditorSteps.findIndex(
    (step) => step.key === activeStep
  );
  const isFinalStep = activeStepIndex === orderEditorSteps.length - 1;
  const currency = selectedItems[0]?.offering.currency ?? "NGN";
  const subtotal = getOrderSubtotal(selectedItems);
  const total = subtotal;
  const paymentModeOptions = getPaymentModeOptions(selectedItems);
  const canContinue =
    activeStep === "contact"
      ? Boolean(selectedContact)
      : activeStep === "offerings"
      ? selectedItems.length > 0
      : true;
  const canSave =
    Boolean(selectedContact) &&
    selectedItems.length > 0 &&
    Boolean(paymentMode);

  React.useEffect(() => {
    if (!open) return;

    setActiveStep("contact");
    setContactSearch("");
    setOfferingSearch("");
    setContactPickerMode("search");
    setIsContactPickerOpen(false);
    setIsOfferingPickerOpen(false);
    setSelectedContact(null);
    setSelectedItems([]);
    setPaymentMode("pay_now");
    setPaymentStatus("unpaid");
  }, [open]);

  React.useEffect(() => {
    if (
      paymentModeOptions.length > 0 &&
      !paymentModeOptions.some((option) => option.value === paymentMode)
    ) {
      setPaymentMode(paymentModeOptions[0].value);
    }
  }, [paymentMode, paymentModeOptions]);

  function goToPreviousStep() {
    if (activeStepIndex === 0) {
      onClose();
      return;
    }

    setActiveStep(orderEditorSteps[activeStepIndex - 1].key);
  }

  function goToNextStep() {
    if (!canContinue || activeStepIndex >= orderEditorSteps.length - 1) return;

    setActiveStep(orderEditorSteps[activeStepIndex + 1].key);
  }

  function toggleOffering(offering: OfferingData) {
    setSelectedItems((current) =>
      current.some((item) => item.offering.id === offering.id)
        ? current.filter((item) => item.offering.id !== offering.id)
        : [...current, { offering, quantity: 1 }]
    );
  }

  function updateQuantity(offeringId: string, quantity: number) {
    setSelectedItems((current) =>
      current.map((item) =>
        item.offering.id === offeringId
          ? { ...item, quantity: Math.max(1, quantity || 1) }
          : item
      )
    );
  }

  function handleSave() {
    if (!selectedContact || !canSave) return;

    onSave(
      createOrder({
        contact: selectedContact,
        currency,
        items: selectedItems,
        paymentMode,
        paymentStatus,
        subtotal,
        total,
      })
    );
    onClose();
  }

  return (
    <AppSheet
      ariaLabel="create order sheet"
      footer={
        <>
          <Button
            className="bg-fill text-[#2F4B4F] hover:bg-fill-secondary"
            icon={activeStepIndex === 0 ? undefined : <ChevronLeft />}
            onClick={goToPreviousStep}
            type="button"
            variant="secondary"
          >
            {activeStepIndex === 0 ? "Cancel" : "Back"}
          </Button>
          {!isFinalStep ? (
            <Button
              disabled={!canContinue}
              icon={<ChevronRight />}
              onClick={goToNextStep}
              type="button"
            >
              Continue
            </Button>
          ) : (
            <Button
              disabled={!canSave}
              icon={<CheckCircle2 />}
              onClick={handleSave}
              type="button"
            >
              Create order
            </Button>
          )}
        </>
      }
      maxWidthClassName="max-w-2xl"
      onClose={onClose}
      open={open}
      title="Create order"
    >
      <form className="grid gap-4">
        <OrderEditorStepper activeStep={activeStep} />

        {activeStep === "contact" ? (
          <section className="grid gap-3">
            <h3 className="text-callout font-semibold text-[#2F4B4F]">
              Contact
            </h3>
            {selectedContact ? (
              <SelectedContact
                contact={selectedContact}
                onChange={() => {
                  setContactPickerMode("search");
                  setIsContactPickerOpen(true);
                }}
              />
            ) : (
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    setContactPickerMode("search");
                    setIsContactPickerOpen(true);
                  }}
                  type="button"
                >
                  Select contact
                </Button>
              </div>
            )}
          </section>
        ) : null}

        {activeStep === "offerings" ? (
          <div className="grid gap-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-callout font-semibold text-[#2F4B4F]">
                {offeringDisplay.plural}
              </h3>
              <Button
                icon={<Plus />}
                onClick={() => setIsOfferingPickerOpen(true)}
                type="button"
                variant="secondary"
              >
                Add {offeringDisplay.plural.toLowerCase()}
              </Button>
            </div>
            {selectedItems.length ? (
              <OrderItemsTable
                currency={currency}
                items={selectedItems}
                onQuantityChange={updateQuantity}
                onRemove={(offeringId) =>
                  setSelectedItems((current) =>
                    current.filter((item) => item.offering.id !== offeringId)
                  )
                }
              />
            ) : null}
          </div>
        ) : null}

        {activeStep === "payment" ? (
          <section className="grid gap-5">
            <OrderItemsTable
              currency={currency}
              items={selectedItems}
              onQuantityChange={updateQuantity}
              onRemove={(offeringId) =>
                setSelectedItems((current) =>
                  current.filter((item) => item.offering.id !== offeringId)
                )
              }
            />

            <div className="grid gap-4 rounded-md border border-border bg-white p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <AppSelectField
                  label="Payment mode"
                  onChange={(event) =>
                    setPaymentMode(event.target.value as OrderPaymentMode)
                  }
                  options={paymentModeOptions}
                  value={paymentMode}
                />
                <AppSelectField
                  label="Payment status"
                  onChange={(event) =>
                    setPaymentStatus(event.target.value as OrderPaymentStatus)
                  }
                  options={paymentStatusOptions.map((status) => ({
                    label: formatOrderLabel(status),
                    value: status,
                  }))}
                  value={paymentStatus}
                />
              </div>

              <div className="ml-auto grid w-full max-w-sm gap-3 border-t border-border pt-4">
                <SummaryRow
                  label="Subtotal"
                  value={formatMoney(subtotal, currency)}
                />
                <SummaryRow
                  emphasized
                  label="Total"
                  value={formatMoney(total, currency)}
                />
              </div>
            </div>
          </section>
        ) : null}
      </form>

      <SelectionPopup
        emptyLabel="No contacts found."
        isFetching={isFetchingContacts}
        loadingLabel="Loading contacts..."
        maxWidthClassName="max-w-2xl"
        onClose={() => {
          setContactPickerMode("search");
          setIsContactPickerOpen(false);
        }}
        onSearchChange={setContactSearch}
        open={isContactPickerOpen}
        searchPlaceholder="Search contacts"
        searchValue={contactSearch}
        showSearch={contactPickerMode === "search"}
        title={
          contactPickerMode === "create" ? "Add contact" : "Select contact"
        }
      >
        {contactPickerMode === "create" ? (
          <QuickCreateContactForm
            onCancel={() => setContactPickerMode("search")}
            onCreated={(contact) => {
              setSelectedContact(contact);
              setContactPickerMode("search");
              setIsContactPickerOpen(false);
            }}
          />
        ) : contacts.length ? (
          contacts.map((contact) => (
            <ContactPickerRow
              checked={selectedContact?.id === contact.id}
              contact={contact}
              key={contact.id}
              onSelect={() => {
                setSelectedContact(contact);
                setIsContactPickerOpen(false);
              }}
            />
          ))
        ) : normalizedContactSearch && !isFetchingContacts ? (
          <ContactNotFound onAdd={() => setContactPickerMode("create")} />
        ) : null}
      </SelectionPopup>

      <SelectionPopup
        emptyLabel={`No ${offeringDisplay.plural.toLowerCase()} found.`}
        isFetching={isFetchingOfferings}
        loadingLabel={`Loading ${offeringDisplay.plural.toLowerCase()}...`}
        onClose={() => setIsOfferingPickerOpen(false)}
        onDone={() => setIsOfferingPickerOpen(false)}
        onSearchChange={setOfferingSearch}
        open={isOfferingPickerOpen}
        searchPlaceholder={`Search ${offeringDisplay.plural.toLowerCase()}`}
        searchValue={offeringSearch}
        selectedCount={selectedItems.length}
        title={`Select ${offeringDisplay.plural.toLowerCase()}`}
      >
        {offerings.map((offering) => (
          <OfferingPickerRow
            checked={selectedItems.some(
              (item) => item.offering.id === offering.id
            )}
            key={offering.id}
            offering={offering}
            onToggle={() => toggleOffering(offering)}
          />
        ))}
      </SelectionPopup>
    </AppSheet>
  );
}

function OrderEditorStepper({ activeStep }: { activeStep: OrderEditorStep }) {
  const activeIndex = orderEditorSteps.findIndex(
    (step) => step.key === activeStep
  );

  return (
    <div className="flex w-full items-center gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {orderEditorSteps.map((step, index) => {
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
                {isComplete ? <CheckCircle2 className="size-4" /> : index + 1}
              </span>
              <span
                className={cn(
                  "whitespace-nowrap text-callout font-semibold",
                  isActive || isComplete ? "text-primary" : "text-[#2F4B4F]/55"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < orderEditorSteps.length - 1 ? (
              <span
                className={cn(
                  "h-px min-w-8 flex-1",
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

function SelectedContact({
  contact,
  onChange,
}: {
  contact: ContactData;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center gap-3 py-1">
      <AppAvatar
        className="size-11 text-callout !text-white"
        imageUrl={contact.profileImageUrl}
        name={contact.name}
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-callout font-semibold text-[#2F4B4F]">
          {contact.name}
        </span>
        <span className="mt-1 block truncate text-caption-1 text-[#2F4B4F]/60">
          {contact.email ?? contact.phoneNumber ?? "No contact details"}
        </span>
      </span>
      <Button onClick={onChange} type="button" variant="secondary">
        Change
      </Button>
    </div>
  );
}

function ContactNotFound({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="grid justify-items-center gap-3 px-4 py-8 text-center">
      <p className="max-w-sm text-callout text-[#2F4B4F]/65">
        We did not find the contact you&apos;re looking for.
      </p>
      <Button onClick={onAdd} type="button">
        Add instead
      </Button>
    </div>
  );
}

function QuickCreateContactForm({
  onCancel,
  onCreated,
}: {
  onCancel: () => void;
  onCreated: (contact: ContactData) => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [createContact, createContactState] = useCreateContactMutation();
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [submitAttempted, setSubmitAttempted] = React.useState(false);
  const hasContactMethod = Boolean(email.trim() || phoneNumber.trim());
  const hasValidPhoneNumber =
    !phoneNumber.trim() || isValidSupportedPhoneNumber(phoneNumber);
  const canCreate =
    Boolean(name.trim()) && hasContactMethod && hasValidPhoneNumber;

  async function submitContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitAttempted(true);

    if (!canCreate) return;

    try {
      const contact = await createContact({
        email: email.trim() || null,
        name: name.trim(),
        phoneNumber: phoneNumber || null,
        tags: [],
      }).unwrap();

      showToast(dispatch, {
        message: "Contact created.",
        variant: "success",
      });
      onCreated(contact);
    } catch {
      showToast(dispatch, {
        message: "Unable to create contact.",
        variant: "error",
      });
    }
  }

  return (
    <form
      className="grid min-w-0 gap-4 p-1"
      onSubmit={(event) => void submitContact(event)}
    >
      <AppTextField
        label="Name"
        onChange={(event) => setName(event.target.value)}
        placeholder="Enter contact name"
        required
        value={name}
      />
      <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="min-w-0">
          <AppTextField
            label="Email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter email address"
            type="email"
            value={email}
          />
        </div>
        <div className="min-w-0">
          <PhoneNumberField
            label="Phone"
            onChange={setPhoneNumber}
            placeholder="Enter phone number"
            value={phoneNumber}
          />
        </div>
      </div>
      {submitAttempted && !hasContactMethod ? (
        <p className="text-footnote text-error">
          Enter an email address or phone number.
        </p>
      ) : null}
      {submitAttempted && !hasValidPhoneNumber ? (
        <p className="text-footnote text-error">Enter a valid phone number.</p>
      ) : null}
      <div className="flex justify-end gap-3 pt-1">
        <Button onClick={onCancel} type="button" variant="secondary">
          Back
        </Button>
        <Button
          buttonState={createContactState.isLoading ? "loading" : "enabled"}
          disabled={!canCreate}
          loadingLabel="Creating contact"
          type="submit"
        >
          Create contact
        </Button>
      </div>
    </form>
  );
}

function SelectionPopup({
  children,
  emptyLabel,
  isFetching,
  loadingLabel,
  maxWidthClassName = "max-w-xl",
  onClose,
  onDone,
  onSearchChange,
  open,
  searchPlaceholder,
  searchValue,
  selectedCount,
  showSearch = true,
  title,
}: {
  children: React.ReactNode;
  emptyLabel: string;
  isFetching: boolean;
  loadingLabel: string;
  maxWidthClassName?: string;
  onClose: () => void;
  onDone?: () => void;
  onSearchChange: (value: string) => void;
  open: boolean;
  searchPlaceholder: string;
  searchValue: string;
  selectedCount?: number;
  showSearch?: boolean;
  title: string;
}) {
  if (!open) return null;
  const hasChildren = React.Children.count(children) > 0;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#102A2D]/45 p-4">
      <button
        aria-label={`Close ${title}`}
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />
      <div
        aria-modal="true"
        className={cn(
          "relative flex max-h-[78vh] w-full flex-col overflow-hidden rounded-md bg-white text-[#2F4B4F] shadow-xl",
          maxWidthClassName
        )}
        role="dialog"
      >
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
          <h2 className="text-title-3 font-semibold text-[#2F4B4F]">{title}</h2>
          <button
            aria-label="Close"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-fill text-[#2F4B4F] transition hover:bg-secondary"
            onClick={onClose}
            type="button"
          >
            <X className="size-4" />
          </button>
        </div>

        {showSearch ? (
          <div className="border-b border-border p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#2F4B4F]/50" />
              <input
                autoFocus
                className="h-11 w-full rounded-sm border border-border bg-fill pl-10 pr-3 text-callout text-[#2F4B4F] outline-none transition placeholder:text-[#2F4B4F]/40 focus:border-primary focus:bg-white"
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder={searchPlaceholder}
                type="search"
                value={searchValue}
              />
            </div>
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          {isFetching ? (
            <PickerMessage>{loadingLabel}</PickerMessage>
          ) : hasChildren ? (
            <div className="grid gap-1">{children}</div>
          ) : (
            <PickerMessage>{emptyLabel}</PickerMessage>
          )}
        </div>

        {onDone ? (
          <div className="flex items-center justify-between gap-3 border-t border-border p-4">
            <span className="text-caption-1 font-semibold text-[#2F4B4F]/65">
              {selectedCount ?? 0} selected
            </span>
            <Button onClick={onDone} type="button">
              Done
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function PickerMessage({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-md bg-fill px-4 py-3 text-callout text-[#2F4B4F]/65">
      {children}
    </p>
  );
}

function ContactPickerRow({
  checked,
  contact,
  onSelect,
}: {
  checked: boolean;
  contact: ContactData;
  onSelect: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-md px-3 py-3 transition hover:bg-fill">
      <AppCheckbox
        checked={checked}
        label={`Select ${contact.name}`}
        onCheckedChange={onSelect}
      />
      <button
        className="flex min-w-0 flex-1 items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        onClick={onSelect}
        type="button"
      >
        <AppAvatar
          className="size-11 text-callout !text-white"
          imageUrl={contact.profileImageUrl}
          name={contact.name}
        />
        <span className="min-w-0">
          <span className="block truncate text-callout font-semibold text-[#2F4B4F]">
            {contact.name}
          </span>
          <span className="mt-1 block truncate text-caption-1 text-[#2F4B4F]/60">
            {contact.email ?? contact.phoneNumber ?? "No contact details"}
          </span>
        </span>
      </button>
    </div>
  );
}

function OfferingPickerRow({
  checked,
  offering,
  onToggle,
}: {
  checked: boolean;
  offering: OfferingData;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-md px-3 py-3 transition hover:bg-fill">
      <AppCheckbox
        checked={checked}
        label={`Select ${offering.name}`}
        onCheckedChange={onToggle}
      />
      <button
        className="flex min-w-0 flex-1 items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        onClick={onToggle}
        type="button"
      >
        <OfferingImage offering={offering} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-callout font-semibold text-[#2F4B4F]">
            {offering.name}
          </span>
          <span className="mt-1 block truncate text-caption-1 text-[#2F4B4F]/60">
            {offering.category?.name ?? offering.subType ?? "No category"}
          </span>
        </span>
        <span className="shrink-0 text-callout font-semibold text-[#2F4B4F]">
          {formatMoney(offering.price ?? 0, offering.currency ?? "NGN")}
        </span>
      </button>
    </div>
  );
}

function OfferingImage({ offering }: { offering: OfferingData }) {
  const imageUrl = offering.imageUrls?.[0];

  return imageUrl ? (
    <img
      alt=""
      className="size-11 shrink-0 rounded-md object-cover"
      src={imageUrl}
    />
  ) : (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-fill text-[#2F4B4F]/55">
      <Package className="size-5" />
    </span>
  );
}

function OrderItemsTable({
  currency,
  items,
  onQuantityChange,
  onRemove,
}: {
  currency: string;
  items: SelectedOrderItem[];
  onQuantityChange: (offeringId: string, quantity: number) => void;
  onRemove: (offeringId: string) => void;
}) {
  return (
    <section className="grid gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-callout font-semibold text-[#2F4B4F]">
          Order items
        </h3>
        <span className="text-caption-1 font-semibold text-[#2F4B4F]/60">
          {items.length} selected
        </span>
      </div>
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-[38rem] table-fixed border-collapse bg-white text-left">
          <colgroup>
            <col className="w-[42%]" />
            <col className="w-[18%]" />
            <col className="w-[16%]" />
            <col className="w-[18%]" />
            <col className="w-12" />
          </colgroup>
          <thead>
            <tr className="border-b border-border bg-fill text-caption-1 text-[#2F4B4F]/60">
              {["Item", "Unit price", "Quantity", "Total", ""].map(
                (header, index) => (
                  <th
                    className="px-3 py-2 font-semibold"
                    key={`${header}-${index}`}
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {items.map(({ offering, quantity }) => {
              const unitPrice = offering.price ?? 0;

              return (
                <tr
                  className="border-b border-border last:border-0"
                  key={offering.id}
                >
                  <td className="px-3 py-2">
                    <div className="flex min-w-0 items-center gap-3">
                      <OfferingImage offering={offering} />
                      <span className="min-w-0">
                        <span className="block truncate text-callout font-semibold text-[#2F4B4F]">
                          {offering.name}
                        </span>
                        <span className="mt-1 block truncate text-caption-1 text-[#2F4B4F]/60">
                          {offering.category?.name ??
                            offering.subType ??
                            "No category"}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-callout text-[#2F4B4F]">
                    {formatMoney(unitPrice, offering.currency ?? currency)}
                  </td>
                  <td className="p-2">
                    <input
                      aria-label={`${offering.name} quantity`}
                      className="h-10 w-full rounded-sm border border-border bg-white px-2 text-callout text-[#2F4B4F] outline-none transition focus:border-primary"
                      min={1}
                      onChange={(event) =>
                        onQuantityChange(
                          offering.id,
                          Number(event.target.value)
                        )
                      }
                      type="number"
                      value={quantity}
                    />
                  </td>
                  <td className="px-3 py-2 text-callout font-semibold text-[#2F4B4F]">
                    {formatMoney(
                      unitPrice * quantity,
                      offering.currency ?? currency
                    )}
                  </td>
                  <td className="p-2">
                    <button
                      aria-label={`Remove ${offering.name}`}
                      className="inline-flex size-8 items-center justify-center rounded-sm text-error transition hover:bg-fill"
                      onClick={() => onRemove(offering.id)}
                      type="button"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SummaryRow({
  emphasized = false,
  label,
  value,
}: {
  emphasized?: boolean;
  label: string;
  value: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 text-callout text-[#2F4B4F]",
        emphasized && "text-title-3 font-semibold"
      )}
    >
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function getOrderSubtotal(items: SelectedOrderItem[]) {
  return items.reduce(
    (sum, item) => sum + (item.offering.price ?? 0) * item.quantity,
    0
  );
}

function getPaymentModeOptions(items: SelectedOrderItem[]) {
  const selectedModes = new Set<OrderPaymentMode>();

  items.forEach(({ offering }) => {
    const modes = offering.commerce?.paymentModes ?? ["pay_now", "pay_later"];
    modes.forEach((mode) => selectedModes.add(mode));
  });

  if (selectedModes.size === 0) {
    selectedModes.add("pay_now");
    selectedModes.add("pay_later");
  }

  return Array.from(selectedModes).map((mode) => ({
    label: formatOrderLabel(mode),
    value: mode,
  }));
}

function createOrder({
  contact,
  currency,
  items,
  paymentMode,
  paymentStatus,
  subtotal,
  total,
}: {
  contact: ContactData;
  currency: string;
  items: SelectedOrderItem[];
  paymentMode: OrderPaymentMode;
  paymentStatus: OrderPaymentStatus;
  subtotal: number;
  total: number;
}): OrderData {
  const createdAt = Date.now();

  return {
    businessId: contact.businessId,
    contact: {
      email: contact.email ?? undefined,
      id: contact.id,
      name: contact.name,
      phoneNumber: contact.phoneNumber ?? undefined,
    },
    createdAt,
    currency,
    id: `ord_${createdAt}`,
    items: items.map((item, index) =>
      createOrderItem(item, `${createdAt}_${index}`)
    ),
    paymentMode,
    paymentStatus,
    shareId: `YIN-${String(createdAt).slice(-5)}`,
    source: "admin",
    status: "draft",
    subtotal,
    total,
    updatedAt: createdAt,
  };
}

function createOrderItem(
  { offering, quantity }: SelectedOrderItem,
  itemId: string
): OrderItem {
  const type = getOrderItemType(offering);
  const base = {
    id: `item_${itemId}`,
    name: offering.name,
    offeringId: offering.id,
    quantity,
    unitPrice: offering.price ?? 0,
  };

  if (type === "appointment" || type === "online_appointment") {
    return {
      ...base,
      sessionCount: quantity,
      type,
    };
  }

  if (type === "event") {
    return {
      ...base,
      attendeeCount: quantity,
      type,
    };
  }

  if (type === "room" || type === "unit") {
    return {
      ...base,
      checkInDate: "",
      checkOutDate: "",
      guestCount: 1,
      type,
    };
  }

  if (type === "delivery" || type === "pickup") {
    return {
      ...base,
      fulfillment: {
        address: "",
        city: "",
        country: "",
        state: "",
      },
      type,
    };
  }

  return {
    ...base,
    type,
  };
}

function getOrderItemType(offering: OfferingData): OrderItemType {
  if (offering.subType) return offering.subType;
  if (offering.type === "service") return "appointment";
  if (offering.type === "accommodation") return "room";
  if (offering.type === "delivery") return "delivery";

  return "physical";
}
