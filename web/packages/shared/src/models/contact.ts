import type { BaseModel } from "./base";
import type { LocationData } from "./location";

export type ContactStatusType = "active" | "inactive" | "lead" | "blocked";
export type ContactStatus = ContactStatusType;

export type ContactBadgeType =
  | "regular"
  | "bronze"
  | "silver"
  | "gold"
  | "platinum";

export type ContactBadge = {
  type: ContactBadgeType;
  points: number;
  updatedAt: number;
};

export type ContactCounts = {
  lifetimeValue: number;
  totalOrders: number;
  messagesSentCount: number;
  messagesRepliedCount: number;
};

export type ContactPreference = {
  unsubscribedEmailTypes: string[];
  smsEnabled: boolean;
  emailEnabled: boolean;
  whatsappEnabled: boolean;
};

export interface ContactData extends BaseModel {
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
  metadata?: Record<string, unknown> | null;
}

export type Contact = ContactData;
