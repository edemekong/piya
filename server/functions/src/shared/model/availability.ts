import { BaseModel } from "./base";

type AvailabilityStatusType =
  | "active"
  | "disabled";

type AvailabilityIntervalType =
  | "available"
  | "blocked";

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

export {
  AvailabilityData,
  AvailabilityInterval,
  AvailableEventSlot,
  TimeAt,
  DateAt,
  TimezoneData,
  AvailabilityStatusType,
  AvailabilityIntervalType,
};
