import type { AvailabilityData } from "../models";
import type {
  AvailabilityDay,
  AvailabilityScheduleDraft,
  AvailabilityTimeSlot,
} from "../types/availability";

const availabilityDayLabels = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const availabilityTimezoneOptions = [
  { label: "Africa/Lagos (GMT+01:00)", value: "Africa/Lagos" },
  { label: "Africa/Accra (GMT)", value: "Africa/Accra" },
  { label: "Europe/Stockholm (CET/CEST)", value: "Europe/Stockholm" },
  { label: "Europe/London (GMT/BST)", value: "Europe/London" },
  { label: "America/New_York (ET)", value: "America/New_York" },
  { label: "America/Chicago (CT)", value: "America/Chicago" },
  { label: "America/Los_Angeles (PT)", value: "America/Los_Angeles" },
  { label: "UTC", value: "UTC" },
];

function createDefaultAvailabilitySchedule(
  timezone = getDefaultTimezone(),
): AvailabilityScheduleDraft {
  return {
    timezone,
    days: createInitialAvailabilityDays(),
  };
}

function createAvailabilityTimeSlot(day: number): AvailabilityTimeSlot {
  if (day === 1) {
    return {
      endTime: "10:00",
      id: `slot_${day}_default`,
      startTime: "09:00",
    };
  }

  if (day === 3) {
    return {
      endTime: "16:00",
      id: `slot_${day}_default`,
      startTime: "12:00",
    };
  }

  return {
    endTime: "16:00",
    id: `slot_${day}_default`,
    startTime: "09:00",
  };
}

function createEmptyAvailabilityDays(): AvailabilityDay[] {
  return availabilityDayLabels.map((_, index) => ({
    day: index + 1,
    enabled: false,
    slots: [],
  }));
}

function availabilityDataToScheduleDraft(
  availability?: AvailabilityData | null,
): AvailabilityScheduleDraft | undefined {
  if (!availability) return undefined;

  return {
    timezone: availability.timezone.id,
    days: availabilityDayLabels.map((_, index) => {
      const day = index + 1;
      const slots = Object.values(availability.timeslots[String(day)] ?? {}).map(
        (slot) => ({
          id: slot.id,
          startTime: timeAtToTimeValue(slot.startTime),
          endTime: timeAtToTimeValue(slot.endTime),
        }),
      );

      return {
        day,
        enabled: slots.length > 0,
        slots,
      };
    }),
  };
}

function getAvailabilityTimezoneOptions(selectedTimezone: string) {
  if (
    availabilityTimezoneOptions.some(
      (option) => option.value === selectedTimezone,
    )
  ) {
    return availabilityTimezoneOptions;
  }

  return [
    {
      label: selectedTimezone,
      value: selectedTimezone,
    },
    ...availabilityTimezoneOptions,
  ];
}

function addAvailabilitySlotMinutes(time: string, minutes: number) {
  const [hour = 0, minute = 0] = time.split(":").map(Number);
  const totalMinutes = Math.min(hour * 60 + minute + minutes, 24 * 60 - 1);
  const nextHour = Math.floor(totalMinutes / 60);
  const nextMinute = totalMinutes % 60;

  return `${String(nextHour).padStart(2, "0")}:${String(nextMinute).padStart(
    2,
    "0",
  )}`;
}

function createInitialAvailabilityDays(): AvailabilityDay[] {
  return availabilityDayLabels.map((_, index) => {
    const day = index + 1;
    const enabled = day <= 5;

    return {
      day,
      enabled,
      slots: enabled ? [createAvailabilityTimeSlot(day)] : [],
    };
  });
}

function getDefaultTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Stockholm";
}

function timeAtToTimeValue(time: { hour: number; minute: number }) {
  return `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(
    2,
    "0",
  )}`;
}

export {
  addAvailabilitySlotMinutes,
  availabilityDataToScheduleDraft,
  availabilityDayLabels,
  availabilityTimezoneOptions,
  createAvailabilityTimeSlot,
  createDefaultAvailabilitySchedule,
  createEmptyAvailabilityDays,
  getAvailabilityTimezoneOptions,
};
