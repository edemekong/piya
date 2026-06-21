import { BaseModel } from "./base";
import { TimezoneData } from "./availability";
import { ServiceType } from "./service";

type BookingStatusType =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";

type BookingParticipantType =
  | "contact"
  | "team_member"
  | "guest";

type BookingParticipantRoleType =
  | "host"
  | "attendee";

type BookingParticipantStatusType =
  | "pending"
  | "accepted"
  | "declined"
  | "cancelled";

interface BookingData extends BaseModel {
  businessId: string;
  availabilityId?: string | null;
  createdBy: string;
  service: MiniServiceData;
  participants: BookingParticipant[];
  status: BookingStatusType;
  when: BookingTimeData;
  metadata?: Record<string, any> | null;
}

interface MiniServiceData {
  id: string;
  name: string;
  type: ServiceType;
  duration?: number | null;
}

interface BookingParticipant {
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
}

interface BookingTimeData {
  startAt: number;
  endAt: number;
  timezone: TimezoneData;
}

export {
  BookingData,
  MiniServiceData,
  BookingParticipant,
  BookingTimeData,
  BookingStatusType,
  BookingParticipantType,
  BookingParticipantRoleType,
  BookingParticipantStatusType,
};
