import type {
  UserGenderType,
  UserRoleType,
  MiniUserData,
} from "../types/user.type";
import type { BaseModel } from "./base";
import type { LocationData } from "./location";

interface UserData extends BaseModel {
  email: string;
  phoneNumber?: string | null;
  name: string;
  profileImageUrl?: string;
  accountSetupCompleted: boolean;
  dob?: string | null;
  gender?: UserGenderType | null;
  business?: UserBusinessData | null;
  verification: VerificationData;
  lastKnownLocation?: LocationData | null;
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
export type {
  UserData,
  UserSettingsData,
  UserBusinessData,
  VerificationData,
  MiniUserData,
};
