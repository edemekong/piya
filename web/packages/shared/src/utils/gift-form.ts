import type { GiftData } from "../models";
import type { GiftDraft, GiftInput } from "../types";
import { formatEnumLabel } from "./format";
import { numberOrNull } from "./number";

export function createEmptyGiftDraft(): GiftDraft {
  return {
    currency: "NGN",
    description: "",
    estimatedValue: "",
    imageBase64: "",
    imageUrl: "",
    name: "",
    quantityAvailable: "",
    status: "active",
  };
}

export function createGiftDraft(gift: GiftData): GiftDraft {
  return {
    currency: gift.currency ?? "NGN",
    description: gift.description ?? "",
    estimatedValue: gift.estimatedValue?.toString() ?? "",
    imageBase64: "",
    imageUrl: gift.imageUrl ?? "",
    name: gift.name,
    quantityAvailable: gift.quantityAvailable?.toString() ?? "",
    status: gift.status,
  };
}

export function draftToGift(draft: GiftDraft): GiftInput {
  return {
    currency: draft.estimatedValue ? draft.currency || null : null,
    description: draft.description || null,
    estimatedValue: numberOrNull(draft.estimatedValue),
    ...(draft.imageBase64 ? { imageBase64: draft.imageBase64 } : {}),
    name: draft.name,
    quantityAvailable: numberOrNull(draft.quantityAvailable),
    status: draft.status,
  };
}

export function formatGiftLabel(value: string) {
  return formatEnumLabel(value);
}
