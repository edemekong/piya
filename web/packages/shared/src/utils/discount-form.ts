import type { DiscountData, DiscountReward } from "../models";
import type { DiscountFormDraft, DiscountInput } from "../types";
import { dateInputToTimestamp, formatShortDate, timestampToDateInput } from "./date";
import { formatEnumLabel } from "./format";
import { nullableCommaList } from "./list";
import { numberOrNull, numberOrZero } from "./number";

export function createEmptyDiscountDraft(): DiscountFormDraft {
  return {
    applicabilityScope: "all_offerings",
    buyQuantity: "",
    code: "",
    description: "",
    endsAt: "",
    freebieGiftId: "",
    getQuantity: "",
    maxDiscountAmount: "",
    maxUsesPerContact: "1",
    minimumOrderValue: "",
    offeringIds: "",
    rewardType: "percentage_discount",
    rewardValue: "",
    startsAt: timestampToDateInput(Date.now()),
    status: "draft",
    title: "",
    totalUsageLimit: "",
  };
}

export function createDiscountDraft(discount: DiscountData): DiscountFormDraft {
  return {
    applicabilityScope: discount.rules.applicabilityScope ?? "all_offerings",
    buyQuantity:
      discount.reward.type === "buy_x_get_y"
        ? discount.reward.metadata.buyQuantity.toString()
        : "",
    code: discount.code ?? "",
    description: discount.description,
    endsAt: discount.endsAt ? timestampToDateInput(discount.endsAt) : "",
    freebieGiftId:
      discount.reward.type === "freebie_product"
        ? discount.reward.metadata.giftId
        : "",
    getQuantity:
      discount.reward.type === "buy_x_get_y"
        ? discount.reward.metadata.getQuantity.toString()
        : "",
    maxDiscountAmount:
      discount.reward.type === "percentage_discount"
        ? discount.reward.maxDiscountAmount?.toString() ?? ""
        : "",
    maxUsesPerContact: discount.rules.maxUsesPerContact.toString(),
    minimumOrderValue: discount.rules.minimumOrderValue?.toString() ?? "",
    offeringIds: discount.rules.offeringIds?.join(", ") ?? "",
    rewardType: discount.reward.type,
    rewardValue:
      discount.reward.type === "percentage_discount" ||
      discount.reward.type === "fixed_amount_discount" ||
      discount.reward.type === "cashback_credit"
        ? discount.reward.value.toString()
        : "",
    startsAt: timestampToDateInput(discount.startsAt),
    status: discount.status,
    title: discount.title,
    totalUsageLimit: discount.rules.totalUsageLimit?.toString() ?? "",
  };
}

export function draftToDiscount(draft: DiscountFormDraft): DiscountInput {
  const now = Date.now();

  return {
    code: draft.code.trim() || null,
    description: draft.description,
    endsAt: dateInputToTimestamp(draft.endsAt),
    reward: createDiscountReward(draft),
    rules: {
      applicabilityScope: draft.applicabilityScope,
      maxUsesPerContact: numberOrZero(draft.maxUsesPerContact) || 1,
      minimumOrderValue: numberOrNull(draft.minimumOrderValue),
      offeringIds:
        draft.applicabilityScope === "specific_offerings"
          ? nullableCommaList(draft.offeringIds)
          : null,
      totalUsageLimit: numberOrNull(draft.totalUsageLimit),
    },
    startsAt: dateInputToTimestamp(draft.startsAt) ?? now,
    status: draft.status,
    title: draft.title,
  };
}

export function formatDiscountLabel(value: string) {
  if (value === "freebie_product") return "Freebies";

  return formatEnumLabel(value);
}

export function formatDiscountDate(timestamp?: number | null) {
  return formatShortDate(timestamp, "No end date", "en-NG");
}

function createDiscountReward(draft: DiscountFormDraft): DiscountReward {
  if (draft.rewardType === "buy_x_get_y") {
    return {
      metadata: {
        buyQuantity: numberOrZero(draft.buyQuantity),
        getQuantity: numberOrZero(draft.getQuantity),
      },
      type: "buy_x_get_y",
    };
  }

  if (draft.rewardType === "freebie_product") {
    return {
      metadata: {
        giftId: draft.freebieGiftId.trim(),
      },
      type: "freebie_product",
    };
  }

  if (draft.rewardType === "percentage_discount") {
    return {
      maxDiscountAmount: numberOrNull(draft.maxDiscountAmount),
      type: "percentage_discount",
      value: numberOrZero(draft.rewardValue),
    };
  }

  return {
    type: draft.rewardType,
    value: numberOrZero(draft.rewardValue),
  };
}
