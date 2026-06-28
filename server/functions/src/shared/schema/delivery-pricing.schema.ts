import { z } from "zod";

const deliveryVehiclePricingSchema = z
  .object({
    baseFee: z.number().int().nonnegative(),
    chargePerKm: z.number().int().nonnegative(),
    enabled: z.boolean(),
  })
  .strict()
  .refine((vehicle) => !vehicle.enabled || vehicle.chargePerKm > 0, {
    message: "Charge per kilometer must be greater than zero when enabled",
    path: ["chargePerKm"],
  });

const updateDeliveryPricingSchema = z
  .object({
    currency: z.enum(["NGN", "USD", "GHS", "KES", "ZAR"]),
    vehicles: z
      .object({
        bicycle: deliveryVehiclePricingSchema,
        motorcycle: deliveryVehiclePricingSchema,
        car: deliveryVehiclePricingSchema,
        truck: deliveryVehiclePricingSchema,
        van: deliveryVehiclePricingSchema,
      })
      .strict(),
    token: z.unknown().optional(),
    user: z.unknown().optional(),
  })
  .strict()
  .transform(({ token: _token, user: _user, ...data }) => data)
  .refine(
    (pricing) =>
      Object.values(pricing.vehicles).some((vehicle) => vehicle.enabled),
    {
      message: "At least one delivery vehicle must be enabled",
      path: ["vehicles"],
    }
  );

type UpdateDeliveryPricingBody = z.infer<typeof updateDeliveryPricingSchema>;

export {
  deliveryVehiclePricingSchema,
  updateDeliveryPricingSchema,
  UpdateDeliveryPricingBody,
};
