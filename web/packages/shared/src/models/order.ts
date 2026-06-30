import type { BaseModel } from "./base";
import type {
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
} from "../types/order.type";

interface OrderData extends BaseModel {
  shareId: string;
  businessId: string;
  source?: OrderSourceType;
  checkoutIntent?: OrderCheckoutIntentType;
  contact: OrderContact;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  paymentMode?: OrderPaymentMode | null;
  currency: string;
  subtotal: number;
  total: number;
  items: OrderItem[];
  relatedRecords?: OrderRelatedRecord[];
  notes?: string;
}

export type {
  AccommodationOrderItem,
  AppointmentOrderItem,
  DeliveryOrderItem,
  DigitalOrderItem,
  EventOrderItem,
  OrderContact,
  OrderData,
  OrderFulfillmentDetails,
  OrderItem,
  OrderItemBase,
  OrderItemType,
  OrderCheckoutIntentType,
  OrderPaymentStatus,
  OrderPaymentMode,
  OrderRelatedRecord,
  OrderRelatedRecordType,
  OrderSourceType,
  OrderStatus,
  PhysicalOrderItem,
};
