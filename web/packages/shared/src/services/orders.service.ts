import type {
  OrderData,
  OrderFulfillmentDetails,
  OrderItem,
  OrderItemType,
  OrderPaymentStatus,
  OrderStatus,
} from "../models";

export type {
  OrderData,
  OrderFulfillmentDetails,
  OrderItem,
  OrderItemType,
  OrderPaymentStatus,
  OrderStatus,
};

export type OrderDraft = {
  contactName: string;
  contactEmail: string;
  contactPhoneNumber: string;
  itemType: OrderItemType;
  itemName: string;
  quantity: string;
  attendeeCount: string;
  seatCount: string;
  unitPrice: string;
  currency: string;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  fulfillmentAddress: string;
  fulfillmentCity: string;
  fulfillmentState: string;
  fulfillmentCountry: string;
  trackingCode: string;
  carrier: string;
  fulfillmentStatus: NonNullable<OrderFulfillmentDetails["status"]>;
  estimatedDeliveryAt: string;
  notes: string;
};

const now = new Date("2026-06-24T10:30:00.000Z").getTime();

const orders: OrderData[] = [
  {
    id: "ord_1001",
    shareId: "YIN-1001",
    businessId: "biz_northstar",
    createdAt: now - 1000 * 60 * 52,
    updatedAt: now - 1000 * 60 * 18,
    contact: {
      id: "ct_001",
      name: "Amara Okafor",
      email: "amara@example.com",
      phoneNumber: "+234 801 230 9921",
    },
    status: "fulfilled",
    paymentStatus: "paid",
    currency: "NGN",
    subtotal: 90000,
    total: 95000,
    items: [
      {
        id: "item_1001",
        offeringId: "offering_001",
        name: "Starter Skincare Kit",
        type: "physical",
        quantity: 2,
        unitPrice: 45000,
        fulfillment: {
          address: "18 Admiralty Way",
          city: "Lekki",
          state: "Lagos",
          country: "Nigeria",
          carrier: "GIG Logistics",
          trackingCode: "GIG-829112",
          status: "delivered",
          estimatedDeliveryAt: now + 1000 * 60 * 60 * 24,
        },
      },
    ],
    notes: "Gift wrap both kits.",
  },
  {
    id: "ord_1002",
    shareId: "YIN-1002",
    businessId: "biz_northstar",
    createdAt: now - 1000 * 60 * 60 * 6,
    updatedAt: now - 1000 * 60 * 60,
    contact: {
      id: "ct_002",
      name: "Tunde Balogun",
      email: "tunde@example.com",
      phoneNumber: "+234 809 441 1820",
    },
    status: "confirmed",
    paymentStatus: "partial",
    currency: "NGN",
    subtotal: 30000,
    total: 30000,
    items: [
      {
        id: "item_1002",
        offeringId: "offering_002",
        name: "Virtual Brand Consultation",
        type: "consultation_online",
        quantity: 1,
        seatCount: 1,
        sessionCount: 1,
        unitPrice: 30000,
        metadata: { durationMinutes: 60 },
      },
    ],
    notes: "Prefers WhatsApp reminder before the session.",
  },
  {
    id: "ord_1003",
    shareId: "YIN-1003",
    businessId: "biz_northstar",
    createdAt: now - 1000 * 60 * 60 * 26,
    updatedAt: now - 1000 * 60 * 60 * 2,
    contact: {
      id: "ct_003",
      name: "Maya Chen",
      email: "maya@example.com",
      phoneNumber: "+1 415 209 7744",
    },
    status: "completed",
    paymentStatus: "paid",
    currency: "USD",
    subtotal: 360,
    total: 360,
    items: [
      {
        id: "item_1003",
        offeringId: "offering_004",
        name: "In-store Launch Workshop",
        type: "event",
        quantity: 1,
        attendeeCount: 3,
        unitPrice: 360,
      },
    ],
  },
  {
    id: "ord_1004",
    shareId: "YIN-1004",
    businessId: "biz_clearpath",
    createdAt: now - 1000 * 60 * 60 * 31,
    updatedAt: now - 1000 * 60 * 12,
    contact: {
      id: "ct_004",
      name: "Daniel Mensah",
      email: "daniel@example.com",
      phoneNumber: "+233 24 778 1091",
    },
    status: "in_progress",
    paymentStatus: "paid",
    currency: "GHS",
    subtotal: 140,
    total: 155,
    items: [
      {
        id: "item_1004",
        name: "Accra same-day dispatch",
        type: "delivery",
        quantity: 1,
        unitPrice: 140,
        fulfillment: {
          address: "14 Independence Avenue",
          city: "Accra",
          state: "Greater Accra",
          country: "Ghana",
          carrier: "QuickMove",
          trackingCode: "QMV-44018",
          status: "in_transit",
          estimatedDeliveryAt: now + 1000 * 60 * 60 * 8,
        },
      },
    ],
  },
  {
    id: "ord_1005",
    shareId: "YIN-1005",
    businessId: "biz_urbanmart",
    createdAt: now - 1000 * 60 * 60 * 46,
    updatedAt: now - 1000 * 60 * 60 * 42,
    contact: {
      id: "ct_005",
      name: "Ifeoma Nwosu",
      email: "ifeoma@example.com",
      phoneNumber: "+234 805 110 4420",
    },
    status: "pending",
    paymentStatus: "unpaid",
    currency: "NGN",
    subtotal: 8500,
    total: 8500,
    items: [
      {
        id: "item_1005",
        name: "Store pickup handling",
        type: "pickup",
        quantity: 1,
        unitPrice: 8500,
        fulfillment: {
          address: "22 Awolowo Road",
          city: "Ikoyi",
          state: "Lagos",
          country: "Nigeria",
          status: "queued",
        },
      },
    ],
  },
];

