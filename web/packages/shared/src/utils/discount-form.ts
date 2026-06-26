import type { DiscountData } from "../models";
import type { DiscountFormDraft } from "../types";
import { dateInputToTimestamp, formatShortDate, timestampToDateInput } from "./date";
import { formatEnumLabel } from "./format";
import { nullableCommaList } from "./list";
import { numberOrNull, numberOrZero } from "./number";

export function createEmptyDiscountDraft(): DiscountFormDraft {
  return {
    buyQuantity: "",
    code: "",
    codeGeneration: "manual",
    currency: "NGN",
    description: "",
    endsAt: "",
    freebieGiftId: "",
    getQuantity: "",
    maxDiscountAmount: "",
    maxUsesPerContact: "1",
    minimumOrderValue: "",
    perkDescription: "",
    rewardType: "percentage_discount",
    rewardValue: "",
    startsAt: timestampToDateInput(Date.now()),
    status: "draft",
    targetBadgeTypes: "",
    targetTags: "",
    title: "",
    totalUsageLimit: "",
  };
}

export function createDiscountDraft(discount: DiscountData): DiscountFormDraft {
  return {
    buyQuantity: discount.reward.metadata?.buyQuantity?.toString() ?? "",
    code: discount.code ?? "",
    codeGeneration: discount.codeGeneration ?? "manual",
    currency: "NGN",
    description: discount.description,
    endsAt: discount.endsAt ? timestampToDateInput(discount.endsAt) : "",
    freebieGiftId: discount.reward.metadata?.giftId ?? "",
    getQuantity: discount.reward.metadata?.getQuantity?.toString() ?? "",
    maxDiscountAmount: discount.reward.maxDiscountAmount?.toString() ?? "",
    maxUsesPerContact: discount.rules.maxUsesPerContact.toString(),
    minimumOrderValue: discount.rules.minimumOrderValue?.toString() ?? "",
    perkDescription: discount.reward.metadata?.customPerkDescription ?? "",
    rewardType: discount.reward.type,
    rewardValue: discount.reward.value.toString(),
    startsAt: timestampToDateInput(discount.startsAt),
    status: discount.status,
    targetBadgeTypes: discount.rules.targetBadgeTypes?.join(", ") ?? "",
    targetTags: discount.rules.targetTags?.join(", ") ?? "",
    title: discount.title,
    totalUsageLimit: discount.rules.totalUsageLimit?.toString() ?? "",
  };
}

export function draftToDiscount(
  draft: DiscountFormDraft,
  existing?: DiscountData | null,
): DiscountData {
  const now = Date.now();

  return {
    businessId: existing?.businessId ?? "biz_northstar",
    code: draft.codeGeneration === "manual" ? draft.code.trim() || null : null,
    codeGeneration: draft.codeGeneration,
    createdAt: existing?.createdAt ?? now,
    createdBy: existing?.createdBy ?? "admin_demo",
    description: draft.description,
    endsAt: dateInputToTimestamp(draft.endsAt),
    id: existing?.id ?? `discount_${now}`,
    reward: {
      maxDiscountAmount: numberOrNull(draft.maxDiscountAmount),
      metadata: createRewardMetadata(draft),
      type: draft.rewardType,
      value: getRewardValue(draft),
    },
    rules: {
      maxUsesPerContact: numberOrZero(draft.maxUsesPerContact) || 1,
      minimumOrderValue: numberOrNull(draft.minimumOrderValue),
      targetBadgeTypes: nullableCommaList(draft.targetBadgeTypes),
      targetTags: nullableCommaList(draft.targetTags),
      totalUsageLimit: numberOrNull(draft.totalUsageLimit),
    },
    startsAt: dateInputToTimestamp(draft.startsAt) ?? now,
    status: draft.status,
    title: draft.title,
    type: "discount",
    updatedAt: now,
  };
}

export function formatDiscountLabel(value: string) {
  return formatEnumLabel(value);
}

export function formatDiscountDate(timestamp?: number | null) {
  return formatShortDate(timestamp, "No end date", "en-NG");
}

function getRewardValue(draft: DiscountFormDraft) {
  if (
    draft.rewardType === "free_shipping" ||
    draft.rewardType === "freebie_product" ||
    draft.rewardType === "custom_perk"
  ) {
    return 0;
  }

  if (draft.rewardType === "buy_x_get_y") {
    return numberOrZero(draft.buyQuantity);
  }

  return numberOrZero(draft.rewardValue);
}

function createRewardMetadata(draft: DiscountFormDraft) {
  if (draft.rewardType === "buy_x_get_y") {
    return {
      buyQuantity: numberOrZero(draft.buyQuantity),
      getQuantity: numberOrZero(draft.getQuantity),
    };
  }

  if (draft.rewardType === "freebie_product" && draft.freebieGiftId.trim()) {
    return {
      giftId: draft.freebieGiftId.trim(),
    };
  }

  if (draft.rewardType === "custom_perk" && draft.perkDescription.trim()) {
    return {
      customPerkDescription: draft.perkDescription.trim(),
    };
  }

  return null;
}
