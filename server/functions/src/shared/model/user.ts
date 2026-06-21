import { LocationData } from "../types/location";
import { BaseModel } from "./base";

type UserRoleType = "admin" | "manager";

interface UserData extends BaseModel {
  email: string;
  phoneNumber?: string | null;
  name: string;
  profileImageUrl?: string;
  business?: UserBusinessData | null;
  verification: VerificationData;
  lastKnownLocation?: LocationData | null;
  settings: UserSettingsData;
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

type MiniUserModel = Pick<UserData, "id" | "email" | "profileImageUrl">;

export { UserData as UserModel, MiniUserModel };
