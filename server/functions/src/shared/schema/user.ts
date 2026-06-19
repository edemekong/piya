import { z } from "zod";

const userAccountTypeSchema = z.enum(["customer", "rider", "admin"]);
const genderSchema = z.enum(["male", "female", "other"]);

const timezoneSchema = z.object({
  timezoneId: z.string(),
  offset: z.number(),
});

const deviceSchema = z.object({
  currentAppVersion: z.string(),
  locale: z.string(),
  timezone: timezoneSchema,
});

const userBusinessSchema = z.object({
  businessIds: z.array(z.string()),
  businessRoleTypes: z.record(
    z.string(),
    z.array(z.enum(["admin", "manager", "rider", "customer"])),
  ),
});

const verificationSchema = z.object({
  emailVerified: z.boolean(),
  phoneVerified: z.boolean(),
  authProviders: z.array(z.string()),
});

const geoPointSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

const locationSchema = z.object({
  address: z.string(),
  city: z.string(),
  state: z.string(),
  serviceLocationId: z.string().nullable().optional(),
  country: z.string(),
  postalCode: z.string().optional(),
  geoPoint: geoPointSchema.optional(),
});

const userSettingsSchema = z.object({
  notifications: z.object({
    enabledPushNotification: z.boolean(),
    enabledEmailNotification: z.boolean(),
    enabledSmsNotification: z.boolean(),
  }),
});

const deviceUpdateSchema = z.object({
  currentAppVersion: z.string().optional(),
  locale: z.string().optional(),
  timezone: timezoneSchema.partial().optional(),
});

const userSettingsUpdateSchema = z.object({
  notifications: userSettingsSchema.shape.notifications.partial().optional(),
});

const userSchema = z.object({
  id: z.string(),
  email: z.email(),
  phoneNumber: z.string().nullable().optional(),
  accountType: userAccountTypeSchema.nullable().optional(),
  name: z.string().trim().min(1),
  profileImageUrl: z.string().optional(),
  device: deviceSchema,
  dob: z.string().nullable().optional(),
  gender: genderSchema.nullable().optional(),
  business: userBusinessSchema.nullable().optional(),
  verification: verificationSchema,
  lastKnownLocation: locationSchema.nullable().optional(),
  settings: userSettingsSchema,
  createdAt: z.number(),
  updatedAt: z.number(),
});

const createUserSchema = userSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

const updateUserSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    profileImageUrl: z.string().optional(),
    dob: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date format YYYY-MM-DD")
      .nullable()
      .optional(),
    gender: genderSchema.nullable().optional(),
    device: deviceUpdateSchema.optional(),
    lastKnownLocation: locationSchema.nullable().optional(),
    settings: userSettingsUpdateSchema.optional(),
    token: z.unknown().optional(),
    user: z.unknown().optional(),
  })
  .strict()
  .transform(({ token: _token, user: _user, ...data }) => data)
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one update field is required",
  });

const accountSetupInternalFields = {
  token: z.unknown().optional(),
  user: z.unknown().optional(),
};

const customerAccountSetupSchema = z.object({
    accountType: z.literal("customer"),
    name: z.string().trim().min(1),
    profileImage: z.string().min(1).optional(),
    dob: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date format YYYY-MM-DD"),
    gender: genderSchema,
    ...accountSetupInternalFields,
  }).strict();

const riderAccountSetupSchema = z.object({
  accountType: z.literal("rider"),
  name: z.string().trim().min(1),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date format YYYY-MM-DD"),
  gender: genderSchema,
  // Rider-specific fields and document uploads will be added here.
  ...accountSetupInternalFields,
}).strict();

const accountSetupSchema = z
  .discriminatedUnion("accountType", [
    customerAccountSetupSchema,
    riderAccountSetupSchema,
  ])
  .transform(({ token: _token, user: _user, ...data }) => data);

type CreateUserBody = z.infer<typeof createUserSchema>;
type UpdateUserBody = z.infer<typeof updateUserSchema>;
type AccountSetupBody = z.infer<typeof accountSetupSchema>;
type CustomerAccountSetupBody = Extract<
  AccountSetupBody,
  { accountType: "customer" }
>;
type RiderAccountSetupBody = Extract<
  AccountSetupBody,
  { accountType: "rider" }
>;

export {
  accountSetupSchema,
  createUserSchema,
  customerAccountSetupSchema,
  riderAccountSetupSchema,
  updateUserSchema,
  userSchema,
  AccountSetupBody,
  CreateUserBody,
  CustomerAccountSetupBody,
  RiderAccountSetupBody,
  UpdateUserBody,
};
