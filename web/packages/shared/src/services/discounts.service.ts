import type { BaseAPIServiceOptions } from "../types";
import { dummyDiscounts } from "../utils/dummy_data";
import { BaseAPIService } from "./base-api.service";

export type {
  DiscountData,
  DiscountReward,
  DiscountRules,
  DiscountStatusType,
  DiscountType,
  DiscountRewardMetadata,
  RewardType,
} from "../models";

export class DiscountsService extends BaseAPIService {
  constructor(options: BaseAPIServiceOptions = {}) {
    super(options);
  }

  getDiscounts() {
    return dummyDiscounts;
  }
}

export const discountsService = new DiscountsService();
