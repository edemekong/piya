import type {
  AudienceFilter,
  CommunicationCTA,
  CommunicationData,
  CommunicationMessage,
  CommunicationSchedule,
  CommunicationTemplate,
  CommunicationTrigger,
} from "../models";

export type CommunicationChannel = "email" | "sms" | "whatsapp";

export type CommunicationStatus = "active" | "paused" | "draft";

export type CommunicationAdminStep = {
  channel: CommunicationChannel;
  identityId?: string | null;
  delay: number;
  message: CommunicationMessage;
  ctas: CommunicationCTA[];
  template?: CommunicationTemplate | null;
};

export type CommunicationAdminStats = {
  recipients: number;
  delivered: number;
  failed: number;
  pending: number;
};

export type CommunicationAdminData = Omit<
  CommunicationData,
  "steps" | "trigger" | "targetAudience"
> & {
  status: CommunicationStatus;
  stats: CommunicationAdminStats;
  steps: Record<string, CommunicationAdminStep>;
  trigger: CommunicationTrigger;
  targetAudience?: AudienceFilter | null;
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

export type { CommunicationSchedule };
