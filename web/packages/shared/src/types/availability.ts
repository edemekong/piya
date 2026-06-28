import type { AvailabilityData } from "../models";

type AvailabilityTimeSlot = {
  endTime: string;
  id: string;
  startTime: string;
};

type AvailabilityDay = {
  day: number;
  enabled: boolean;
  slots: AvailabilityTimeSlot[];
};

type AvailabilityScheduleDraft = {
  days: AvailabilityDay[];
  timezone: string;
};

type AvailabilityPayload = {
  availability: AvailabilityData | null;
};

export type {
  AvailabilityDay,
  AvailabilityPayload,
  AvailabilityScheduleDraft,
  AvailabilityTimeSlot,
};
