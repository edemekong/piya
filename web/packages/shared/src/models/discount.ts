export type DiscountType = "loyalty" | "discount";

export type DiscountStatusType = "draft" | "active" | "paused" | "expired";

export type RewardType =
  | "percentage_discount"
  | "fixed_amount_discount"
  | "free_shipping"
  | "points_multiplier"
  | "fixed_points_grant"
  | "buy_x_get_y"
  | "freebie_product"
  | "cashback_credit"
  | "gift_card_grant"
  | "custom_perk";

export type DiscountRewardMetadata = {
  buyQuantity?: number;
  getQuantity?: number;
  applicableIds?: string[];
  giftId?: string;
  customPerkDescription?: string;
};

export type DiscountReward = {
  type: RewardType;
  value: number;
  maxDiscountAmount?: number | null;
  metadata?: DiscountRewardMetadata | null;
};

export type DiscountRules = {
  minimumOrderValue?: number | null;
  targetBadgeTypes?: string[] | null;
  targetTags?: string[] | null;
  maxUsesPerContact: number;
  totalUsageLimit?: number | null;
};

export type DiscountData = {
  id: string;
  businessId: string;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  title: string;
  description: string;
  type: DiscountType;
  status: DiscountStatusType;
  code?: string | null;
  codeGeneration?: "manual" | "unique_per_contact";
  reward: DiscountReward;
  rules: DiscountRules;
  startsAt: number;
  endsAt?: number | null;
};
