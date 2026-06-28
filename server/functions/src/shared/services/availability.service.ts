import { db } from "../../configs/firebase";
import type {
  AvailabilityData,
  AvailabilityInterval,
} from "../model/availability";
import type { UpdateAvailabilityScheduleBody } from "../schema/availability.schema";
import { BUSINESS_SUBCOLLECTIONS, COLLECTIONS } from "../utils/collections";
import { getUTCTimeNow } from "../utils/helpers/helper-functions";
import { parseTimeAt } from "../utils/time";

const PRIMARY_AVAILABILITY_ID = "primary";
const DEFAULT_INTERVAL_MINUTES = 30;

export class AvailabilityService {
  static async getPrimaryAvailability(
    businessId: string,
  ): Promise<AvailabilityData | null> {
    const snapshot = await this.primaryAvailabilityDocument(businessId).get();
    return snapshot.exists ? (snapshot.data() as AvailabilityData) : null;
  }

  static async upsertPrimaryAvailability(params: {
    businessId: string;
    createdBy: string;
    schedule: UpdateAvailabilityScheduleBody;
  }): Promise<AvailabilityData> {
    const { businessId, createdBy, schedule } = params;
    const documentRef = this.primaryAvailabilityDocument(businessId);
    const snapshot = await documentRef.get();
    const existingAvailability = snapshot.exists
      ? (snapshot.data() as AvailabilityData)
      : null;
    const now = getUTCTimeNow();
    const availability: AvailabilityData = {
      id: existingAvailability?.id ?? PRIMARY_AVAILABILITY_ID,
      businessId,
      createdBy: existingAvailability?.createdBy ?? createdBy,
      name: existingAvailability?.name ?? "Working Hours",
      isPrimary: true,
      status: "active",
      timezone: {
        id: schedule.timezone,
        name: schedule.timezone,
        offsetInMilliseconds:
          existingAvailability?.timezone.id === schedule.timezone
            ? existingAvailability.timezone.offsetInMilliseconds
            : 0,
      },
      intervalMinutes:
        existingAvailability?.intervalMinutes ?? DEFAULT_INTERVAL_MINUTES,
      timeslots: this.createTimeslots(schedule),
      createdAt: existingAvailability?.createdAt ?? now,
      updatedAt: now,
    };

    await documentRef.set(availability, { merge: true });
    return availability;
  }

  private static createTimeslots(schedule: UpdateAvailabilityScheduleBody) {
    const currentDate = new Date();

    return schedule.days.reduce<AvailabilityData["timeslots"]>((days, day) => {
      if (!day.enabled || day.slots.length === 0) return days;

      const intervals = day.slots.reduce<Record<string, AvailabilityInterval>>(
        (slots, slot) => {
          slots[slot.id] = {
            id: slot.id,
            date: {
              day: day.day,
              month: currentDate.getUTCMonth() + 1,
              year: currentDate.getUTCFullYear(),
            },
            startTime: parseTimeAt(slot.startTime),
            endTime: parseTimeAt(slot.endTime),
            type: "available",
          };
          return slots;
        },
        {},
      );

      if (Object.keys(intervals).length > 0) {
        days[String(day.day)] = intervals;
      }

      return days;
    }, {});
  }

  private static primaryAvailabilityDocument(businessId: string) {
    return db()
      .collection(COLLECTIONS.business)
      .doc(businessId)
      .collection(BUSINESS_SUBCOLLECTIONS.availability)
      .doc(PRIMARY_AVAILABILITY_ID);
  }
}
