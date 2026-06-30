import { z } from "zod";
import { ValidationsUtils } from "../utils/validations.utils";

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
    "integration",
    "complete",
  ]),
});

const accountSetupPersonalInfoSchema = z
  .object({
    name: z.string().trim().min(1),
    phoneNumber: z
      .string()
      .trim()
      .refine(
        (phoneNumber) =>
          ValidationsUtils.isValidSupportedPhoneNumber(phoneNumber),
        "Enter a valid supported phone number",
      ),
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
    category: businessCategorySchema,
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
    primaryColor: z
      .string()
      .trim()
      .refine(
        (color) => ValidationsUtils.isValidHexColor(color),
        "Enter a valid 6-digit hex color",
      ),
    secondaryColor: z.string().trim().min(1).nullable().optional(),
    accentColor: z.string().trim().min(1).nullable().optional(),
    socialLinks: z.record(z.string(), z.string()).nullable().optional(),
    ...internalFields,
  })
  .strict()
  .transform(({ token: _token, user: _user, ...data }) => data);

const businessSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(55)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and single hyphens only",
  );

const accountSetupIntegrationSchema = z
  .object({
    slug: businessSlugSchema.nullable().optional(),
    email: z
      .object({
        fromEmailLocalPart: businessSlugSchema,
        replyToEmail: z.email(),
      })
      .nullable()
      .optional(),
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
type AccountSetupIntegrationBody = z.infer<
  typeof accountSetupIntegrationSchema
>;
type AccountSetupCompleteBody = z.infer<typeof accountSetupCompleteSchema>;

export {
  accountSetupBrandDetailsSchema,
  accountSetupBusinessProfileSchema,
  accountSetupCompleteSchema,
  accountSetupIntegrationSchema,
  accountSetupPersonalInfoSchema,
  accountSetupStepSchema,
  AccountSetupBrandDetailsBody,
  AccountSetupBusinessProfileBody,
  AccountSetupCompleteBody,
  AccountSetupIntegrationBody,
  AccountSetupPersonalInfoBody,
  AccountSetupStepQuery,
};
