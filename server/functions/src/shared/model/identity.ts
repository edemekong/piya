import { BaseModel } from "./base";

type IdentityChannelType = "email" | "whatsapp" | "sms";

type IdentityProviderType =
  | "resend"
  | "whatsapp_cloud"
  | "link_mobility";

type IdentityStatusType =
  | "pending"
  | "active"
  | "failed"
  | "disabled";

type SmsSenderType =
  | "shared"
  | "alphanumeric"
  | "phone_number"
  | "short_code";

type SmsRegistrationStatusType =
  | "not_required"
  | "pending"
  | "approved"
  | "rejected";

type DnsRecordType =
  | "TXT"
  | "CNAME"
  | "MX";

type DnsRecordStatusType =
  | "pending"
  | "verified"
  | "failed";

interface BusinessIdentityData extends BaseModel {
  businessId: string;
  createdBy: string;
  name: string;
  channel: IdentityChannelType;
  provider: IdentityProviderType;
  displayName: string;
  status: IdentityStatusType;
  isDefault: boolean;
  email?: EmailIdentityData | null;
  whatsapp?: WhatsAppIdentityData | null;
  sms?: SmsIdentityData | null;
  providerAccountId?: string | null;
  providerIdentityId?: string | null;
  credentialRef?: string | null;
  lastError?: string | null;
}

interface EmailIdentityData {
  fromEmail: string;
  replyToEmail?: string | null;
  domain: string;
  providerDomainId?: string | null;
  dnsRecords: IdentityDnsRecord[];
}

interface WhatsAppIdentityData {
  businessAccountId: string;
  phoneNumberId: string;
  phoneNumber: string;
  displayPhoneNumber?: string | null;
  qualityRating?: string | null;
}

interface SmsIdentityData {
  senderId: string;
  senderType: SmsSenderType;
  countryCode: string;
  registrationStatus: SmsRegistrationStatusType;
}

interface IdentityDnsRecord {
  type: DnsRecordType;
  name: string;
  value: string;
  status: DnsRecordStatusType;
}

export {
  BusinessIdentityData,
  EmailIdentityData,
  WhatsAppIdentityData,
  SmsIdentityData,
  IdentityDnsRecord,
  IdentityChannelType,
  IdentityProviderType,
  IdentityStatusType,
  SmsSenderType,
  SmsRegistrationStatusType,
  DnsRecordType,
  DnsRecordStatusType,
};