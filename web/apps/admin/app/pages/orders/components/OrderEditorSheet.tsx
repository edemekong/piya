import * as React from "react";
import { CheckCircle2, ChevronDown } from "lucide-react";
import {
  AppDatePicker,
  AppSelectField,
  AppSheet,
  AppTextareaField,
  AppTextField,
  Button,
} from "@piya/ui";
import type {
  OrderData,
  OrderItemType,
  OrderPaymentStatus,
  OrderStatus,
} from "@piya/shared/models";
import type { OrderDraft } from "@/services/orders.service";
import {
  createEmptyOrderDraft,
  draftToOrder,
} from "@/services/orders.service";
import { formatOrderLabel } from "./orderUtils";

type OrderEditorSheetProps = {
  onClose: () => void;
  onSave: (order: OrderData) => void;
  open: boolean;
};

const itemTypeOptions: OrderItemType[] = [
  "physical",
  "digital",
  "event",
  "event_online",
  "consultation",
  "consultation_online",
  "digital_service",
  "delivery",
  "pickup",
];
const statusOptions: OrderStatus[] = [
  "draft",
  "pending",
  "confirmed",
  "in_progress",
  "fulfilled",
  "completed",
  "cancelled",
  "archived",
];
const paymentStatusOptions: OrderPaymentStatus[] = [
  "unpaid",
  "paid",
  "refunded",
  "partial",
];
const currencyOptions = ["NGN", "USD", "GHS", "KES", "ZAR"];
const fulfillmentStatusOptions = [
  "queued",
  "picked_up",
  "in_transit",
  "delivered",
  "delayed",
] satisfies OrderDraft["fulfillmentStatus"][];

export function OrderEditorSheet({
  onClose,
  onSave,
  open,
}: OrderEditorSheetProps) {
  const [draft, setDraft] = React.useState<OrderDraft>(createEmptyOrderDraft);

  React.useEffect(() => {
    if (open) setDraft(createEmptyOrderDraft());
  }, [open]);

  function updateDraft(updates: Partial<OrderDraft>) {
    setDraft((current) => ({ ...current, ...updates }));
  }

  function handleSave() {
    onSave(draftToOrder(draft));
    onClose();
  }

  const showPeopleCount = ["event", "event_online", "consultation", "consultation_online"].includes(
    draft.itemType,
  );
  const showDeliveryFields =
    draft.itemType === "physical" ||
    draft.itemType === "delivery" ||
    draft.itemType === "pickup";
  const canSave = draft.contactName.trim() && draft.itemName.trim();

  return (
    <AppSheet
      ariaLabel="create order sheet"
      footer={
        <>
          <Button onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button
            disabled={!canSave}
            icon={<CheckCircle2 />}
            onClick={handleSave}
            type="button"
          >
            Create order
          </Button>
        </>
      }
      maxWidthClassName="max-w-2xl"
      onClose={onClose}
      open={open}
      title="Create order"
    >
      <form className="grid gap-5">
        <FormSection title="Customer">
          <TextField
            label="Contact / customer"
            onChange={(contactName) => updateDraft({ contactName })}
            placeholder="e.g. Ada Lovelace"
            value={draft.contactName}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Email"
              onChange={(contactEmail) => updateDraft({ contactEmail })}
              placeholder="customer@example.com"
              type="email"
              value={draft.contactEmail}
            />
            <TextField
              label="Phone number"
              onChange={(contactPhoneNumber) =>
                updateDraft({ contactPhoneNumber })
              }
              placeholder="+234 800 000 0000"
              value={draft.contactPhoneNumber}
            />
          </div>
        </FormSection>

        <FormSection title="Order details">
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Item type"
              onChange={(itemType) =>
                updateDraft({ itemType: itemType as OrderItemType })
              }
              options={itemTypeOptions}
              value={draft.itemType}
            />
            <TextField
              label="Items"
              onChange={(itemName) => updateDraft({ itemName })}
              placeholder="e.g. Starter Skincare Kit"
              value={draft.itemName}
            />
            <TextField
              label={showPeopleCount ? "Quantity / sessions" : "Quantity"}
              onChange={(quantity) => updateDraft({ quantity })}
              placeholder="1"
              type="number"
              value={draft.quantity}
            />
            {draft.itemType === "event" || draft.itemType === "event_online" ? (
              <TextField
                label="Attendees"
                onChange={(attendeeCount) => updateDraft({ attendeeCount })}
                placeholder="3"
                type="number"
                value={draft.attendeeCount}
              />
            ) : null}
            {draft.itemType === "consultation" ||
            draft.itemType === "consultation_online" ? (
              <TextField
                label="Seats / sessions"
                onChange={(seatCount) => updateDraft({ seatCount })}
                placeholder="1"
                type="number"
                value={draft.seatCount}
              />
            ) : null}
            <MoneyField
              currency={draft.currency}
              label="Total amount"
              onChange={(unitPrice) => updateDraft({ unitPrice })}
              onCurrencyChange={(currency) => updateDraft({ currency })}
              value={draft.unitPrice}
            />
            <SelectField
              label="Status"
              onChange={(status) => updateDraft({ status: status as OrderStatus })}
              options={statusOptions}
              value={draft.status}
            />
            <SelectField
              label="Payment status"
              onChange={(paymentStatus) =>
                updateDraft({ paymentStatus: paymentStatus as OrderPaymentStatus })
              }
              options={paymentStatusOptions}
              value={draft.paymentStatus}
            />
          </div>
        </FormSection>

        {showDeliveryFields ? (
          <FormSection title="Fulfillment">
            <TextField
              label="Address"
              onChange={(fulfillmentAddress) =>
                updateDraft({ fulfillmentAddress })
              }
              placeholder="Street address"
              value={draft.fulfillmentAddress}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="City"
                onChange={(fulfillmentCity) => updateDraft({ fulfillmentCity })}
                placeholder="Lagos"
                value={draft.fulfillmentCity}
              />
              <TextField
                label="State"
                onChange={(fulfillmentState) =>
                  updateDraft({ fulfillmentState })
                }
                placeholder="Lagos"
                value={draft.fulfillmentState}
              />
              <TextField
                label="Country"
                onChange={(fulfillmentCountry) =>
                  updateDraft({ fulfillmentCountry })
                }
                placeholder="Nigeria"
                value={draft.fulfillmentCountry}
              />
              <TextField
                label="Carrier"
                onChange={(carrier) => updateDraft({ carrier })}
                placeholder="GIG Logistics"
                value={draft.carrier}
              />
              <TextField
                label="Tracking code"
                onChange={(trackingCode) => updateDraft({ trackingCode })}
                placeholder="GIG-829112"
                value={draft.trackingCode}
              />
              <SelectField
                label="Fulfillment status"
                onChange={(fulfillmentStatus) =>
                  updateDraft({
                    fulfillmentStatus:
                      fulfillmentStatus as OrderDraft["fulfillmentStatus"],
                  })
                }
                options={fulfillmentStatusOptions}
                value={draft.fulfillmentStatus}
              />
              <label className="grid gap-2">
                <span className="text-footnote font-normal text-[#2F4B4F]">
                  Estimated delivery
                </span>
                <AppDatePicker
                  ariaLabel="Choose estimated delivery date"
                  onChange={(date) =>
                    updateDraft({ estimatedDeliveryAt: formatDateDraft(date) })
                  }
                  popoverAlign="right"
                  value={dateDraftToDate(draft.estimatedDeliveryAt)}
                />
              </label>
            </div>
          </FormSection>
        ) : null}

        <TextAreaField
          label="Notes"
          onChange={(notes) => updateDraft({ notes })}
          placeholder="Add fulfilment notes or customer preferences."
          value={draft.notes}
        />
      </form>
    </AppSheet>
  );
}

