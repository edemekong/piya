import type {
  OfferingFeatureType,
  OfferingStatusType,
  OfferingSubType,
  OfferingType,
} from "../types/offering.type";
import type { BaseModel } from "./base";
import type { LocationData } from "./location";

interface OfferingData extends BaseModel {
  businessId: string;
  name: string;
  description?: string | null;
  type: OfferingType;
  subType?: OfferingSubType | null;
  status: OfferingStatusType;
  imageUrls?: string[] | null;
  price?: number | null;
  currency?: string | null;
  quantity?: number | null;
  duration?: number | null;
  features?: OfferingFeatureType[] | null;
  location?: LocationData | null;
  meta?: Record<string, any> | null;
  tags: string[];
}

type ProductData = OfferingData & {
  type: "product";
  subType?: OfferingSubType | null;
};

type ServiceData = OfferingData & {
  type: "service";
  subType?: OfferingSubType | null;
};

export type { OfferingData, ProductData, ServiceData };
