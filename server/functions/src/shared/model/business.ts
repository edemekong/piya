import { BaseModel } from "./base";
import { LocationData } from "../types/location";

type BusinessStatusType = "verified" | "pending" | "suspended";
type MemberRoleType = "owner" | "manager";
type MemberPermissionType = "edit" | "view";

interface BusinessModel extends BaseModel {
  name: string;
  createdBy: string;
  logoUrl?: string;
  categoryType: string;
  domain: string;
  description: string;
  status: BusinessStatusType;
  contact: BusinessContactData;
}

interface BusinessContactData {
  email?: string | null;
  phoneNumber?: string | null;
  location?: LocationData | null;
}

interface MemberModel extends BaseModel {
  businessId: string;
  name: string;
  email: string;
  role: MemberRoleType;
  permission: MemberPermissionType;
}

export { BusinessModel, MemberModel, BusinessStatusType, BusinessContactData };
