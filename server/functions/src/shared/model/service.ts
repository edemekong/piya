import type {
  ServiceFeatureType,
  ServiceStatusType,
  ServiceType,
} from "../types/service.type";
import type { BaseModel } from "./base";
import type { LocationData } from "./location";

interface ServiceData extends BaseModel {
  businessId: string;
  name: string;
  description?: string | null;
  type: ServiceType;
  status: ServiceStatusType;
  imageUrl?: string | null;
  price?: number | null;
  currency?: string | null;
  features: ServiceFeatureType[];
  duration?: number;
  location?: LocationData;
  meta: Record<string, any>;
  tags: string[];
}

export { ServiceData };
