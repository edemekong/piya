import type { BaseModel } from "./base";

export type SiteStatusType = "draft" | "published" | "disabled";
export type SiteSections =
  | "profile"
  | "services"
  | "products"
  | "loyalty"
  | "contact-form";

export type SiteSeo = {
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
};

export interface SiteData extends BaseModel {
  businessId: string;
  slug: string;
  title: string;
  description?: string | null;
  status: SiteStatusType;
  sections: SiteSections[];
  seo?: Partial<Record<SiteSections, SiteSeo>>;
}