export function getOrders() {
  return orders;
}

export function createEmptyOrderDraft(): OrderDraft {
  return {
    contactName: "",
    contactEmail: "",
    contactPhoneNumber: "",
    itemType: "physical",
    itemName: "",
    quantity: "1",
    attendeeCount: "",
    seatCount: "",
    unitPrice: "",
    currency: "NGN",
    status: "pending",
    paymentStatus: "unpaid",
    fulfillmentAddress: "",
    fulfillmentCity: "",
    fulfillmentState: "",
    fulfillmentCountry: "Nigeria",
    trackingCode: "",
    carrier: "",
    fulfillmentStatus: "queued",
    estimatedDeliveryAt: "",
    notes: "",
  };
}

export function draftToOrder(draft: OrderDraft): OrderData {
  const quantity = parsePositiveNumber(draft.quantity, 1);
  const unitPrice = parsePositiveNumber(draft.unitPrice, 0);
  const subtotal = quantity * unitPrice;
  const createdAt = Date.now();

  return {
    id: `ord_${createdAt}`,
    shareId: `YIN-${String(createdAt).slice(-6)}`,
    businessId: "biz_northstar",
    createdAt,
    updatedAt: createdAt,
    contact: {
      id: `ct_${createdAt}`,
      name: draft.contactName.trim(),
      email: draft.contactEmail.trim() || undefined,
      phoneNumber: draft.contactPhoneNumber.trim() || undefined,
    },
    status: draft.status,
    paymentStatus: draft.paymentStatus,
    currency: draft.currency,
    subtotal,
    total: subtotal,
    items: [draftToOrderItem(draft, createdAt, quantity, unitPrice)],
    notes: draft.notes.trim() || undefined,
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
    name: draft.itemName.trim(),
    quantity,
    unitPrice,
  };

  if (draft.itemType === "event" || draft.itemType === "event_online") {
    return {
      ...base,
      type: draft.itemType,
      attendeeCount: parsePositiveNumber(draft.attendeeCount, quantity),
    };
  }

  if (
    draft.itemType === "consultation" ||
    draft.itemType === "consultation_online"
  ) {
    return {
      ...base,
      type: draft.itemType,
      seatCount: parsePositiveNumber(draft.seatCount, quantity),
      sessionCount: quantity,
    };
  }

  if (draft.itemType === "delivery" || draft.itemType === "pickup") {
    return {
      ...base,
      type: draft.itemType,
      fulfillment: createFulfillment(draft),
    };
  }

  if (draft.itemType === "physical") {
    return {
      ...base,
      type: "physical",
      fulfillment: hasFulfillmentDetails(draft)
        ? createFulfillment(draft)
        : undefined,
    };
  }

  return {
    ...base,
    type: draft.itemType,
  };
}

function createFulfillment(draft: OrderDraft): OrderFulfillmentDetails {
  return {
    address: draft.fulfillmentAddress.trim(),
    city: draft.fulfillmentCity.trim(),
    state: draft.fulfillmentState.trim(),
    country: draft.fulfillmentCountry.trim(),
    trackingCode: draft.trackingCode.trim() || undefined,
    carrier: draft.carrier.trim() || undefined,
    status: draft.fulfillmentStatus,
    estimatedDeliveryAt: draft.estimatedDeliveryAt
      ? new Date(draft.estimatedDeliveryAt).getTime()
      : undefined,
  };
}

function hasFulfillmentDetails(draft: OrderDraft) {
  return Boolean(
    draft.fulfillmentAddress.trim() ||
      draft.trackingCode.trim() ||
      draft.carrier.trim(),
  );
}

function parsePositiveNumber(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}
