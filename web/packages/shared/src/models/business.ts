import type {
  BusinessCategoryTypes,
  BusinessStatusType,
  MemberPermissionType,
  MemberRoleType,
} from "../types/business.type";
import type { BaseModel } from "./base";

interface BusinessData extends BaseModel {
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
interface BusinessBranding {
  logo?: string | null;
  favicon?: string | null;
  coverImage?: string | null;
  primaryColor: string;
  secondaryColor?: string | null;
  accentColor?: string | null;
  socialLinks?: Record<string, string> | null;
}
interface BusinessBrandingData extends BusinessBranding, BaseModel {
  businessId: string;
}
interface MemberData extends BaseModel {
  businessId: string;
  name: string;
  email: string;
  role: MemberRoleType;
  permission: MemberPermissionType;
}

export type {
  BusinessData,
  BusinessBranding,
  BusinessBrandingData,
  MemberData,
};
