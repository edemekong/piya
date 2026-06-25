import type { GiftData, GiftDraft } from "../models";

export type { GiftData, GiftDraft, GiftStatusType } from "../models";

const gifts: GiftData[] = [
  {
    id: "gift_mini_glow_serum",
    businessId: "biz_northstar",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 18,
    updatedAt: Date.now() - 1000 * 60 * 60 * 7,
    name: "Mini Glow Serum",
    description: "Travel-size serum for skincare bundle promotions.",
    status: "active",
    estimatedValue: 8500,
    currency: "NGN",
    quantityAvailable: 120,
    maxPerContact: 1,
    imageUrl: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908",
    tags: ["skin-care", "sample"],
  },
  {
    id: "gift_brand_workbook",
    businessId: "biz_northstar",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
    name: "Brand Workbook",
    description: "Digital workbook bundled with consultation discounts.",
    status: "active",
    estimatedValue: 5000,
    currency: "NGN",
    quantityAvailable: null,
    maxPerContact: 1,
    imageUrl: null,
    tags: ["digital", "templates"],
  },
];

export function getGifts() {
  return gifts;
}

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
    tags: splitList(draft.tags),
    updatedAt: now,
  };
}

export function formatGiftLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function createGiftId(name: string, timestamp: number) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 36);

  return `gift_${slug || timestamp}`;
}

function numberOrNull(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && value.trim() !== "" ? parsed : null;
}

function numberOrZero(value: string) {
  return numberOrNull(value) ?? 0;
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
