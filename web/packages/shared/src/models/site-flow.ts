import type { BaseModel } from "./base";

const siteModuleIds = [
  "welcome",
  "business-profile",
  "location-first",
  "offerings",
  "offering-details",
  "availability",
  "cart",
  "checkout",
  "booking-form",
  "delivery-request",
  "quote-request",
  "customer-info",
  "contact-form",
  "chat",
  "location-map",
  "upload-documents",
  "reviews",
  "loyalty",
  "confirmation",
] as const;

type SiteModuleId = (typeof siteModuleIds)[number];

interface SiteFlowModuleData {
  flowId: string;
  moduleId: SiteModuleId;
}

interface SiteFlowData extends BaseModel {
  businessId: string;
  modules: SiteFlowModuleData[];
}

export { siteModuleIds };
export type { SiteFlowData, SiteFlowModuleData, SiteModuleId };
