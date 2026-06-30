type OrderItemType =
  | "physical"
  | "digital"
  | "appointment"
  | "online_appointment"
  | "event"
  | "delivery"
  | "pickup"
  | "room"
  | "unit";

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

type OrderSourceType = "storefront" | "admin" | "import" | "api";

type OrderCheckoutIntentType =
  | "buy"
  | "book"
  | "request_quote"
  | "create_delivery"
  | "reserve_room";

type OrderPaymentMode =
  | "none"
  | "pay_now"
  | "pay_later"
  | "deposit"
  | "business_confirms_first";

type OrderRelatedRecordType =
  | "booking"
  | "delivery"
  | "lead_request"
  | "payment"
  | "reservation";

type OrderRelatedRecord = {
  id: string;
  type: OrderRelatedRecordType;
};

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

type AppointmentOrderItem = OrderItemBase & {
  type: "appointment" | "online_appointment";
  seatCount?: number;
  sessionCount?: number;
};

type EventOrderItem = OrderItemBase & {
  type: "event";
  attendeeCount?: number;
};

type DeliveryOrderItem = OrderItemBase & {
  type: "delivery" | "pickup";
  fulfillment: OrderFulfillmentDetails;
};

type AccommodationOrderItem = OrderItemBase & {
  type: "room" | "unit";
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
};

type OrderItem =
  | AccommodationOrderItem
  | PhysicalOrderItem
  | DigitalOrderItem
  | AppointmentOrderItem
  | EventOrderItem
  | DeliveryOrderItem;

export type {
  AccommodationOrderItem,
  AppointmentOrderItem,
  DeliveryOrderItem,
  DigitalOrderItem,
  EventOrderItem,
  OrderCheckoutIntentType,
  OrderContact,
  OrderFulfillmentDetails,
  OrderItem,
  OrderItemBase,
  OrderItemType,
  OrderPaymentMode,
  OrderPaymentStatus,
  OrderRelatedRecord,
  OrderRelatedRecordType,
  OrderSourceType,
  OrderStatus,
  PhysicalOrderItem,
};
