import { BaseModel } from "./base";
import { ContactBadgeType } from "./contact";

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
  applicableIds?: Array<string>;
  giftId?: string;
  customPerkDescription?: string;
}

interface CampaignRules {
  minimumOrderValue?: number | null;
  targetBadgeTypes?: Array<ContactBadgeType> | null;
  targetTags?: Array<string> | null;
  maxUsesPerContact: number;
  totalUsageLimit?: number | null;
}

export {
  CampaignData,
  CampaignType,
  CampaignStatusType,
  RewardType,
  CampaignReward,
  CampaignRules,
  RewardMetadata,
};
