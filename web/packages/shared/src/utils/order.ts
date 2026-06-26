import type {
  OrderData,
  OrderFulfillmentDetails,
  OrderItem,
} from "../models";
import { formatEnumLabel } from "./format";

export function formatOrderLabel(value: string) {
  return formatEnumLabel(value);
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
