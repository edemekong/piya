import { BaseModel } from "./base";

type SiteStatusType =
  | "draft"
  | "published"
  | "disabled";

type SiteSections = 'profile' | 'services' | 'products' | 'loyalty' | 'contact-form';

interface SiteData extends BaseModel {
  businessId: string;
  slug: string;
  title: string;
  description?: string | null;
  status: SiteStatusType;
  sections: Array<SiteSections>;
  seo?: Record<SiteSections, SiteSeo>;
}

interface SiteSeo {
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
}

export {
  SiteData,
  SiteSeo,
  SiteStatusType,
};