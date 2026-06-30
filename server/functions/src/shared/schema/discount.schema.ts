import { z } from "zod";

const discountStatusSchema = z.enum(["draft", "active", "paused", "expired"]);
const discountApplicabilityScopeSchema = z.enum([
  "all_offerings",
  "specific_offerings",
]);

const nullableTrimmedStringSchema = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => value || null);

const nullableStringListSchema = z
  .array(z.string().trim().min(1).max(120))
  .max(100)
  .optional()
  .nullable();

const discountRewardSchema = z.discriminatedUnion("type", [
  z
    .object({
      maxDiscountAmount: z.number().nonnegative().optional().nullable(),
      type: z.literal("percentage_discount"),
      value: z.number().nonnegative(),
    })
    .strict(),
  z
    .object({
      type: z.literal("fixed_amount_discount"),
      value: z.number().nonnegative(),
    })
    .strict(),
  z
    .object({
      metadata: z
        .object({
          buyQuantity: z.number().int().positive(),
          getQuantity: z.number().int().positive(),
        })
        .strict(),
      type: z.literal("buy_x_get_y"),
    })
    .strict(),
  z
    .object({
      metadata: z
        .object({
          giftId: z.string().trim().min(1).max(120),
        })
        .strict(),
      type: z.literal("freebie_product"),
    })
    .strict(),
  z
    .object({
      type: z.literal("cashback_credit"),
      value: z.number().nonnegative(),
    })
    .strict(),
]);

const discountRulesSchema = z
  .object({
    applicabilityScope: discountApplicabilityScopeSchema,
    maxUsesPerContact: z.number().int().positive(),
    minimumOrderValue: z.number().nonnegative().optional().nullable(),
    offeringIds: nullableStringListSchema,
    totalUsageLimit: z.number().int().positive().optional().nullable(),
  })
  .strict()
  .superRefine((rules, context) => {
    if (
      rules.applicabilityScope === "specific_offerings" &&
      !rules.offeringIds?.length
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select at least one offering",
        path: ["offeringIds"],
      });
    }
  });

const discountBodySchema = z
  .object({
    code: nullableTrimmedStringSchema,
    description: z.string().trim().max(1000).default(""),
    endsAt: z.number().optional().nullable(),
    reward: discountRewardSchema,
    rules: discountRulesSchema,
    startsAt: z.number().positive(),
    status: discountStatusSchema,
    title: z.string().trim().min(1).max(160),
    token: z.unknown().optional(),
    user: z.unknown().optional(),
  })
  .strict()
  .transform(({ token: _token, user: _user, ...discount }) => discount);

const createDiscountSchema = discountBodySchema;
const updateDiscountSchema = discountBodySchema;

const discountParamsSchema = z
  .object({
    discountId: z.string().trim().min(1).max(120),
  })
  .strict();

type CreateDiscountBody = z.infer<typeof createDiscountSchema>;
type DiscountParams = z.infer<typeof discountParamsSchema>;
type UpdateDiscountBody = z.infer<typeof updateDiscountSchema>;

export {
  createDiscountSchema,
  discountParamsSchema,
  updateDiscountSchema,
  CreateDiscountBody,
  DiscountParams,
  UpdateDiscountBody,
};
