import type {
  BusinessCategoryTypes,
  BusinessSellingType,
  BusinessStatusType,
  InvitableMemberRoleType,
  MemberInvitationStatusType,
  MemberPermissionType,
  MemberRoleType,
} from "../types/business.type";
import type { BaseModel } from "./base";

interface BusinessData extends BaseModel {
  name: string;
  category?: BusinessCategoryTypes;
  sellingTypes?: BusinessSellingType[];
  createdBy: string;
  logo?: string;
  slug?: string | null;
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
  profileImageUrl?: string | null;
  role: MemberRoleType;
  permission: MemberPermissionType;
}
interface MemberInvitationData extends BaseModel {
  businessId: string;
  email: string;
  role: InvitableMemberRoleType;
  status: MemberInvitationStatusType;
  invitedBy: string;
  expiresAt: number;
  acceptedAt?: number | null;
  acceptedBy?: string | null;
}

const productBusinessCategories: BusinessCategoryTypes[] = [
  "restaurant",
  "food_vendor",
  "supermarket",
  "farm_produce",
  "fashion_store",
  "electronics_store",
];

function getBusinessSellingTypes(
  category: BusinessCategoryTypes,
): BusinessSellingType[] {
  return productBusinessCategories.includes(category)
    ? ["products"]
    : ["services"];
}

export {
  BusinessData,
  BusinessBranding,
  BusinessBrandingData,
  MemberData,
  MemberInvitationData,
  getBusinessSellingTypes,
};