function FormSection({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="grid gap-4 rounded-md border border-border bg-white p-4">
      <h3 className="text-callout font-semibold text-[#2F4B4F]">{title}</h3>
      {children}
    </section>
  );
}

function TextField({
  label,
  onChange,
  placeholder,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
  value: string;
}) {
  return (
    <AppTextField
      label={label}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      type={type}
      value={value}
    />
  );
}

function TextAreaField({
  label,
  onChange,
  placeholder,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <AppTextareaField
      label={label}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      value={value}
    />
  );
}

function SelectField({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: readonly string[];
  value: string;
}) {
  return (
    <AppSelectField
      label={label}
      onChange={(event) => onChange(event.target.value)}
      options={options.map((option) => ({
        label: formatOrderLabel(option),
        value: option,
      }))}
      value={value}
    />
  );
}

function MoneyField({
  currency,
  label,
  onChange,
  onCurrencyChange,
  value,
}: {
  currency: string;
  label: string;
  onChange: (value: string) => void;
  onCurrencyChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-footnote font-normal text-[#2F4B4F]">{label}</span>
      <div className="flex h-12 overflow-hidden rounded-sm border border-border bg-fill transition focus-within:border-primary focus-within:bg-white">
        <div className="relative flex w-20 shrink-0 items-center border-r border-border">
          <select
            aria-label={`${label} currency`}
            className="h-full w-full appearance-none bg-transparent py-0 pl-3 pr-8 text-callout font-semibold leading-none text-[#2F4B4F] outline-none"
            onChange={(event) => onCurrencyChange(event.target.value)}
            value={currency}
          >
            {currencyOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-[#2F4B4F]/65" />
        </div>
        <input
          className="min-w-0 flex-1 bg-transparent px-3 text-callout text-[#2F4B4F] outline-none placeholder:text-[#2F4B4F]/40"
          inputMode="decimal"
          onChange={(event) => onChange(event.target.value)}
          placeholder="45000"
          type="number"
          value={value}
        />
      </div>
    </label>
  );
}

function formatDateDraft(date: Date) {
  return date.toISOString().slice(0, 10);
}

function dateDraftToDate(value: string) {
  if (!value) return null;

  return new Date(`${value}T00:00:00`);
}
