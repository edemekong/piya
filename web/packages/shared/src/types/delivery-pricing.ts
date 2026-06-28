import type { DeliveryPricingData } from "../models";

type DeliveryPricingPayload = {
  deliveryPricing: DeliveryPricingData | null;
};

type UpdateDeliveryPricingInput = Pick<
  DeliveryPricingData,
  "currency" | "vehicles"
>;

export type { DeliveryPricingPayload, UpdateDeliveryPricingInput };
