import { z } from "zod";

const genderSchema = z.enum(["male", "female", "other"]);
const businessCategorySchema = z.enum([
  "laundry",
  "fashion_tailoring",
  "salon",
  "barbershop",
  "spa",
  "beauty_studio",
  "car_wash",
  "logistics_delivery",
  "restaurant",
  "food_vendor",
  "supermarket",
  "farm_produce",
  "fashion_store",
  "electronics_store",
  "photography",
  "consulting",
  "real_estate_agent",
  "hotel_guesthouse",
  "shortlet_apartment",
]);

const internalFields = {
  token: z.unknown().optional(),
  user: z.unknown().optional(),
};

const accountSetupStepSchema = z.object({
  step: z.enum([
    "personal-info",
    "business-profile",
    "brand-details",
    "complete",
  ]),
});

const accountSetupPersonalInfoSchema = z
  .object({
    name: z.string().trim().min(1),
    phoneNumber: z.string().trim().min(1).nullable().optional(),
    profileImage: z.string().trim().min(1).optional(),
    profileImageUrl: z.string().trim().min(1).optional(),
    dob: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date format YYYY-MM-DD")
      .nullable()
      .optional(),
    gender: genderSchema.nullable().optional(),
    ...internalFields,
  })
  .strict()
  .transform(({ token: _token, user: _user, ...data }) => data);

const accountSetupBusinessProfileSchema = z
  .object({
    name: z.string().trim().min(1),
    category: businessCategorySchema.optional(),
    domain: z.string().trim().min(1),
    description: z.string().trim().min(1),
    email: z.email().nullable().optional(),
    phoneNumber: z.string().trim().min(1).nullable().optional(),
    logo: z.string().trim().min(1).optional(),
    ...internalFields,
  })
  .strict()
  .transform(({ token: _token, user: _user, ...data }) => data);

const accountSetupBrandDetailsSchema = z
  .object({
    logo: z.string().trim().min(1).nullable().optional(),
    logoBase64: z.string().trim().min(1).optional(),
    favicon: z.string().trim().min(1).nullable().optional(),
    faviconBase64: z.string().trim().min(1).optional(),
    coverImage: z.string().trim().min(1).nullable().optional(),
    coverImageBase64: z.string().trim().min(1).optional(),
    primaryColor: z.string().trim().min(1),
    secondaryColor: z.string().trim().min(1).nullable().optional(),
    accentColor: z.string().trim().min(1).nullable().optional(),
    socialLinks: z.record(z.string(), z.string()).nullable().optional(),
    ...internalFields,
  })
  .strict()
  .transform(({ token: _token, user: _user, ...data }) => data);

const accountSetupCompleteSchema = z
  .object(internalFields)
  .strict()
  .transform(({ token: _token, user: _user, ...data }) => data);

type AccountSetupStepQuery = z.infer<typeof accountSetupStepSchema>;
type AccountSetupPersonalInfoBody = z.infer<
  typeof accountSetupPersonalInfoSchema
>;
type AccountSetupBusinessProfileBody = z.infer<
  typeof accountSetupBusinessProfileSchema
>;
type AccountSetupBrandDetailsBody = z.infer<
  typeof accountSetupBrandDetailsSchema
>;
type AccountSetupCompleteBody = z.infer<typeof accountSetupCompleteSchema>;

export {
  accountSetupBrandDetailsSchema,
  accountSetupBusinessProfileSchema,
  accountSetupCompleteSchema,
  accountSetupPersonalInfoSchema,
  accountSetupStepSchema,
  AccountSetupBrandDetailsBody,
  AccountSetupBusinessProfileBody,
  AccountSetupCompleteBody,
  AccountSetupPersonalInfoBody,
  AccountSetupStepQuery,
};
