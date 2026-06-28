import type {
  DeliveryPricingPayload,
  UpdateDeliveryPricingInput,
} from "../types";
import type { BaseAPIServiceOptions } from "../types";
import { BaseAPIService } from "./base-api.service";
import { authService, type AuthService } from "./auth.service";

export class DeliveryPricingService extends BaseAPIService {
  constructor(options: BaseAPIServiceOptions & { auth?: AuthService } = {}) {
    const auth = options.auth ?? authService;
    super({
      ...options,
      tokenProvider: options.tokenProvider ?? (() => auth.getIdToken()),
    });
  }

  getPrimaryDeliveryPricing(): Promise<DeliveryPricingPayload> {
    return this.get<DeliveryPricingPayload>(
      this.urlController.primaryDeliveryPricing,
      {
        withToken: true,
      }
    );
  }

  updatePrimaryDeliveryPricing(
    input: UpdateDeliveryPricingInput
  ): Promise<DeliveryPricingPayload> {
    return this.patch<DeliveryPricingPayload, UpdateDeliveryPricingInput>(
      this.urlController.primaryDeliveryPricing,
      {
        body: input,
        withToken: true,
      }
    );
  }
}

export const deliveryPricingService = new DeliveryPricingService();
