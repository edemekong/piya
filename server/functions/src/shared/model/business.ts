import { BaseModel } from "./base";
import { LocationData } from "../types/location";

type BusinessStatusType = "verified" | "pending" | "suspended";
type MemberRoleType = "owner" | "manager";
type MemberPermissionType = "edit" | "view";

interface BusinessData extends BaseModel {
  name: string;
  createdBy: string;
  logo?: string;
  domain: string;
  description: string;
  status: BusinessStatusType;
  contact: BusinessContactData;
  branding?: BusinessBranding | null;
}

interface BusinessContactData {
  email?: string | null;
  phoneNumber?: string | null;
  location?: LocationData | null;
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
interface MemberData extends BaseModel {
  businessId: string;
  name: string;
  email: string;
  role: MemberRoleType;
  permission: MemberPermissionType;
}

export {
  BusinessData,
  MemberData,
  BusinessStatusType,
  BusinessContactData,
  BusinessBranding,
};
