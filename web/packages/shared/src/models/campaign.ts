import type { BaseModel } from "./base";
import type { ContactBadgeType } from "./contact";
import type { RewardType } from "./discount";

export type CampaignType = "loyalty" | "discount";
export type CampaignStatusType = "draft" | "active" | "paused" | "expired";

export type CampaignRewardMetadata = {
  buyQuantity?: number;
  getQuantity?: number;
  giftId?: string;
  customPerkDescription?: string;
};

export type CampaignReward = {
  type: RewardType;
  value: number;
  maxDiscountAmount?: number | null;
  metadata?: CampaignRewardMetadata | null;
};

export type CampaignRules = {
  minimumOrderValue?: number | null;
  targetBadgeTypes?: ContactBadgeType[] | null;
  targetTags?: string[] | null;
  maxUsesPerContact: number;
  totalUsageLimit?: number | null;
};

export interface CampaignData extends BaseModel {
  businessId: string;
  createdBy: string;
  title: string;
  description: string;
  type: CampaignType;
  status: CampaignStatusType;
  code?: string | null;
  reward: CampaignReward;
  rules: CampaignRules;
  startsAt: number;
  endsAt?: number | null;
}
