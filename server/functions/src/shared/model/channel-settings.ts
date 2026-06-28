import type {
  ChannelProviderType,
  ChannelProviderStatusType,
  SMSRegistrationStatusType,
  SMSSenderType,
} from "../types/channel-settings.type";
import type { BaseModel } from "./base";

interface ChannelSettingsData extends BaseModel {
  businessId: string;
  email?: EmailChannelSettings | null;
  whatsapp?: WhatsAppChannelSettings | null;
  sms?: SMSChannelSettings | null;
}
interface EmailChannelSettings {
  provider: Extract<ChannelProviderType, "resend">;
  status: ChannelProviderStatusType;
  fromEmail: string;
  replyToEmail: string;
}
interface WhatsAppChannelSettings {
  provider: Extract<ChannelProviderType, "whatsapp_cloud">;
  status: ChannelProviderStatusType;
  businessAccountId?: string | null;
  wabaId?: string | null;
  phoneNumberId?: string | null;
  phoneNumber?: string | null;
  displayPhoneNumber?: string | null;
  displayName?: string | null;
  qualityRating?: string | null;
  credentialReference?: string | null;
  connectedAt?: number | null;
  disconnectedAt?: number | null;
  lastSyncedAt?: number | null;
  lastError?: string | null;
}
interface SMSChannelSettings {
  provider: Extract<ChannelProviderType, "link_mobility">;
  status: ChannelProviderStatusType;
  senderId: string;
  senderType: SMSSenderType;
  countryCode: string;
  registrationStatus: SMSRegistrationStatusType;
  credentialReference?: string | null;
  lastError?: string | null;
}

export {
  ChannelSettingsData,
  EmailChannelSettings,
  WhatsAppChannelSettings,
  SMSChannelSettings,
};
