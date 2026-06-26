import type {
  DNSRecordStatusType,
  DNSRecordType,
  DomainStatusType,
  DomainType,
  Providers,
} from "../types/domain.type";
import type { BaseModel } from "./base";

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
  verifiedAt?: number | null;
  lastError?: string | null;
}

export type { DomainData, DNSRecord };
