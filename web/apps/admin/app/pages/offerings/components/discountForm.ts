import type {
  DiscountData,
  DiscountStatusType,
  RewardType,
} from "@piya/shared/services";

export type DiscountFormDraft = {
  buyQuantity: string;
  code: string;
  codeGeneration: "manual" | "unique_per_contact";
  currency: string;
  description: string;
  endsAt: string;
  freebieGiftId: string;
  getQuantity: string;
  maxDiscountAmount: string;
  maxUsesPerContact: string;
  minimumOrderValue: string;
  perkDescription: string;
  rewardType: RewardType;
  rewardValue: string;
  startsAt: string;
  status: DiscountStatusType;
  targetBadgeTypes: string;
  targetTags: string;
  title: string;
  totalUsageLimit: string;
};

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
    startsAt: formatDateInput(Date.now()),
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
    endsAt: discount.endsAt ? formatDateInput(discount.endsAt) : "",
    freebieGiftId: discount.reward.metadata?.giftId ?? "",
    getQuantity: discount.reward.metadata?.getQuantity?.toString() ?? "",
    maxDiscountAmount: discount.reward.maxDiscountAmount?.toString() ?? "",
    maxUsesPerContact: discount.rules.maxUsesPerContact.toString(),
    minimumOrderValue: discount.rules.minimumOrderValue?.toString() ?? "",
    perkDescription: discount.reward.metadata?.customPerkDescription ?? "",
    rewardType: discount.reward.type,
    rewardValue: discount.reward.value.toString(),
    startsAt: formatDateInput(discount.startsAt),
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
    endsAt: dateOrNull(draft.endsAt),
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
      targetBadgeTypes: nullableList(draft.targetBadgeTypes),
      targetTags: nullableList(draft.targetTags),
      totalUsageLimit: numberOrNull(draft.totalUsageLimit),
    },
    startsAt: dateOrNull(draft.startsAt) ?? now,
    status: draft.status,
    title: draft.title,
    type: "discount",
    updatedAt: now,
  };
}

export function formatDiscountLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatDiscountDate(timestamp?: number | null) {
  if (!timestamp) return "No end date";

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(timestamp);
}

function formatDateInput(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function dateOrNull(value: string) {
  if (!value) return null;

  const timestamp = new Date(`${value}T00:00:00`).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}

function nullableList(value: string) {
  const list = splitList(value);
  return list.length > 0 ? list : null;
}

function numberOrNull(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && value.trim() !== "" ? parsed : null;
}

function numberOrZero(value: string) {
  return numberOrNull(value) ?? 0;
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

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
