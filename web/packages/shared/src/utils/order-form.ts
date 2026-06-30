import type {
  OrderData,
  OrderFulfillmentDetails,
  OrderItem,
} from "../models";
import type { OrderDraft } from "../types";
import { numberOrZero } from "./number";

export function createEmptyOrderDraft(): OrderDraft {
  return {
    attendeeCount: "",
    carrier: "",
    contactEmail: "",
    contactName: "",
    contactPhoneNumber: "",
    currency: "NGN",
    estimatedDeliveryAt: "",
    fulfillmentAddress: "",
    fulfillmentCity: "",
    fulfillmentCountry: "",
    fulfillmentState: "",
    fulfillmentStatus: "queued",
    itemName: "",
    itemType: "physical",
    notes: "",
    paymentStatus: "unpaid",
    quantity: "1",
    seatCount: "",
    status: "draft",
    trackingCode: "",
    unitPrice: "",
  };
}

export function draftToOrder(draft: OrderDraft): OrderData {
  const createdAt = Date.now();
  const quantity = numberOrZero(draft.quantity) || 1;
  const unitPrice = numberOrZero(draft.unitPrice);

  return {
    businessId: "biz_northstar",
    contact: {
      email: draft.contactEmail || undefined,
      id: `ct_${createdAt}`,
      name: draft.contactName,
      phoneNumber: draft.contactPhoneNumber || undefined,
    },
    createdAt,
    currency: draft.currency,
    id: `ord_${createdAt}`,
    items: [draftToOrderItem(draft, createdAt, quantity, unitPrice)],
    notes: draft.notes || undefined,
    paymentStatus: draft.paymentStatus,
    shareId: `YIN-${String(createdAt).slice(-5)}`,
    status: draft.status,
    subtotal: quantity * unitPrice,
    total: quantity * unitPrice,
    updatedAt: createdAt,
  };
}

function draftToOrderItem(
  draft: OrderDraft,
  createdAt: number,
  quantity: number,
  unitPrice: number,
): OrderItem {
  const base = {
    id: `item_${createdAt}`,
    name: draft.itemName,
    quantity,
    type: draft.itemType,
    unitPrice,
  };

  if (draft.itemType === "physical") {
    return {
      ...base,
      fulfillment: hasFulfillmentDetails(draft)
        ? createFulfillment(draft)
        : undefined,
      type: "physical",
    };
  }

  if (draft.itemType === "digital") {
    return {
      ...base,
      type: "digital",
    };
  }

  if (draft.itemType === "appointment" || draft.itemType === "online_appointment") {
    return {
      ...base,
      seatCount: numberOrZero(draft.seatCount) || undefined,
      sessionCount: 1,
      type: draft.itemType,
    };
  }

  if (draft.itemType === "event") {
    return {
      ...base,
      attendeeCount: numberOrZero(draft.attendeeCount) || undefined,
      type: draft.itemType,
    };
  }

  if (draft.itemType === "delivery" || draft.itemType === "pickup") {
    return {
      ...base,
      fulfillment: createFulfillment(draft),
      type: draft.itemType,
    };
  }

  return {
    ...base,
    type: "digital",
  };
}

function createFulfillment(draft: OrderDraft): OrderFulfillmentDetails {
  return {
    address: draft.fulfillmentAddress,
    carrier: draft.carrier || undefined,
    city: draft.fulfillmentCity,
    country: draft.fulfillmentCountry,
    estimatedDeliveryAt: draft.estimatedDeliveryAt
      ? new Date(draft.estimatedDeliveryAt).getTime()
      : undefined,
    state: draft.fulfillmentState,
    status: draft.fulfillmentStatus,
    trackingCode: draft.trackingCode || undefined,
  };
}

function hasFulfillmentDetails(draft: OrderDraft) {
  return Boolean(
    draft.fulfillmentAddress ||
      draft.fulfillmentCity ||
      draft.fulfillmentState ||
      draft.fulfillmentCountry ||
      draft.trackingCode ||
      draft.carrier,
  );
}
