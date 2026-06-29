import { z } from "zod";

const locationOriginSchema = z
  .object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  })
  .strict();

const searchLocationsSchema = z
  .object({
    input: z.string().trim().min(2).max(200),
    origin: locationOriginSchema.optional(),
    token: z.unknown().optional(),
    user: z.unknown().optional(),
  })
  .strict()
  .transform(({ token: _token, user: _user, ...request }) => request);

const getLocationDetailsSchema = z
  .object({
    placeId: z.string().trim().min(1).max(500),
    token: z.unknown().optional(),
    user: z.unknown().optional(),
  })
  .strict()
  .transform(({ token: _token, user: _user, ...request }) => request);

type SearchLocationsBody = z.infer<typeof searchLocationsSchema>;
type GetLocationDetailsBody = z.infer<typeof getLocationDetailsSchema>;

export {
  getLocationDetailsSchema,
  searchLocationsSchema,
  GetLocationDetailsBody,
  SearchLocationsBody,
};
