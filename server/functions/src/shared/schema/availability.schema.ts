import { z } from "zod";

const timeValueSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Expected time format HH:mm");

const availabilityTimeSlotSchema = z.object({
  id: z.string().trim().min(1),
  startTime: timeValueSchema,
  endTime: timeValueSchema,
});

const availabilityDaySchema = z.object({
  day: z.number().int().min(1).max(7),
  enabled: z.boolean(),
  slots: z.array(availabilityTimeSlotSchema),
});

const updateAvailabilityScheduleSchema = z
  .object({
    days: z.array(availabilityDaySchema).length(7),
    timezone: z.string().trim().min(1),
    token: z.unknown().optional(),
    user: z.unknown().optional(),
  })
  .strict()
  .transform(({ token: _token, user: _user, ...data }) => data);

type UpdateAvailabilityScheduleBody = z.infer<
  typeof updateAvailabilityScheduleSchema
>;

export {
  updateAvailabilityScheduleSchema,
  UpdateAvailabilityScheduleBody,
};
