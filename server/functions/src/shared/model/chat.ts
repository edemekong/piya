import { BaseModel } from "./base";

type ChatProfileRoleType = "owner" | "manager" | "contact";
type ChatChannelType = "whatsapp" | "email" | "sms" | "native_app";
type MessageDirectionType = "inbound" | "outbound";

type MessageDeliveryStatusType =
  | "queued"
  | "sending"
  | "sent"
  | "delivered"
  | "read"
  | "opened"
  | "clicked"
  | "failed";

interface ChatData extends BaseModel {
  chatId: string;
  businessId: string;
  contactId: string;
  participants: Array<ChatUserProfile>;
  lastMessage?: Message | null;
  activeChannels: Array<ChatChannelType>;
  isArchived: boolean;
  metadata?: Record<string, any> | null;
}

interface ChatUserProfile {
  role: ChatProfileRoleType;
  name: string;
  profileImageUrl?: string | null;
  lastReadMessageCount: number;

  email?:  string;
  phoneNumber?: string;
  contactId: string;

  online: boolean;
  lastSeenAt: number;
}

interface Message extends BaseModel {
  chatId: string;
  businessId: string;
  userId: string;
  role: ChatProfileRoleType;
  channel: ChatChannelType;
  direction: MessageDirectionType;
  provider?: "resend" | "whatsapp_cloud" | "link_mobility" | null;

  providerMessageId?: string | null;
  providerParentId?: string | null;
  
  content: MessageContent;
  status: MessageDeliveryStatusType;
  error?: string | null;
}

interface MessageContent {
  text: string;
  mediaUrls?: Array<string>;
  subject?: string | null;
}

export {
  ChatData,
  ChatUserProfile,
  Message,
  MessageContent,
  ChatProfileRoleType,
  ChatChannelType,
  MessageDeliveryStatusType
};
