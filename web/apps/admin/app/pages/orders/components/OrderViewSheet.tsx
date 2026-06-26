import { Mail, MapPin, Phone, Route } from "lucide-react";
import { AppSheet, Badge, cn } from "@piya/ui";
import type { OrderData } from "@piya/shared/models";
import {
  formatDate,
  formatMoney,
  formatOrderLabel,
  getOrderFulfillment,
  getItemCountLabel,
  getPrimaryOrderType,
  isTrackableOrder,
} from "@piya/shared/utils";

type OrderViewSheetProps = {
  onClose: () => void;
  open: boolean;
  order: OrderData | null;
};

export function OrderViewSheet({ onClose, open, order }: OrderViewSheetProps) {
  if (!order) return null;

  const fulfillment = getOrderFulfillment(order);

  return (
    <AppSheet
      ariaLabel="order details sheet"
      description={`${order.contact.name} • ${formatDate(order.createdAt)}`}
      maxWidthClassName="max-w-2xl"
      onClose={onClose}
      open={open}
      title={`# ${order.shareId}`}
    >
      <div className="grid gap-5">
        <section className="rounded-md border border-border bg-fill/40 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-footnote font-semibold text-[#2F4B4F]/65">
                Order summary
              </p>
              <h3 className="mt-1 text-title-3 font-semibold text-[#2F4B4F]">
                {formatOrderLabel(getPrimaryOrderType(order))} order
              </h3>
              <p className="mt-1 text-callout text-[#2F4B4F]/70">
                {getItemCountLabel(order)}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-title-3 font-semibold text-[#2F4B4F]">
                {formatMoney(order.total, order.currency)}
              </p>
              <p className="mt-1 text-footnote text-[#2F4B4F]/60">
                Payment: {formatOrderLabel(order.paymentStatus)}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge className="h-auto rounded-full border-border bg-white px-3 py-1.5 text-caption-1 font-semibold text-[#2F4B4F]">
              {formatOrderLabel(order.status)}
            </Badge>
            {isTrackableOrder(order) ? (
              <Badge className="h-auto rounded-full border-success/20 bg-success/10 px-3 py-1.5 text-caption-1 font-semibold text-success">
                Trackable
              </Badge>
            ) : null}
          </div>
        </section>

        <section className="grid gap-3 rounded-md border border-border bg-white p-4">
          <h3 className="text-callout font-semibold text-[#2F4B4F]">Contact</h3>
          <p className="text-callout font-semibold text-[#2F4B4F]">
            {order.contact.name}
          </p>
          <div className="grid gap-2 text-callout text-[#2F4B4F]/70">
            {order.contact.email ? (
              <span className="inline-flex items-center gap-2">
                <Mail className="size-4" /> {order.contact.email}
              </span>
            ) : null}
            {order.contact.phoneNumber ? (
              <span className="inline-flex items-center gap-2">
                <Phone className="size-4" /> {order.contact.phoneNumber}
              </span>
            ) : null}
          </div>
        </section>

        <section className="grid gap-3 rounded-md border border-border bg-white p-4">
          <h3 className="text-callout font-semibold text-[#2F4B4F]">Items</h3>
          {order.items.map((item) => (
            <div
              className="rounded-md border border-border bg-fill/40 p-3"
              key={item.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[#2F4B4F]">{item.name}</p>
                  <p className="mt-1 text-footnote text-[#2F4B4F]/60">
                    {formatOrderLabel(String(item.type))}
                    {"attendeeCount" in item && item.attendeeCount
                      ? ` • ${item.attendeeCount} attendees`
                      : ""}
                    {"seatCount" in item && item.seatCount
                      ? ` • ${item.seatCount} seats`
                      : ""}
                  </p>
                </div>
                <p className="shrink-0 text-callout font-semibold text-[#2F4B4F]">
                  {item.quantity} x {formatMoney(item.unitPrice, order.currency)}
                </p>
              </div>
            </div>
          ))}
        </section>

        {fulfillment ? (
          <section className="grid gap-3 rounded-md border border-border bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-callout font-semibold text-[#2F4B4F]">
                Tracking and delivery
              </h3>
              {fulfillment.status ? (
                <span
                  className={cn(
                    "rounded-full border px-3 py-1 text-caption-1 font-semibold",
                    fulfillment.status === "delivered"
                      ? "border-success/20 bg-success/10 text-success"
                      : "border-secondary-dark/20 bg-secondary/40 text-primary",
                  )}
                >
                  {formatOrderLabel(fulfillment.status)}
                </span>
              ) : null}
            </div>
            <div className="grid gap-2 text-callout text-[#2F4B4F]/70">
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4" />
                {[fulfillment.address, fulfillment.city, fulfillment.state]
                  .filter(Boolean)
                  .join(", ")}
              </span>
              {fulfillment.trackingCode ? (
                <span className="inline-flex items-center gap-2">
                  <Route className="size-4" />
                  {fulfillment.carrier ?? "Carrier"} • {fulfillment.trackingCode}
                </span>
              ) : (
                <span className="text-[#2F4B4F]/55">
                  Tracking code has not been assigned yet.
                </span>
              )}
              {fulfillment.estimatedDeliveryAt ? (
                <span>
                  ETA: {formatDate(fulfillment.estimatedDeliveryAt)}
                </span>
              ) : null}
            </div>
          </section>
        ) : null}

        {order.notes ? (
          <section className="rounded-md border border-border bg-white p-4">
            <h3 className="text-callout font-semibold text-[#2F4B4F]">Notes</h3>
            <p className="mt-2 text-callout text-[#2F4B4F]/70">{order.notes}</p>
          </section>
        ) : null}
      </div>
    </AppSheet>
  );
}
