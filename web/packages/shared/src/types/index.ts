export type BusinessType = "storefront" | "logistics" | "services";

export type Business = {
  id: string;
  name: string;
  type: BusinessType;
};

export type ContactStatus = "active" | "inactive" | "lead" | "blocked";
export type ContactBadgeType =
  | "regular"
  | "bronze"
  | "silver"
  | "gold"
  | "platinum";

export type ContactAddress = {
  address: string;
  city: string;
  state: string;
  serviceLocationId?: string | null;
  country: string;
  postalCode?: string;
  geoPoint?: {
    lat: number;
    lng: number;
  };
};

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

export type ContactData = {
  id: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
  code: string;
  createdBy: string;
  businessId: string;
  name: string;
  profileImageUrl?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  countryCode: string;
  address?: ContactAddress | null;
  badge: ContactBadge;
  dob?: string | null;
  bmd?: string | null;
  preference: ContactPreference;
  status: ContactStatus;
  lastInteractionAt: number;
  anniversary?: string | null;
  tags: string[];
  counts: ContactCounts;
  metadata?: Record<string, unknown> | null;
};

export type Contact = ContactData;
