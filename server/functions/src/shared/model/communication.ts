import type {
  CommunicationEventType,
  CommunicationFrequency,
} from "../types/communication.type";
import type { BaseModel } from "./base";

type CommunicationChannel = "email" | "sms" | "whatsapp";
type CommunicationStatus = "active" | "paused";

interface CommunicationData extends BaseModel {
  name: string;
  businessId: string;
  createdBy: string;
  isActive: boolean;
  status: CommunicationStatus;
  stats: CommunicationStats;
  type: CommunicationEventType;
  hasPendingBatch: boolean;
  lastExecutedAt?: number | null;
  lastCursor?: string | null;
  steps: Record<string, CommunicationStep>;
  stepsOrder: string[];
  trigger: CommunicationTrigger;
  targetAudience?: AudienceFilter | null;
}
interface CommunicationStep {
  channel: CommunicationChannel;
  identityId?: string | null;
  delay: number;
  message: CommunicationMessage;
  ctas: CommunicationCTA[];
  template?: CommunicationTemplate | null;
}
interface CommunicationTemplate {
  providerTemplateId?: string | null;
  name: string;
  language?: string | null;
  variables?: Record<string, string> | null;
}
interface CommunicationTrigger {
  type: CommunicationEventType;
  schedule?: CommunicationSchedule | null;
}
interface CommunicationSchedule {
  frequency: CommunicationFrequency;
  dayOfWeek: number;
  hour: number;
  minute: number;
  startDate: number;
  timezone: string;
}
interface CommunicationMessage {
  subject?: string | null;
  body: string;
}
interface CommunicationCTA {
  label: string;
  url: string;
  type: string;
}
interface AudienceFilter {
  targetTags?: string[];
  targetBadgeTypes?: string[];
  segmentQuery?: Record<string, any>;
}
interface CommunicationStats {
  recipients: number;
  delivered: number;
  failed: number;
  pending: number;
}
interface CommunicationRecipient {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  status: "pending" | "delivered" | "failed";
  channel: CommunicationChannel;
  lastActivityAt: number;
}

export {
  CommunicationChannel,
  CommunicationData,
  CommunicationStep,
  CommunicationTemplate,
  CommunicationTrigger,
  CommunicationSchedule,
  CommunicationMessage,
  CommunicationCTA,
  AudienceFilter,
  CommunicationRecipient,
  CommunicationStats,
  CommunicationStatus,
};
