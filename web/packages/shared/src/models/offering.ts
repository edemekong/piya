import type {
  OfferingFeatureType,
  OfferingAttributeValueType,
  OfferingCheckoutIntentType,
  OfferingStatusType,
  OfferingSubType,
  OfferingType,
} from "../types/offering.type";
import type { CheckoutPaymentMode } from "../types/storefront.type";
import type { BaseModel } from "./base";
import type { LocationData } from "./location";

interface OfferingData extends BaseModel {
  businessId: string;
  name: string;
  description?: string | null;
  type: OfferingType;
  subType?: OfferingSubType | null;
  category?: OfferingCategoryData | null;
  status: OfferingStatusType;
  imageUrls?: string[] | null;
  price?: number | null;
  currency?: string | null;
  duration?: number | null;
  attributes?: OfferingAttribute[] | null;
  options?: OfferingOption[] | null;
  variants?: OfferingVariant[] | null;
  inventory?: OfferingInventoryConfig | null;
  features?: OfferingFeatureType[] | null;
  commerce?: OfferingCommerceConfig | null;
  location?: LocationData | null;
  meta?: Record<string, any> | null;
  tags: string[];
}

interface OfferingCategoryData {
  id?: string | null;
  name: string;
}

interface OfferingAttribute {
  id?: string | null;
  name: string;
  value: string;
  valueType?: OfferingAttributeValueType | null;
  unit?: string | null;
}

interface OfferingOption {
  id?: string | null;
  name: string;
  values: string[];
}

interface OfferingVariant {
  id: string;
  title: string;
  optionValues: Record<string, string>;
  sku?: string | null;
  price?: number | null;
  quantity?: number | null;
  imageUrl?: string | null;
  status?: OfferingStatusType;
}

interface OfferingInventoryConfig {
  trackQuantity: boolean;
  quantity?: number | null;
  sku?: string | null;
  allowBackorders?: boolean;
}

interface OfferingCommerceConfig {
  checkoutIntents: OfferingCheckoutIntentType[];
  paymentModes?: CheckoutPaymentMode[] | null;
  requiresBusinessConfirmation?: boolean;
  minQuantity?: number | null;
  maxQuantity?: number | null;
  depositAmount?: number | null;
  depositPercent?: number | null;
}

type ProductData = OfferingData & {
  type: "product";
  subType?: "physical" | "digital" | null;
};

type ServiceData = OfferingData & {
  type: "service";
  subType?: "appointment" | "online_appointment" | "event" | null;
};

type AccommodationOfferingData = OfferingData & {
  type: "accommodation";
  subType?: "room" | "unit" | null;
};

type DeliveryOfferingData = OfferingData & {
  type: "delivery";
  subType?: "delivery" | null;
};

export type {
  AccommodationOfferingData,
  DeliveryOfferingData,
  OfferingAttribute,
  OfferingCategoryData,
  OfferingCommerceConfig,
  OfferingData,
  OfferingInventoryConfig,
  OfferingOption,
  OfferingVariant,
  ProductData,
  ServiceData,
};
