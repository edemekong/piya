import type { SiteSections, SiteStatusType } from "../types/site.type";
import type { BaseModel } from "./base";

interface SiteData extends BaseModel {
  businessId: string;
  slug: string;
  title: string;
  description?: string | null;
  status: SiteStatusType;
  sections: SiteSections[];
  seo?: Record<SiteSections, SiteSeo>;
}
interface SiteSeo {
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
}

export type { SiteData, SiteSeo };
