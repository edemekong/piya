import type { GiftData } from "../models";
import type { GiftDraft } from "../types";
import { formatEnumLabel } from "./format";
import { numberOrNull, numberOrZero } from "./number";
import { splitCommaList } from "./list";

export function createEmptyGiftDraft(): GiftDraft {
  return {
    currency: "NGN",
    description: "",
    estimatedValue: "",
    imageUrl: "",
    maxPerContact: "1",
    name: "",
    quantityAvailable: "",
    status: "draft",
    tags: "",
  };
}

export function createGiftDraft(gift: GiftData): GiftDraft {
  return {
    currency: gift.currency ?? "NGN",
    description: gift.description ?? "",
    estimatedValue: gift.estimatedValue?.toString() ?? "",
    imageUrl: gift.imageUrl ?? "",
    maxPerContact: gift.maxPerContact.toString(),
    name: gift.name,
    quantityAvailable: gift.quantityAvailable?.toString() ?? "",
    status: gift.status,
    tags: gift.tags.join(", "),
  };
}

export function draftToGift(
  draft: GiftDraft,
  existing?: GiftData | null,
): GiftData {
  const now = Date.now();

  return {
    businessId: existing?.businessId ?? "biz_northstar",
    createdAt: existing?.createdAt ?? now,
    currency: draft.currency || null,
    description: draft.description || null,
    estimatedValue: numberOrNull(draft.estimatedValue),
    id: existing?.id ?? createGiftId(draft.name, now),
    imageUrl: draft.imageUrl || null,
    maxPerContact: numberOrZero(draft.maxPerContact) || 1,
    name: draft.name,
    quantityAvailable: numberOrNull(draft.quantityAvailable),
    status: draft.status,
    tags: splitCommaList(draft.tags),
    updatedAt: now,
  };
}

export function formatGiftLabel(value: string) {
  return formatEnumLabel(value);
}

function createGiftId(name: string, timestamp: number) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 36);

  return `gift_${slug || timestamp}`;
}
