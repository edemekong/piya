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
  OfferingAttributeValueType,
  OfferingCheckoutIntentType,
  OfferingStatusType,
  OfferingSubType,
  OfferingType,
} from "./offering.type";
import type { CheckoutPaymentMode } from "./storefront.type";

export type OfferingAttributeDraft = {
  id: string;
  name: string;
  unit: string;
  value: string;
  valueType: OfferingAttributeValueType;
};

export type OfferingOptionDraft = {
  id: string;
  name: string;
  values: string;
};

export type OfferingVariantDraft = {
  id: string;
  imageUrl: string;
  price: string;
  quantity: string;
  sku: string;
  status: OfferingStatusType;
  title: string;
};

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
  categoryId: string;
  categoryName: string;
  attributes: OfferingAttributeDraft[];
  currency: string;
  description: string;
  duration: string;
  features: OfferingFeatureType[];
  imageUrl: string;
  imageUrls: string;
  inventoryAllowBackorders: boolean;
  inventoryQuantity: string;
  inventorySku: string;
  inventoryTrackQuantity: boolean;
  options: OfferingOptionDraft[];
  checkoutIntents: OfferingCheckoutIntentType[];
  locationAddress: string;
  locationCity: string;
  locationCountry: string;
  locationPostalCode: string;
  locationState: string;
  maxQuantity: string;
  meetingLink: string;
  minQuantity: string;
  name: string;
  paymentModes: CheckoutPaymentMode[];
  price: string;
  depositAmount: string;
  depositPercent: string;
  requiresBusinessConfirmation: boolean;
  status: OfferingStatusType;
  subType: OfferingSubType | "";
  tags: string;
  type: OfferingType | "";
  variants: OfferingVariantDraft[];
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
