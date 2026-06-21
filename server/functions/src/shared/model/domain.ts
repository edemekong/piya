import { BaseModel } from "./base";

type Providers = "cloudflare" | "resend" | "whatsapp_cloud" | "link_mobility";

type DomainType = "portal" | "email";

type DomainStatusType = "pending" | "active" | "failed" | "disabled";

type DNSRecordType = "TXT" | "CNAME" | "MX";

type DNSRecordStatusType =
  | "pending"
  | "verified"
  | "failed";


interface DNSRecord {
  type: DNSRecordType;
  name: string;
  value: string;
  status: DNSRecordStatusType;
}

interface DomainData extends BaseModel {
  businessId: string;
  domain: string;
  type: DomainType;
  provider: Extract<Providers, "cloudflare">;
  status: DomainStatusType;
  records: DNSRecord[];
  externalId?: string | null;
  verifiedAt?: number | null;
  lastError?: string | null;
}



export { DomainData, DomainType, DomainStatusType, Providers, DNSRecord };
