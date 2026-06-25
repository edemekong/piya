export type CommunicationEventType =
  | "onboarding"
  | "birthday_congrats"
  | "anniversary_milestone"
  | "badge_upgraded"
  | "win_back_inactive"
  | "marketing_broadcast"
  | "discount_alert";

export type CommunicationFrequency =
  | "once"
  | "daily"
  | "weekly"
  | "monthly"
  | "cron";

export type CommunicationChannel = "email" | "sms" | "whatsapp";

export type CommunicationStatus = "active" | "paused" | "draft";

export type CommunicationSchedule = {
  frequency: CommunicationFrequency;
  dayOfWeek: number;
  hour: number;
  minute: number;
  startDate: number;
  timezone: string;
};

export type CommunicationMessage = {
  subject?: string | null;
  body: string;
};

export type CommunicationCTA = {
  label: string;
  url: string;
  type: string;
};

export type CommunicationTemplate = {
  providerTemplateId?: string | null;
  name: string;
  language?: string | null;
  variables?: Record<string, string> | null;
};

export type CommunicationStep = {
  channel: CommunicationChannel;
  identityId?: string | null;
  delay: number;
  message: CommunicationMessage;
  ctas: CommunicationCTA[];
  template?: CommunicationTemplate | null;
};

export type CommunicationTrigger = {
  type: CommunicationEventType;
  schedule?: CommunicationSchedule | null;
};

export type AudienceFilter = {
  targetTags?: string[];
  targetBadgeTypes?: string[];
  segmentQuery?: Record<string, unknown>;
};

export type CommunicationData = {
  id: string;
  createdAt: number;
  updatedAt: number;
  name: string;
  businessId: string;
  createdBy: string;
  isActive: boolean;
  status: CommunicationStatus;
  type: CommunicationEventType;
  hasPendingBatch: boolean;
  lastExecutedAt?: number | null;
  lastCursor?: string | null;
  steps: Record<string, CommunicationStep>;
  stepsOrder: string[];
  trigger: CommunicationTrigger;
  targetAudience?: AudienceFilter | null;
  stats: {
    recipients: number;
    delivered: number;
    failed: number;
    pending: number;
  };
};

export type CommunicationRecipient = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  status: "pending" | "delivered" | "failed";
  channel: CommunicationChannel;
  lastActivityAt: number;
};

export type CommunicationEditorMode = "create" | "edit";
