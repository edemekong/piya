type ChannelProviderStatusType =
  | "not_connected"
  | "pending"
  | "active"
  | "failed"
  | "disabled";
type SMSSenderType = "shared" | "alphanumeric" | "phone_number" | "short_code";
type SMSRegistrationStatusType =
  | "not_required"
  | "pending"
  | "approved"
  | "rejected";
export type { ChannelProviderStatusType, SMSSenderType, SMSRegistrationStatusType };
