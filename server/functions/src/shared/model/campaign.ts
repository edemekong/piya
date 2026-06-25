import type {
  CampaignStatusType,
  CampaignType,
  RewardType,
} from "../types/campaign.type";
import type { ContactBadgeType } from "../types/contact.type";
import type { BaseModel } from "./base";

interface CampaignData extends BaseModel {
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
interface CampaignReward {
  type: RewardType;
  value: number;
  maxDiscountAmount?: number | null;
  metadata?: RewardMetadata | null;
}
interface RewardMetadata {
  buyQuantity?: number;
  getQuantity?: number;
  giftId?: string;
  customPerkDescription?: string;
}
interface CampaignRules {
  
  minimumOrderValue?: number | null;
  targetBadgeTypes?: ContactBadgeType[] | null;
  targetTags?: string[] | null;
  maxUsesPerContact: number;
  totalUsageLimit?: number | null;
}

export { CampaignData, CampaignReward, RewardMetadata, CampaignRules };
