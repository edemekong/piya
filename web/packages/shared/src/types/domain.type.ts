type Providers = "cloudflare" | "resend" | "whatsapp_cloud" | "link_mobility";
type DomainType = "portal" | "email";
type DomainStatusType = "pending" | "active" | "failed" | "disabled";
type DNSRecordType = "TXT" | "CNAME" | "MX";
type DNSRecordStatusType = "pending" | "verified" | "failed";
export type {
  Providers,
  DomainType,
  DomainStatusType,
  DNSRecordType,
  DNSRecordStatusType,
};
