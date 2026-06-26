import type {
  ContactBadgeType,
  ContactStatusType,
} from "../types/contact.type";
import type { BaseModel } from "./base";
import type { LocationData } from "./location";

interface ContactData extends BaseModel {
  userId: string;
  code: string;
  createdBy: string;
  businessId: string;
  name: string;
  profileImageUrl?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  countryCode: string;
  address?: LocationData | null;
  badge: ContactBadge;
  dob?: string | null;
  bmd?: string | null;
  preference: ContactPreference;
  status: ContactStatusType;
  lastInteractionAt: number;
  anniversary?: string | null;
  tags: string[];
  counts: ContactCounts;
  metadata?: Record<string, any> | null;
}
interface ContactBadge {
  type: ContactBadgeType;
  points: number;
  updatedAt: number;
}
interface ContactCounts {
  lifetimeValue: number;
  totalOrders: number;
  messagesSentCount: number;
  messagesRepliedCount: number;
}
interface ContactPreference {
  unsubscribedEmailTypes: string[];
  smsEnabled: boolean;
  emailEnabled: boolean;
  whatsappEnabled: boolean;
}

export type { ContactData, ContactPreference, ContactBadge, ContactCounts };
