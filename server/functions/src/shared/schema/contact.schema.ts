import { parsePhoneNumberFromString } from "libphonenumber-js";
import { z } from "zod";

const optionalEmailSchema = z
  .string()
  .trim()
  .email()
  .max(180)
  .optional()
  .nullable()
  .transform((value) => value?.toLocaleLowerCase() || null);

const optionalPhoneNumberSchema = z
  .string()
  .trim()
  .max(32)
  .optional()
  .nullable()
  .transform((value) => value || null)
  .refine(
    (value) => !value || Boolean(parsePhoneNumberFromString(value)?.isValid()),
    "Enter a valid phone number"
  );

const optionalUpdateEmailSchema = z
  .string()
  .trim()
  .email()
  .max(180)
  .optional()
  .nullable()
  .transform((value) =>
    value === undefined ? undefined : value?.toLocaleLowerCase() || null
  );

const optionalUpdatePhoneNumberSchema = z
  .string()
  .trim()
  .max(32)
  .optional()
  .nullable()
  .transform((value) => (value === undefined ? undefined : value || null))
  .refine(
    (value) => !value || Boolean(parsePhoneNumberFromString(value)?.isValid()),
    "Enter a valid phone number"
  );

const birthdayMonthDaySchema = z.string().regex(
  /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  "Expected birthday format MM-DD"
);

const locationSchema = z
  .object({
    address: z.string().trim().min(1).max(500),
    streetAddress: z.string().trim().max(240).optional(),
    city: z.string().trim().max(120),
    state: z.string().trim().max(120),
    serviceLocationId: z.string().trim().max(120).optional().nullable(),
    country: z.string().trim().max(120),
    postalCode: z.string().trim().max(40).optional(),
    displayName: z.string().trim().max(240).optional(),
    geoPoint: z
      .object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
      })
      .optional(),
  })
  .strict();

const createContactSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    email: optionalEmailSchema,
    phoneNumber: optionalPhoneNumberSchema,
    address: locationSchema.optional().nullable(),
    dob: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date format YYYY-MM-DD")
      .optional()
      .nullable(),
    gender: z.enum(["male", "female", "other"]).optional().nullable(),
    tags: z
      .array(z.string().trim().min(1).max(40))
      .max(5)
      .default([])
      .transform((tags) =>
        tags.filter(
          (tag, index) =>
            tags.findIndex(
              (item) => item.toLocaleLowerCase() === tag.toLocaleLowerCase()
            ) === index
        )
      ),
    token: z.unknown().optional(),
    user: z.unknown().optional(),
  })
  .strict()
  .transform(({ token: _token, user: _user, ...contact }) => contact)
  .refine((contact) => Boolean(contact.email || contact.phoneNumber), {
    message: "Enter an email address or phone number",
    path: ["email"],
  });

const contactTagsSchema = z
  .array(z.string().trim().min(1).max(40))
  .max(5)
  .transform((tags) =>
    tags.filter(
      (tag, index) =>
        tags.findIndex(
          (item) => item.toLocaleLowerCase() === tag.toLocaleLowerCase()
        ) === index
    )
  );

const updateContactSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    email: optionalUpdateEmailSchema,
    phoneNumber: optionalUpdatePhoneNumberSchema,
    countryCode: z
      .string()
      .trim()
      .max(8)
      .optional()
      .nullable()
      .transform((value) =>
        value === undefined ? undefined : value?.toLocaleUpperCase() || null
      ),
    dob: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date format YYYY-MM-DD")
      .optional()
      .nullable(),
    anniversary: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date format YYYY-MM-DD")
      .optional()
      .nullable(),
    address: locationSchema.optional().nullable(),
    tags: contactTagsSchema.optional(),
    token: z.unknown().optional(),
    user: z.unknown().optional(),
  })
  .strict()
  .transform(({ token: _token, user: _user, ...contact }) => contact)
  .refine((contact) => Object.keys(contact).length > 0, {
    message: "Enter at least one contact field",
  });

const contactParamsSchema = z
  .object({
    contactId: z.string().trim().min(1).max(120),
  })
  .strict();

const bulkCreateContactsSchema = z
  .object({
    contacts: z.array(createContactSchema).min(1).max(1000),
    token: z.unknown().optional(),
    user: z.unknown().optional(),
  })
  .strict()
  .transform(({ token: _token, user: _user, ...payload }) => payload);

const getContactsQuerySchema = z
  .object({
    query: z.string().trim().max(120).optional(),
    status: z.enum(["active", "inactive", "lead", "blocked"]).optional(),
    bmdFrom: birthdayMonthDaySchema.optional(),
    bmdTo: birthdayMonthDaySchema.optional(),
    tagId: z
      .string()
      .trim()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .max(80)
      .optional(),
    limit: z.coerce.number().int().min(1).max(50).default(20),
    cursor: z.string().trim().max(1000).optional(),
    token: z.unknown().optional(),
  })
  .strict()
  .refine(
    (query) => Boolean(query.bmdFrom) === Boolean(query.bmdTo),
    "Birthday range requires both bmdFrom and bmdTo"
  )
  .transform(({ token: _token, ...query }) => query);

type CreateContactBody = z.infer<typeof createContactSchema>;
type BulkCreateContactsBody = z.infer<typeof bulkCreateContactsSchema>;
type GetContactsQuery = z.infer<typeof getContactsQuerySchema>;
type UpdateContactBody = z.infer<typeof updateContactSchema>;
type ContactParams = z.infer<typeof contactParamsSchema>;

export {
  bulkCreateContactsSchema,
  contactParamsSchema,
  createContactSchema,
  getContactsQuerySchema,
  updateContactSchema,
  BulkCreateContactsBody,
  ContactParams,
  CreateContactBody,
  GetContactsQuery,
  UpdateContactBody,
};
