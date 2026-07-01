import type {
  AudienceFilter,
  CommunicationCTA,
  CommunicationChannel,
  CommunicationData,
  CommunicationMessage,
  CommunicationSchedule,
  CommunicationStats,
  CommunicationStatus,
  CommunicationTemplate,
  CommunicationTrigger,
} from "../models";

export type CommunicationAdminStep = {
  channel: CommunicationChannel;
  identityId?: string | null;
  delay: number;
  message: CommunicationMessage;
  ctas: CommunicationCTA[];
  template?: CommunicationTemplate | null;
};

export type CommunicationAdminStats = CommunicationStats;

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

export type {
  CommunicationChannel,
  CommunicationSchedule,
  CommunicationStatus,
};
