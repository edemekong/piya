type CampaignType = "loyalty" | "discount";
type CampaignStatusType = "draft" | "active" | "paused" | "expired";
type RewardType =
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
export type { CampaignType, CampaignStatusType, RewardType };
