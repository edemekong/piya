import type {
  GiftStatusType,
  OrderFulfillmentDetails,
  OrderItemType,
  OrderPaymentStatus,
  OrderStatus,
} from "../models";
import type { DiscountStatusType, RewardType } from "../models/discount";
import type {
  OfferingFeatureType,
  OfferingStatusType,
  OfferingSubType,
  OfferingType,
} from "./offering.type";

export type GiftDraft = {
  currency: string;
  description: string;
  estimatedValue: string;
  imageUrl: string;
  maxPerContact: string;
  name: string;
  quantityAvailable: string;
  status: GiftStatusType;
  tags: string;
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

export type DiscountFormDraft = {
  buyQuantity: string;
  code: string;
  codeGeneration: "manual" | "unique_per_contact";
  currency: string;
  description: string;
  endsAt: string;
  freebieGiftId: string;
  getQuantity: string;
  maxDiscountAmount: string;
  maxUsesPerContact: string;
  minimumOrderValue: string;
  perkDescription: string;
  rewardType: RewardType;
  rewardValue: string;
  startsAt: string;
  status: DiscountStatusType;
  targetBadgeTypes: string;
  targetTags: string;
  title: string;
  totalUsageLimit: string;
};

export type OfferingFormDraft = {
  currency: string;
  description: string;
  duration: string;
  features: OfferingFeatureType[];
  imageUrl: string;
  imageUrls: string;
  locationAddress: string;
  locationCity: string;
  locationCountry: string;
  locationPostalCode: string;
  locationState: string;
  meetingLink: string;
  name: string;
  price: string;
  quantity: string;
  status: OfferingStatusType;
  subType: OfferingSubType | "";
  tags: string;
  type: OfferingType | "";
};

export type AddContactMode = "manual" | "csv";
export type ContactOverviewTab = "events" | "details";
export type ContactViewParentTab = "overview" | "preference" | "conversations";
export type OverviewRange =
  | "today"
  | "yesterday"
  | "last_3_days"
  | "last_7_days"
  | "last_30_days"
  | "last_90_days"
  | "lifetime";
