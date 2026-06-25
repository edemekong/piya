import type { BaseModel } from "./base";

export type OrderItemType =
  | "physical"
  | "digital"
  | "consultation"
  | "consultation_online"
  | "event"
  | "event_online"
  | "digital_service"
  | "delivery"
  | "pickup";

export type OrderStatus =
  | "draft"
  | "pending"
  | "confirmed"
  | "in_progress"
  | "fulfilled"
  | "completed"
  | "cancelled"
  | "archived";

export type OrderPaymentStatus = "unpaid" | "paid" | "refunded" | "partial";

export type OrderContact = {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
};

export type OrderFulfillmentDetails = {
  address: string;
  city: string;
  state: string;
  country: string;
  trackingCode?: string;
  carrier?: string;
  status?: "queued" | "picked_up" | "in_transit" | "delivered" | "delayed";
  estimatedDeliveryAt?: number;
};

export type OrderItemBase = {
  id: string;
  offeringId?: string;
  name: string;
  type: OrderItemType;
  quantity: number;
  unitPrice: number;
  metadata?: Record<string, string | number | boolean>;
};

export type PhysicalOrderItem = OrderItemBase & {
  type: "physical";
  fulfillment?: OrderFulfillmentDetails;
};

export type DigitalOrderItem = OrderItemBase & {
  type: "digital";
  downloadUrl?: string;
};

export type ConsultationOrderItem = OrderItemBase & {
  type: "consultation" | "consultation_online";
  seatCount?: number;
  sessionCount?: number;
};

export type EventOrderItem = OrderItemBase & {
  type: "event" | "event_online";
  attendeeCount?: number;
};

export type DigitalServiceOrderItem = OrderItemBase & {
  type: "digital_service";
};

export type DeliveryOrderItem = OrderItemBase & {
  type: "delivery" | "pickup";
  fulfillment: OrderFulfillmentDetails;
};

export type OrderItem =
  | PhysicalOrderItem
  | DigitalOrderItem
  | ConsultationOrderItem
  | EventOrderItem
  | DigitalServiceOrderItem
  | DeliveryOrderItem;

export interface OrderData extends BaseModel {
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
