import { z } from "zod";

const optionalTrimmedString = z
  .string()
  .trim()
  .max(500)
  .optional()
  .nullable()
  .transform((value) => value || null);

const createDemoLeadRequestSchema = z.object({
  type: z.literal("demo"),
  data: z.object({
    fullName: z.string().trim().min(1).max(120),
    workEmail: z.string().trim().email().max(180),
    businessName: z.string().trim().min(1).max(160),
    phone: optionalTrimmedString,
    businessSize: optionalTrimmedString,
    demoFocus: z.string().trim().min(1).max(180),
    notes: optionalTrimmedString,
  }),
});

const createRemindMeLeadRequestSchema = z.object({
  type: z.literal("remind_me"),
  data: z.object({
    email: z.string().trim().email().max(180),
  }),
});

const createLeadRequestSchema = z.discriminatedUnion("type", [
  createDemoLeadRequestSchema,
  createRemindMeLeadRequestSchema,
]);

type CreateLeadRequestBody = z.infer<typeof createLeadRequestSchema>;

export {
  createLeadRequestSchema,
  CreateLeadRequestBody,
};
