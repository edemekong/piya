import type { BaseModel } from "./base";

export type Providers = "cloudflare" | "resend" | "whatsapp_cloud" | "link_mobility";
export type DomainType = "portal" | "email";
export type DomainStatusType = "pending" | "active" | "failed" | "disabled";
export type DNSRecordType = "TXT" | "CNAME" | "MX";
export type DNSRecordStatusType = "pending" | "verified" | "failed";

export type DNSRecord = {
  type: DNSRecordType;
  name: string;
  value: string;
  status: DNSRecordStatusType;
};

export interface DomainData extends BaseModel {
  businessId: string;
  domain: string;
  type: DomainType;
  provider: Extract<Providers, "cloudflare">;
  status: DomainStatusType;
  records: DNSRecord[];
  verifiedAt?: number | null;
  lastError?: string | null;
}
