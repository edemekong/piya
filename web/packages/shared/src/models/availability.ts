import type { BaseModel } from "./base";

export type AvailabilityStatusType = "active" | "disabled";
export type AvailabilityIntervalType = "available" | "blocked";

export type TimeAt = {
  hour: number;
  minute: number;
};

export type DateAt = {
  day: number;
  month: number;
  year: number;
};

export type TimezoneData = {
  id: string;
  name: string;
  offsetInMilliseconds: number;
};

export type AvailabilityInterval = {
  id: string;
  date: DateAt;
  startTime: TimeAt;
  endTime: TimeAt;
  type: AvailabilityIntervalType;
};

export type AvailableEventSlot = {
  id: string;
  startAt: number;
  endAt: number;
};

export interface AvailabilityData extends BaseModel {
  businessId: string;
  createdBy: string;
  name: string;
  isPrimary: boolean;
  status: AvailabilityStatusType;
  timezone: TimezoneData;
  intervalMinutes: number;
  timeslots: Record<string, Record<string, AvailabilityInterval>>;
}
