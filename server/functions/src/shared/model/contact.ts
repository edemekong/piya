import { LocationData } from "../types/location";
import { BaseModel } from "./base";

type ContactStatusType = "active" | "inactive" | "lead" | "blocked";
type ContactBadgeType = "regular" | "bronze" | "silver" | "gold" | "platinum";

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
  tags: Array<string>;
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
  unsubscribedEmails: Array<string>;
  enableEmailNotifications: boolean;
  enableSMSNotifications: boolean;
  enableWhatsAppNotifications: boolean;
}

export { ContactData, ContactPreference, ContactBadge, ContactCounts, ContactBadgeType, ContactStatusType };
