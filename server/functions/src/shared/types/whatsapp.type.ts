import type { WhatsAppChannelSettings } from "../model/channel-settings";

type WhatsAppConnectStatus = NonNullable<
  WhatsAppChannelSettings["status"]
>;

type CompleteWhatsAppConnectionBody = {
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

type SendWhatsAppMessageBody = {
  to: string;
  text: string;
};

type SendWhatsAppMessageResult = {
  messageId: string | null;
  provider: "whatsapp_cloud";
  status: "accepted";
};

type WhatsAppWebhookProcessResult = {
  processed: boolean;
  businessId: string | null;
  phoneNumberId: string | null;
  messageCount: number;
  statusCount: number;
};

export {
  CompleteWhatsAppConnectionBody,
  SendWhatsAppMessageBody,
  SendWhatsAppMessageResult,
  WhatsAppConnectStatus,
  WhatsAppConnectionPayload,
  WhatsAppWebhookProcessResult,
};
