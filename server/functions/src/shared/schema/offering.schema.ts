import { z } from "zod";

const offeringTypeSchema = z.enum([
  "product",
  "service",
  "accommodation",
  "delivery",
]);
const offeringSubTypeSchema = z.enum([
  "physical",
  "digital",
  "appointment",
  "online_appointment",
  "event",
  "delivery",
  "room",
  "unit",
]);
const offeringStatusSchema = z.enum(["draft", "active", "paused", "disabled"]);
const offeringFeatureSchema = z.enum(["booking", "delivery", "inventory"]);
const offeringAttributeValueTypeSchema = z.enum([
  "text",
  "number",
  "yes_no",
  "date",
]);
const offeringCheckoutIntentSchema = z.enum([
  "buy",
  "book",
  "request_quote",
  "create_delivery",
  "reserve_room",
]);
const checkoutPaymentModeSchema = z.enum([
  "none",
  "pay_now",
  "pay_later",
  "deposit",
  "business_confirms_first",
]);

const nullableTrimmedStringSchema = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => value || null);

const offeringCategorySchema = z
  .object({
    id: z.string().trim().max(120).optional().nullable(),
    name: z.string().trim().min(1).max(120),
  })
  .strict();

const offeringAttributeSchema = z
  .object({
    id: z.string().trim().max(120).optional().nullable(),
    name: z.string().trim().min(1).max(120),
    unit: nullableTrimmedStringSchema,
    value: z.string().trim().min(1).max(240),
    valueType: offeringAttributeValueTypeSchema.optional().nullable(),
  })
  .strict();

const offeringOptionSchema = z
  .object({
    id: z.string().trim().max(120).optional().nullable(),
    name: z.string().trim().min(1).max(120),
    values: z.array(z.string().trim().min(1).max(120)).max(40),
  })
  .strict();

const offeringVariantSchema = z
  .object({
    id: z.string().trim().min(1).max(120),
    imageUrl: nullableTrimmedStringSchema,
    optionValues: z.record(z.string(), z.string()).default({}),
    price: z.number().nonnegative().optional().nullable(),
    quantity: z.number().int().nonnegative().optional().nullable(),
    sku: nullableTrimmedStringSchema,
    status: offeringStatusSchema.optional(),
    title: z.string().trim().min(1).max(160),
  })
  .strict();

const offeringInventorySchema = z
  .object({
    allowBackorders: z.boolean().optional(),
    quantity: z.number().int().nonnegative().optional().nullable(),
    sku: nullableTrimmedStringSchema,
    trackQuantity: z.boolean(),
  })
  .strict();

const offeringCommerceSchema = z
  .object({
    checkoutIntents: z.array(offeringCheckoutIntentSchema).min(1).max(5),
    depositAmount: z.number().nonnegative().optional().nullable(),
    depositPercent: z.number().min(0).max(100).optional().nullable(),
    maxQuantity: z.number().int().positive().optional().nullable(),
    minQuantity: z.number().int().positive().optional().nullable(),
    paymentModes: z.array(checkoutPaymentModeSchema).optional().nullable(),
    requiresBusinessConfirmation: z.boolean().optional(),
  })
  .strict();

const locationSchema = z
  .object({
    address: z.string().trim().min(1).max(240),
    city: z.string().trim().min(1).max(120),
    country: z.string().trim().min(1).max(120),
    displayName: z.string().trim().max(240).optional(),
    geoPoint: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .strict()
      .optional(),
    postalCode: z.string().trim().max(40).optional(),
    serviceLocationId: nullableTrimmedStringSchema,
    state: z.string().trim().min(1).max(120),
    streetAddress: z.string().trim().max(240).optional(),
  })
  .strict();

const offeringBodySchema = z
  .object({
    attributes: z.array(offeringAttributeSchema).optional().nullable(),
    businessId: z.string().optional(),
    category: offeringCategorySchema.optional().nullable(),
    commerce: offeringCommerceSchema.optional().nullable(),
    createdAt: z.number().optional(),
    currency: nullableTrimmedStringSchema,
    description: nullableTrimmedStringSchema,
    duration: z.number().int().positive().optional().nullable(),
    features: z.array(offeringFeatureSchema).optional().nullable(),
    id: z.string().optional(),
    imageUrls: z.array(z.string().trim().min(1).max(2048)).optional().nullable(),
    inventory: offeringInventorySchema.optional().nullable(),
    location: locationSchema.optional().nullable(),
    meta: z.record(z.string(), z.any()).optional().nullable(),
    name: z.string().trim().min(1).max(160),
    options: z.array(offeringOptionSchema).optional().nullable(),
    price: z.number().nonnegative().optional().nullable(),
    status: offeringStatusSchema,
    subType: offeringSubTypeSchema.optional().nullable(),
    tags: z.array(z.string().trim().min(1).max(80)).max(40),
    token: z.unknown().optional(),
    type: offeringTypeSchema,
    updatedAt: z.number().optional(),
    user: z.unknown().optional(),
    variants: z.array(offeringVariantSchema).optional().nullable(),
  })
  .strict()
  .transform(
    ({
      businessId: _businessId,
      createdAt: _createdAt,
      id: _id,
      token: _token,
      updatedAt: _updatedAt,
      user: _user,
      ...offering
    }) => offering,
  );

const createOfferingSchema = offeringBodySchema;
const updateOfferingSchema = offeringBodySchema;

const offeringParamsSchema = z
  .object({
    offeringId: z.string().trim().min(1).max(120),
  })
  .strict();

type CreateOfferingBody = z.infer<typeof createOfferingSchema>;
type OfferingParams = z.infer<typeof offeringParamsSchema>;
type UpdateOfferingBody = z.infer<typeof updateOfferingSchema>;

export {
  createOfferingSchema,
  offeringParamsSchema,
  updateOfferingSchema,
  CreateOfferingBody,
  OfferingParams,
  UpdateOfferingBody,
};
