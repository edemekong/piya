import type { BaseModel } from "./base";

export type BusinessStatusType = "verified" | "pending" | "suspended";
export type MemberRoleType = "owner" | "manager";
export type MemberPermissionType = "edit" | "view";

export type BusinessCategoryTypes =
  | "laundry"
  | "fashion_tailoring"
  | "salon"
  | "barbershop"
  | "spa"
  | "beauty_studio"
  | "car_wash"
  | "logistics_delivery"
  | "restaurant"
  | "food_vendor"
  | "supermarket"
  | "farm_produce"
  | "fashion_store"
  | "electronics_store"
  | "photography"
  | "consulting"
  | "real_estate_agent"
  | "hotel_guesthouse"
  | "shortlet_apartment";

export type BusinessBranding = {
  logo?: string | null;
  favicon?: string | null;
  coverImage?: string | null;
  primaryColor: string;
  secondaryColor?: string | null;
  accentColor?: string | null;
  socialLinks?: Record<string, string> | null;
};

export interface BusinessData extends BaseModel {
  name: string;
  category?: BusinessCategoryTypes;
  createdBy: string;
  logo?: string;
  domain: string;
  description: string;
  email?: string | null;
  phoneNumber?: string | null;
  serviceLocations?: string[];
  status: BusinessStatusType;
  branding?: BusinessBranding | null;
}

export interface MemberData extends BaseModel {
  businessId: string;
  name: string;
  email: string;
  role: MemberRoleType;
  permission: MemberPermissionType;
}
