import type {
  OrderData,
  OrderFulfillmentDetails,
  OrderItem,
} from "@piya/shared/models";

export function formatOrderLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-NG", {
    currency,
    style: "currency",
  }).format(value);
}

export function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(timestamp);
}

export function getItemCountLabel(order: OrderData) {
  const quantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const attendees = order.items.reduce(
    (sum, item) =>
      sum + ("attendeeCount" in item ? (item.attendeeCount ?? 0) : 0),
    0,
  );
  const seats = order.items.reduce(
    (sum, item) => sum + ("seatCount" in item ? (item.seatCount ?? 0) : 0),
    0,
  );

  if (attendees > 0) return `${attendees} attendee${attendees === 1 ? "" : "s"}`;
  if (seats > 0) return `${seats} seat${seats === 1 ? "" : "s"}`;
  return `${quantity} item${quantity === 1 ? "" : "s"}`;
}

export function isTrackableOrder(order: OrderData) {
  return Boolean(getOrderFulfillment(order)?.trackingCode);
}

export function getPrimaryOrderType(order: OrderData) {
  return order.items[0]?.type ?? "physical";
}

export function getOrderFulfillment(
  order: OrderData,
): OrderFulfillmentDetails | undefined {
  return order.items.map(getItemFulfillment).find(Boolean);
}

export function getItemFulfillment(
  item: OrderItem,
): OrderFulfillmentDetails | undefined {
  return "fulfillment" in item ? item.fulfillment : undefined;
}
