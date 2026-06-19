import { LocationData } from "../types/location";
import { BaseModel } from "./base";

type GenderType = "male" | "female" | "other";
type UserAccountType = "customer" | "rider" | "admin";
type UserRoleType = "admin" | "manager" | "rider" | "customer";

interface UserModel extends BaseModel {
  email: string;
  phoneNumber?: string | null;
  accountType?: UserAccountType | null;
  name: string;
  profileImageUrl?: string;
  device: DeviceData;
  dob?: string | null;
  gender?: GenderType | null;
  business?: UserBusinessData | null;
  verification: VerificationData;
  lastKnownLocation?: LocationData | null;
  settings: UserSettingsData;
}

interface DeviceData {
  currentAppVersion: string;
  locale: string;
  timezone: TimezoneData;
}

interface TimezoneData {
  timezoneId: string;
  offset: number;
}

interface UserSettingsData {
  notifications: {
    enabledPushNotification: boolean;
    enabledEmailNotification: boolean;
    enabledSmsNotification: boolean;
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

type MiniUserModel = Pick<UserModel, "id" | "email" | "profileImageUrl">;

export { UserModel, MiniUserModel, UserAccountType };
