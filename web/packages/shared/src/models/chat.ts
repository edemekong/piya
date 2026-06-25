import type { BaseModel } from "./base";
import type { Providers } from "./domain";

export type ChatProfileRoleType = "owner" | "manager" | "contact";
export type ChatChannelType = "whatsapp" | "email" | "sms" | "native_app";
export type MessageDirectionType = "inbound" | "outbound";
export type MessageDeliveryStatusType =
  | "queued"
  | "sending"
  | "sent"
  | "delivered"
  | "read"
  | "opened"
  | "clicked"
  | "failed";

export type ChatUserProfile = {
  role: ChatProfileRoleType;
  name: string;
  profileImageUrl?: string | null;
  lastReadMessageCount: number;
  email?: string;
  phoneNumber?: string;
  contactId: string;
  online: boolean;
  lastSeenAt: number;
};

export type MessageContent = {
  text: string;
  mediaUrls?: string[];
  subject?: string | null;
};

export interface Message extends BaseModel {
  chatId: string;
  businessId: string;
  userId: string;
  role: ChatProfileRoleType;
  channel: ChatChannelType;
  direction: MessageDirectionType;
  provider?: Exclude<Providers, "cloudflare"> | null;
  providerMessageId?: string | null;
  providerParentId?: string | null;
  content: MessageContent;
  status: MessageDeliveryStatusType;
  error?: string | null;
}

export interface ChatData extends BaseModel {
  chatId: string;
  businessId: string;
  contactId: string;
  participants: ChatUserProfile[];
  lastMessage?: Message | null;
  activeChannels: ChatChannelType[];
  isArchived: boolean;
  metadata?: Record<string, unknown> | null;
}
