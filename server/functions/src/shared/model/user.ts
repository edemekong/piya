import type {
  UserGenderType,
  UserRoleType,
  MiniUserData,
} from "../types/user.type";
import type { BaseModel } from "./base";

interface UserData extends BaseModel {
  email: string;
  phoneNumber?: string | null;
  name: string;
  profileImageUrl?: string;
  dob?: string | null;
  gender?: UserGenderType | null;
  business?: UserBusinessData | null;
  verification: VerificationData;
  settings: UserSettingsData;
}
interface UserSettingsData {
  notifications: {
    pushEnabled: boolean;
    emailEnabled: boolean;
    smsEnabled: boolean;
  };
}
interface UserBusinessData {
  businessIds: string[];
  businessRoleTypes: Record<string, UserRoleType[]>;
}
interface VerificationData {
  emailVerified: boolean;
  phoneVerified: boolean;
  authProviders: string[];
}
export {
  UserData,
  UserSettingsData,
  UserBusinessData,
  VerificationData,
  MiniUserData,
};
