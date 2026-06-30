import type { BaseModel } from "./base";

type DiscountStatusType = "draft" | "active" | "paused" | "expired";

type RewardType =
  | "percentage_discount"
  | "fixed_amount_discount"
  | "buy_x_get_y"
  | "freebie_product"
  | "cashback_credit";

type DiscountApplicabilityScope =
  | "all_offerings"
  | "specific_offerings";

type DiscountReward =
  | {
      type: "percentage_discount";
      value: number;
      maxDiscountAmount?: number | null;
    }
  | {
      type: "fixed_amount_discount" | "cashback_credit";
      value: number;
    }
  | {
      type: "buy_x_get_y";
      metadata: {
        buyQuantity: number;
        getQuantity: number;
      };
    }
  | {
      type: "freebie_product";
      metadata: {
        giftId: string;
      };
    };

interface DiscountRules {
  minimumOrderValue?: number | null;
  maxUsesPerContact: number;
  totalUsageLimit?: number | null;
  applicabilityScope: DiscountApplicabilityScope;
  offeringIds?: string[] | null;
}

interface DiscountData extends BaseModel {
  businessId: string;
  createdBy: string;
  title: string;
  description: string;
  status: DiscountStatusType;
  code?: string | null;
  reward: DiscountReward;
  rules: DiscountRules;
  startsAt: number;
  endsAt?: number | null;
}

export {
  DiscountApplicabilityScope,
  DiscountData,
  DiscountReward,
  DiscountRules,
  DiscountStatusType,
  RewardType,
};
