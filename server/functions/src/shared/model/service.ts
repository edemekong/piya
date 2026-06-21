import { LocationData } from "../types/location";
import { BaseModel } from "./base";

type ServiceType = "consultation" | "event" | "digital_service";

type ServiceStatusType = "draft" | "active" | "paused" | "disabled";

type ServiceFeatureType = "booking" | "delivery";

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

export { ServiceData, ServiceType, ServiceStatusType };
