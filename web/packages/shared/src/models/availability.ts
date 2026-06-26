import type {
  AvailabilityIntervalType,
  AvailabilityStatusType,
} from "../types/availability.type";
import type { BaseModel } from "./base";

interface AvailabilityData extends BaseModel {
  businessId: string;
  createdBy: string;
  name: string;
  isPrimary: boolean;
  status: AvailabilityStatusType;
  timezone: TimezoneData;
  intervalMinutes: number;
  timeslots: Record<string, Record<string, AvailabilityInterval>>;
}
interface AvailabilityInterval {
  id: string;
  date: DateAt;
  startTime: TimeAt;
  endTime: TimeAt;
  type: AvailabilityIntervalType;
}
interface AvailableEventSlot {
  id: string;
  startAt: number;
  endAt: number;
}
interface TimeAt {
  hour: number;
  minute: number;
}
interface DateAt {
  day: number;
  month: number;
  year: number;
}
interface TimezoneData {
  id: string;
  name: string;
  offsetInMilliseconds: number;
}

export type {
  AvailabilityData,
  AvailabilityInterval,
  AvailableEventSlot,
  TimeAt,
  DateAt,
  TimezoneData,
};
