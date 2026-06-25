import type { BaseModel } from "./base";

export type UserRoleType = "admin" | "manager";
export type UserGenderType = "male" | "female" | "other";

export interface UserData extends BaseModel {
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

export type UserSettingsData = {
  notifications: {
    pushEnabled: boolean;
    emailEnabled: boolean;
    smsEnabled: boolean;
  };
};

export type UserBusinessData = {
  businessIds: string[];
  businessRoleTypes: Record<string, UserRoleType[]>;
};

export type VerificationData = {
  emailVerified: boolean;
  phoneVerified: boolean;
  authProviders: string[];
};

export type MiniUserData = Pick<UserData, "id" | "email" | "profileImageUrl">;
