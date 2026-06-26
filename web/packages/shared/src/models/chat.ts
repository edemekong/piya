import type {
  ChatChannelType,
  ChatProfileRoleType,
  MessageDeliveryStatusType,
  MessageDirectionType,
} from "../types/chat.type";
import type { BaseModel } from "./base";

interface ChatData extends BaseModel {
  chatId: string;
  businessId: string;
  contactId: string;
  participants: ChatUserProfile[];
  lastMessage?: Message | null;
  activeChannels: ChatChannelType[];
  isArchived: boolean;
  metadata?: Record<string, any> | null;
}
interface ChatUserProfile {
  role: ChatProfileRoleType;
  name: string;
  profileImageUrl?: string | null;
  lastReadMessageCount: number;
  email?: string;
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
  mediaUrls?: string[];
  subject?: string | null;
}

export type { ChatData, ChatUserProfile, Message, MessageContent };
