import { z } from "zod";

const giftStatusSchema = z.enum(["active", "disabled"]);
const giftCurrencySchema = z.enum(["NGN", "USD", "GHS", "KES", "ZAR"]);

const nullableTrimmedStringSchema = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => value || null);

const giftBodySchema = z
  .object({
    currency: giftCurrencySchema.optional().nullable(),
    description: nullableTrimmedStringSchema,
    estimatedValue: z.number().nonnegative().optional().nullable(),
    imageBase64: z.string().max(8_000_000).optional(),
    name: z.string().trim().min(1).max(160),
    quantityAvailable: z.number().int().nonnegative().optional().nullable(),
    status: giftStatusSchema,
    token: z.unknown().optional(),
    user: z.unknown().optional(),
  })
  .strict()
  .superRefine((gift, context) => {
    if (gift.estimatedValue != null && !gift.currency) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Currency is required when estimated value is set",
        path: ["currency"],
      });
    }
  })
  .transform(({ token: _token, user: _user, ...gift }) => ({
    ...gift,
    currency: gift.estimatedValue == null ? null : gift.currency,
  }));

const createGiftSchema = giftBodySchema;
const updateGiftSchema = giftBodySchema;

const giftParamsSchema = z
  .object({
    giftId: z.string().trim().min(1).max(120),
  })
  .strict();

type CreateGiftBody = z.infer<typeof createGiftSchema>;
type GiftParams = z.infer<typeof giftParamsSchema>;
type UpdateGiftBody = z.infer<typeof updateGiftSchema>;

export {
  createGiftSchema,
  giftParamsSchema,
  updateGiftSchema,
  CreateGiftBody,
  GiftParams,
  UpdateGiftBody,
};
