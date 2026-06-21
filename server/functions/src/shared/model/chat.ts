import { BaseModel } from "./base";

type ChatProfileRoleType = "owner" | "manager" | "contact";
type ChatChannelType = "whatsapp" | "email" | "sms" | "native_app";
type MessageDeliveryStatusType = "sending" | "sent" | "delivered" | "read" | "failed";

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
  
  vendorMessageId?: string | null;
  vendorParentId?: string | null;

  content: MessageContent;
  status: MessageDeliveryStatusType;
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
