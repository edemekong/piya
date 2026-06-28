import type { WhatsAppChannelSettings } from "../models";

type CompleteWhatsAppConnectionInput = {
  wabaId: string;
  phoneNumberId: string;
  displayPhoneNumber: string;
  phoneNumber?: string | null;
  displayName?: string | null;
  qualityRating?: string | null;
};

type WhatsAppConnectionPayload = {
  businessId: string;
  connection: WhatsAppChannelSettings | null;
};

type SendWhatsAppMessageInput = {
  to: string;
  text: string;
};

type SendWhatsAppMessagePayload = {
  messageId: string | null;
  provider: "whatsapp_cloud";
  status: "accepted";
};

type WhatsAppWebhookEventPayload = {
  processed: boolean;
  businessId: string | null;
  phoneNumberId: string | null;
  messageCount: number;
  statusCount: number;
};

export type {
  CompleteWhatsAppConnectionInput,
  SendWhatsAppMessageInput,
  SendWhatsAppMessagePayload,
  WhatsAppConnectionPayload,
  WhatsAppWebhookEventPayload,
};
