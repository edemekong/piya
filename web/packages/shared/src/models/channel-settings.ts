import type { BaseModel } from "./base";
import type { Providers } from "./domain";

export type ChannelProviderStatusType =
  | "not_connected"
  | "pending"
  | "active"
  | "failed"
  | "disabled";

export type SMSSenderType =
  | "shared"
  | "alphanumeric"
  | "phone_number"
  | "short_code";

export type SMSRegistrationStatusType =
  | "not_required"
  | "pending"
  | "approved"
  | "rejected";

export type EmailChannelSettings = {
  provider: Extract<Providers, "resend">;
  status: ChannelProviderStatusType;
  fromName: string;
  fromEmail: string;
  replyToEmail?: string | null;
  domain: string;
  providerDomainId?: string | null;
  credentialReference?: string | null;
  lastError?: string | null;
};

export type WhatsAppChannelSettings = {
  provider: Extract<Providers, "whatsapp_cloud">;
  status: ChannelProviderStatusType;
  businessAccountId?: string | null;
  phoneNumberId?: string | null;
  phoneNumber?: string | null;
  displayPhoneNumber?: string | null;
  displayName?: string | null;
  qualityRating?: string | null;
  credentialReference?: string | null;
  lastError?: string | null;
};

export type SMSChannelSettings = {
  provider: Extract<Providers, "link_mobility">;
  status: ChannelProviderStatusType;
  senderId: string;
  senderType: SMSSenderType;
  countryCode: string;
  registrationStatus: SMSRegistrationStatusType;
  credentialReference?: string | null;
  lastError?: string | null;
};

export interface ChannelSettingsData extends BaseModel {
  businessId: string;
  email?: EmailChannelSettings | null;
  whatsapp?: WhatsAppChannelSettings | null;
  sms?: SMSChannelSettings | null;
}
