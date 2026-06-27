import { z } from "zod";

const businessSlugAvailabilityQuerySchema = z.object({
  slug: z.string().trim().min(1).max(55),
});

type BusinessSlugAvailabilityQuery = z.infer<
  typeof businessSlugAvailabilityQuerySchema
>;

export {
  businessSlugAvailabilityQuerySchema,
  BusinessSlugAvailabilityQuery,
};
