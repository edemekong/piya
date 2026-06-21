import type {
  ChannelProviderStatusType,
  SMSRegistrationStatusType,
  SMSSenderType,
} from "../types/channel-settings.type";
import type { Providers } from "../types/domain.type";
import type { BaseModel } from "./base";

interface ChannelSettingsData extends BaseModel {
  businessId: string;
  email?: EmailChannelSettings | null;
  whatsapp?: WhatsAppChannelSettings | null;
  sms?: SMSChannelSettings | null;
}
interface EmailChannelSettings {
  provider: Extract<Providers, "resend">;
  status: ChannelProviderStatusType;
  fromName: string;
  fromEmail: string;
  replyToEmail?: string | null;
  domain: string;
  providerDomainId?: string | null;
  credentialReference?: string | null;
  lastError?: string | null;
}
interface WhatsAppChannelSettings {
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
}
interface SMSChannelSettings {
  provider: Extract<Providers, "link_mobility">;
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
