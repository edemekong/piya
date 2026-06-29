import type { ContactStatusType } from "../types/contact.type";
import type { UserGenderType } from "../types/user.type";
import type { BaseModel } from "./base";
import type { LocationData } from "./location";

interface ContactData extends BaseModel {
  userId?: string | null;
  code: string;
  createdBy: string;
  businessId: string;
  name: string;
  profileImageUrl?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  countryCode?: string | null;
  address?: LocationData | null;
  badge: ContactBadge;
  dob?: string | null;
  gender?: UserGenderType | null;
  bmd?: string | null;
  preference: ContactPreference;
  status: ContactStatusType;
  lastInteractionAt: number;
  anniversary?: string | null;
  tags: string[];
  searchTokens?: string[];
  counts: ContactCounts;
  metadata?: Record<string, any> | null;
}
interface ContactBadge {
  badgeId: string;
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
