import type {
  BaseAPIServiceOptions,
  DiscountInput,
  DiscountPayload,
  DiscountsPayload,
} from "../types";
import { BaseAPIService } from "./base-api.service";
import { authService, type AuthService } from "./auth.service";

export type {
  DiscountData,
  DiscountReward,
  DiscountRules,
  DiscountStatusType,
  RewardType,
} from "../models";

export class DiscountsService extends BaseAPIService {
  constructor(options: BaseAPIServiceOptions & { auth?: AuthService } = {}) {
    const auth = options.auth ?? authService;
    super({
      ...options,
      tokenProvider: options.tokenProvider ?? (() => auth.getIdToken()),
    });
  }

  getDiscounts(): Promise<DiscountsPayload> {
    return this.get<DiscountsPayload>(this.urlController.discounts, {
      withToken: true,
    });
  }

  createDiscount(input: DiscountInput): Promise<DiscountPayload> {
    return this.post<DiscountPayload, DiscountInput>(
      this.urlController.discounts,
      {
        body: input,
        maxRetries: 0,
        withToken: true,
      },
    );
  }

  updateDiscount(
    discountId: string,
    input: DiscountInput,
  ): Promise<DiscountPayload> {
    return this.patch<DiscountPayload, DiscountInput>(
      this.urlController.discount(discountId),
      {
        body: input,
        maxRetries: 0,
        withToken: true,
      },
    );
  }
}

export const discountsService = new DiscountsService();
