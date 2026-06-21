import { BaseModel } from "./base";

type CommunicationEventType =
  | "onboarding"
  | "birthday_congrats"
  | "anniversary_milestone"
  | "badge_upgraded"
  | "win_back_inactive"
  | "marketing_broadcast"
  | "discount_alert";

type CommunicationFrequency = "once" | "daily" | "weekly" | "monthly" | "cron";

interface CommunicationData extends BaseModel {
  name: string;
  businessId: string;
  createdBy: string;
  isActive: boolean;
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
  channel: CommunicationSchedule;
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

export {
  CommunicationData,
  CommunicationStep,
  CommunicationTrigger,
  CommunicationSchedule,
  CommunicationMessage,
  CommunicationCTA,
  CommunicationEventType,
  CommunicationFrequency,
};
