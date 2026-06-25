export type OfferingType = "product" | "service";

export type OfferingSubType =
  | "physical"
  | "digital"
  | "consultation"
  | "consultation_online"
  | "event"
  | "event_online"
  | "digital_service";

export type OfferingStatusType =
  | "draft"
  | "active"
  | "paused"
  | "disabled";

export type OfferingFeatureType = "booking" | "delivery";

export type OfferingLocation = LocationData;

export type OfferingData = {
  id: string;
  businessId: string;
  createdAt: number;
  updatedAt: number;
  name: string;
  description?: string | null;
  type: OfferingType;
  subType?: OfferingSubType | null;
  status: OfferingStatusType;
  imageUrl?: string | null;
  imageUrls?: string[] | null;
  price?: number | null;
  currency?: string | null;
  quantity?: number | null;
  duration?: number | null;
  features?: OfferingFeatureType[] | null;
  location?: OfferingLocation | null;
  meta?: Record<string, unknown> | null;
  tags: string[];
};

export type ProductData = OfferingData & {
  type: "product";
  subType?: OfferingSubType | null;
};

export type ServiceData = OfferingData & {
  type: "service";
  subType?: OfferingSubType | null;
};
import type { LocationData } from "./location";
