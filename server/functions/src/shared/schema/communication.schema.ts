import { z } from "zod";

const communicationChannelSchema = z.enum(["email", "sms", "whatsapp"]);
const communicationEventSchema = z.enum([
  "onboarding",
  "birthday_congrats",
  "anniversary_milestone",
  "badge_upgraded",
  "win_back_inactive",
  "marketing_broadcast",
  "discount_alert",
]);
const communicationFrequencySchema = z.enum([
  "once",
  "daily",
  "weekly",
  "monthly",
  "cron",
]);
const communicationStatusSchema = z.enum(["active", "paused"]);

const communicationScheduleSchema = z
  .object({
    dayOfWeek: z.number().int().min(0).max(6),
    frequency: communicationFrequencySchema,
    hour: z.number().int().min(0).max(23),
    minute: z.number().int().min(0).max(59),
    startDate: z.number().positive(),
    timezone: z.string().trim().min(1).max(80),
  })
  .strict();

const communicationMessageSchema = z
  .object({
    body: z.string().trim().min(1).max(5000),
    subject: z.string().trim().max(200).optional().nullable(),
  })
  .strict();

const communicationCtaSchema = z
  .object({
    label: z.string().trim().min(1).max(80),
    type: z.string().trim().min(1).max(40),
    url: z.string().trim().url().max(2048),
  })
  .strict();

const communicationTemplateSchema = z
  .object({
    language: z.string().trim().max(20).optional().nullable(),
    name: z.string().trim().max(120),
    providerTemplateId: z.string().trim().max(160).optional().nullable(),
    variables: z.record(z.string(), z.string()).optional().nullable(),
  })
  .strict();

const communicationStepSchema = z
  .object({
    channel: communicationChannelSchema,
    ctas: z.array(communicationCtaSchema).max(3),
    delay: z.number().int().nonnegative(),
    identityId: z.string().trim().max(160).optional().nullable(),
    message: communicationMessageSchema,
    template: communicationTemplateSchema.optional().nullable(),
  })
  .strict()
  .superRefine((step, context) => {
    if (step.channel === "email" && !step.message.subject?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email subject is required",
        path: ["message", "subject"],
      });
    }
  });

const communicationTriggerSchema = z
  .object({
    schedule: communicationScheduleSchema.optional().nullable(),
    type: communicationEventSchema,
  })
  .strict();

const audienceFilterSchema = z
  .object({
    segmentQuery: z.record(z.string(), z.any()).optional(),
    targetBadgeTypes: z.array(z.string().trim().min(1).max(120)).optional(),
    targetTags: z.array(z.string().trim().min(1).max(120)).optional(),
  })
  .strict();

const communicationStatsSchema = z
  .object({
    delivered: z.number().int().nonnegative(),
    failed: z.number().int().nonnegative(),
    pending: z.number().int().nonnegative(),
    recipients: z.number().int().nonnegative(),
  })
  .strict();

const communicationBodySchema = z
  .object({
    businessId: z.string().optional(),
    createdAt: z.number().optional(),
    createdBy: z.string().optional(),
    hasPendingBatch: z.boolean().optional(),
    id: z.string().optional(),
    isActive: z.boolean(),
    lastCursor: z.string().trim().max(1000).optional().nullable(),
    lastExecutedAt: z.number().optional().nullable(),
    name: z.string().trim().min(1).max(100),
    stats: communicationStatsSchema.optional(),
    status: communicationStatusSchema,
    steps: z.record(z.string(), communicationStepSchema),
    stepsOrder: z.array(z.string().trim().min(1).max(120)).min(1).max(20),
    targetAudience: audienceFilterSchema.optional().nullable(),
    token: z.unknown().optional(),
    trigger: communicationTriggerSchema,
    type: communicationEventSchema,
    updatedAt: z.number().optional(),
    user: z.unknown().optional(),
  })
  .strict()
  .transform(
    ({
      businessId: _businessId,
      createdAt: _createdAt,
      createdBy: _createdBy,
      id: _id,
      token: _token,
      updatedAt: _updatedAt,
      user: _user,
      ...communication
    }) => communication,
  )
  .superRefine((communication, context) => {
    if (communication.type !== communication.trigger.type) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Communication type must match trigger type",
        path: ["type"],
      });
    }
  });

const createCommunicationSchema = communicationBodySchema;
const updateCommunicationSchema = communicationBodySchema;

const communicationParamsSchema = z
  .object({
    communicationId: z.string().trim().min(1).max(120),
  })
  .strict();

type CommunicationParams = z.infer<typeof communicationParamsSchema>;
type CreateCommunicationBody = z.infer<typeof createCommunicationSchema>;
type UpdateCommunicationBody = z.infer<typeof updateCommunicationSchema>;

export {
  communicationParamsSchema,
  createCommunicationSchema,
  updateCommunicationSchema,
  CommunicationParams,
  CreateCommunicationBody,
  UpdateCommunicationBody,
};
