import type { BaseModel } from "./base";

type DeliveryPricingCurrency = "NGN" | "USD" | "GHS" | "KES" | "ZAR";

type DeliveryVehicleType = "bicycle" | "motorcycle" | "car" | "truck" | "van";

interface DeliveryVehiclePricing {
  baseFee: number;
  chargePerKm: number;
  enabled: boolean;
}

interface DeliveryPricingData extends BaseModel {
  businessId: string;
  createdBy: string;
  currency: DeliveryPricingCurrency;
  vehicles: Record<DeliveryVehicleType, DeliveryVehiclePricing>;
}

export {
  DeliveryPricingCurrency,
  DeliveryPricingData,
  DeliveryVehiclePricing,
  DeliveryVehicleType,
};
