import { z } from "zod";

const badgeRuleSchema = z
  .object({
    metric: z.enum([
      "points_at_least",
      "orders_at_least",
      "total_spend_at_least",
      "manual",
    ]),
    currency: z.enum(["NGN", "USD", "GHS", "KES", "ZAR"]).optional().nullable(),
    value: z.number().int().nonnegative().optional().nullable(),
  })
  .strict()
  .superRefine((rule, context) => {
    if (rule.metric === "manual") return;

    if (rule.value === undefined || rule.value === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Rule value is required",
        path: ["value"],
      });
    }

    if (rule.metric === "total_spend_at_least" && !rule.currency) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Currency is required",
        path: ["currency"],
      });
    }
  })
  .transform((rule) => ({
    metric: rule.metric,
    currency: rule.metric === "total_spend_at_least" ? rule.currency : null,
    value: rule.metric === "manual" ? null : rule.value ?? null,
  }));

const badgeBodySchema = z
  .object({
    name: z.string().trim().min(1).max(80),
    description: z.string().trim().min(1).max(240),
    icon: z
      .string()
      .trim()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .max(120)
      .optional()
      .nullable()
      .transform((icon) => icon || null),
    rule: badgeRuleSchema,
    token: z.unknown().optional(),
    user: z.unknown().optional(),
  })
  .strict()
  .transform(({ token: _token, user: _user, ...badge }) => badge);

const createBadgeSchema = badgeBodySchema;
const updateBadgeSchema = badgeBodySchema;

const badgeParamsSchema = z
  .object({
    id: z.string().trim().min(1).max(120),
  })
  .strict();

type CreateBadgeBody = z.infer<typeof createBadgeSchema>;
type UpdateBadgeBody = z.infer<typeof updateBadgeSchema>;
type BadgeParams = z.infer<typeof badgeParamsSchema>;

export {
  badgeParamsSchema,
  createBadgeSchema,
  updateBadgeSchema,
  BadgeParams,
  CreateBadgeBody,
  UpdateBadgeBody,
};
