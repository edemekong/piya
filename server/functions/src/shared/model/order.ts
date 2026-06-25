import type { BaseModel } from "./base";

type OrderItemType =
  | "physical"
  | "digital"
  | "consultation"
  | "consultation_online"
  | "event"
  | "event_online"
  | "digital_service"
  | "delivery"
  | "pickup";

type OrderStatus =
  | "draft"
  | "pending"
  | "confirmed"
  | "in_progress"
  | "fulfilled"
  | "completed"
  | "cancelled"
  | "archived";

type OrderPaymentStatus = "unpaid" | "paid" | "refunded" | "partial";

type OrderContact = {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
};

type OrderFulfillmentDetails = {
  address: string;
  city: string;
  state: string;
  country: string;
  trackingCode?: string;
  carrier?: string;
  status?: "queued" | "picked_up" | "in_transit" | "delivered" | "delayed";
  estimatedDeliveryAt?: number;
};

type OrderItemBase = {
  id: string;
  offeringId?: string;
  name: string;
  type: OrderItemType;
  quantity: number;
  unitPrice: number;
  metadata?: Record<string, string | number | boolean>;
};

type PhysicalOrderItem = OrderItemBase & {
  type: "physical";
  fulfillment?: OrderFulfillmentDetails;
};

type DigitalOrderItem = OrderItemBase & {
  type: "digital";
  downloadUrl?: string;
};

type ConsultationOrderItem = OrderItemBase & {
  type: "consultation" | "consultation_online";
  seatCount?: number;
  sessionCount?: number;
};

type EventOrderItem = OrderItemBase & {
  type: "event" | "event_online";
  attendeeCount?: number;
};

type DigitalServiceOrderItem = OrderItemBase & {
  type: "digital_service";
};

type DeliveryOrderItem = OrderItemBase & {
  type: "delivery" | "pickup";
  fulfillment: OrderFulfillmentDetails;
};

type OrderItem =
  | PhysicalOrderItem
  | DigitalOrderItem
  | ConsultationOrderItem
  | EventOrderItem
  | DigitalServiceOrderItem
  | DeliveryOrderItem;

interface OrderData extends BaseModel {
  shareId: string;
  businessId: string;
  contact: OrderContact;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  currency: string;
  subtotal: number;
  total: number;
  items: OrderItem[];
  notes?: string;
}

export type {
  ConsultationOrderItem,
  DeliveryOrderItem,
  DigitalOrderItem,
  DigitalServiceOrderItem,
  EventOrderItem,
  OrderContact,
  OrderData,
  OrderFulfillmentDetails,
  OrderItem,
  OrderItemBase,
  OrderItemType,
  OrderPaymentStatus,
  OrderStatus,
  PhysicalOrderItem,
};
