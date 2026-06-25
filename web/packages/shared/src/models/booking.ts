import type { BaseModel } from "./base";
import type { TimezoneData } from "./availability";
import type { OfferingType } from "./offering";

export type BookingStatusType =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";

export type BookingParticipantType = "contact" | "team_member" | "guest";
export type BookingParticipantRoleType = "host" | "attendee";
export type BookingParticipantStatusType =
  | "pending"
  | "accepted"
  | "declined"
  | "cancelled";

export type MiniServiceData = {
  id: string;
  name: string;
  type: OfferingType;
  duration?: number | null;
};

export type BookingParticipant = {
  contactId?: string | null;
  userId?: string | null;
  name: string;
  email?: string | null;
  phoneNumber?: string | null;
  type: BookingParticipantType;
  role: BookingParticipantRoleType;
  status: BookingParticipantStatusType;
  comment?: string | null;
  timezone?: TimezoneData | null;
};

export type BookingTimeData = {
  startAt: number;
  endAt: number;
  timezone: TimezoneData;
};

export interface BookingData extends BaseModel {
  businessId: string;
  availabilityId?: string | null;
  createdBy: string;
  service: MiniServiceData;
  participants: BookingParticipant[];
  status: BookingStatusType;
  when: BookingTimeData;
  metadata?: Record<string, unknown> | null;
}
