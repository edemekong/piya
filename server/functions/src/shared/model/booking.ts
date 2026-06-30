import type {
  BookingParticipantRoleType,
  BookingParticipantStatusType,
  BookingParticipantType,
  BookingStatusType,
} from "../types/booking.type";
import type { ServiceType } from "../types/service.type";
import type { BaseModel } from "./base";
import type { TimezoneData } from "./availability";

interface BookingData extends BaseModel {
  businessId: string;
  orderId: string;
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

export { BookingData, MiniServiceData, BookingParticipant, BookingTimeData };
