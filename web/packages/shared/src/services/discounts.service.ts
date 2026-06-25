import type { DiscountData } from "../models";

export type {
  DiscountData,
  DiscountReward,
  DiscountRules,
  DiscountStatusType,
  DiscountType,
  RewardMetadata,
  RewardType,
} from "../models";

const discounts: DiscountData[] = [
  {
    id: "discount_001",
    businessId: "biz_northstar",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
    updatedAt: Date.now() - 1000 * 60 * 60 * 5,
    createdBy: "admin_demo",
    title: "Summer Glow 15%",
    description: "Percentage discount for customers buying skincare bundles.",
    type: "discount",
    status: "active",
    code: "GLOW15",
    codeGeneration: "manual",
    reward: {
      maxDiscountAmount: 15000,
      metadata: null,
      type: "percentage_discount",
      value: 15,
    },
    rules: {
      maxUsesPerContact: 2,
      minimumOrderValue: 40000,
      targetBadgeTypes: ["vip"],
      targetTags: ["skin-care", "bundle"],
      totalUsageLimit: 250,
    },
    startsAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    endsAt: Date.now() + 1000 * 60 * 60 * 24 * 28,
  },
  {
    id: "discount_002",
    businessId: "biz_northstar",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 9,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
    createdBy: "admin_demo",
    title: "Launch Weekend Credit",
    description: "Fixed amount off for launch workshop registrations.",
    type: "discount",
    status: "draft",
    code: null,
    codeGeneration: "unique_per_contact",
    reward: {
      metadata: null,
      type: "fixed_amount_discount",
      value: 10000,
    },
    rules: {
      maxUsesPerContact: 1,
      minimumOrderValue: 100000,
      targetBadgeTypes: null,
      targetTags: ["event", "training"],
      totalUsageLimit: 50,
    },
    startsAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
    endsAt: Date.now() + 1000 * 60 * 60 * 24 * 10,
  },
  {
    id: "discount_003",
    businessId: "biz_northstar",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
    updatedAt: Date.now() - 1000 * 60 * 60 * 12,
    createdBy: "admin_demo",
    title: "Free Delivery Perk",
    description: "Free shipping for customers tagged as returning buyers.",
    type: "discount",
    status: "paused",
    code: "SHIPFREE",
    codeGeneration: "manual",
    reward: {
      metadata: null,
      type: "free_shipping",
      value: 0,
    },
    rules: {
      maxUsesPerContact: 3,
      minimumOrderValue: 25000,
      targetBadgeTypes: null,
      targetTags: ["returning"],
      totalUsageLimit: null,
    },
    startsAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
    endsAt: null,
  },
];

export function getDiscounts() {
  return discounts;
}
