import type { OfferingData } from "../models";
import type {
  CheckoutPaymentMode,
  OfferingCheckoutIntentType,
  OfferingFormDraft,
  OfferingSubType,
  OfferingType,
} from "../types";
import { splitCommaList } from "./list";
import { formatEnumLabel } from "./format";
import { numberOrNull } from "./number";

export function createEmptyOfferingDraft(): OfferingFormDraft {
  return {
    attributes: [],
    categoryId: "",
    categoryName: "",
    currency: "NGN",
    description: "",
    duration: "",
    features: [],
    imageUrl: "",
    imageUrls: "",
    inventoryAllowBackorders: false,
    inventoryQuantity: "",
    inventorySku: "",
    inventoryTrackQuantity: false,
    options: [],
    checkoutIntents: [],
    discountIds: [],
    locationAddress: "",
    locationCity: "",
    locationCountry: "",
    locationPostalCode: "",
    locationState: "",
    maxQuantity: "",
    meetingLink: "",
    minQuantity: "",
    name: "",
    paymentModes: ["pay_now", "pay_later"],
    price: "",
    depositAmount: "",
    depositPercent: "",
    requiresBusinessConfirmation: false,
    status: "draft",
    subType: "",
    tags: "",
    type: "",
    variants: [],
  };
}

export function createOfferingDraft(offering: OfferingData): OfferingFormDraft {
  return {
    attributes:
      offering.attributes?.map((attribute) => ({
        id: attribute.id ?? "",
        name: attribute.name,
        unit: attribute.unit ?? "",
        value: attribute.value,
        valueType: attribute.valueType ?? "text",
      })) ?? [],
    categoryId: offering.category?.id ?? "",
    categoryName: offering.category?.name ?? "",
    currency: offering.currency ?? "NGN",
    description: offering.description ?? "",
    duration: offering.duration?.toString() ?? "",
    features: offering.features ?? [],
    imageUrl: offering.imageUrls?.[0] ?? "",
    imageUrls: offering.imageUrls?.join(", ") ?? "",
    inventoryAllowBackorders: offering.inventory?.allowBackorders ?? false,
    inventoryQuantity: offering.inventory?.quantity?.toString() ?? "",
    inventorySku: offering.inventory?.sku ?? "",
    inventoryTrackQuantity: offering.inventory?.trackQuantity ?? false,
    options:
      offering.options?.map((option) => ({
        id: option.id ?? "",
        name: option.name,
        values: option.values.join(", "),
      })) ?? [],
    checkoutIntents:
      offering.commerce?.checkoutIntents ??
      getDefaultCheckoutIntents(offering.type),
    discountIds: offering.commerce?.discountIds ?? [],
    locationAddress: offering.location?.address ?? "",
    locationCity: offering.location?.city ?? "",
    locationCountry: offering.location?.country ?? "",
    locationPostalCode: offering.location?.postalCode ?? "",
    locationState: offering.location?.state ?? "",
    maxQuantity: offering.commerce?.maxQuantity?.toString() ?? "",
    meetingLink:
      typeof offering.meta?.meetingLink === "string"
        ? offering.meta.meetingLink
        : "",
    minQuantity: offering.commerce?.minQuantity?.toString() ?? "",
    name: offering.name,
    paymentModes: offering.commerce?.paymentModes ?? ["pay_now", "pay_later"],
    price: offering.price?.toString() ?? "",
    depositAmount: offering.commerce?.depositAmount?.toString() ?? "",
    depositPercent: offering.commerce?.depositPercent?.toString() ?? "",
    requiresBusinessConfirmation:
      offering.commerce?.requiresBusinessConfirmation ?? false,
    status: offering.status,
    subType: offering.subType ?? "",
    tags: offering.tags.join(", "),
    type: offering.type,
    variants:
      offering.variants?.map((variant) => ({
        id: variant.id,
        imageUrl: variant.imageUrl ?? "",
        price: variant.price?.toString() ?? "",
        quantity: variant.quantity?.toString() ?? "",
        sku: variant.sku ?? "",
        status: variant.status ?? offering.status,
        title: variant.title,
      })) ?? [],
  };
}

export function draftToOffering(
  draft: OfferingFormDraft,
  existing?: OfferingData | null,
): OfferingData {
  const now = Date.now();
  const shared = {
    businessId: existing?.businessId ?? "biz_northstar",
    category: draft.categoryName
      ? {
          id: draft.categoryId || null,
          name: draft.categoryName,
        }
      : null,
    createdAt: existing?.createdAt ?? now,
    currency: draft.currency || null,
    description: draft.description || null,
    id: existing?.id ?? `offering_${now}`,
    name: draft.name,
    price: numberOrNull(draft.price),
    status: draft.status,
    tags: splitCommaList(draft.tags),
    type: draft.type || "product",
    updatedAt: now,
  };
  const commerce = {
    checkoutIntents: getCommerceCheckoutIntents(draft),
    depositAmount: numberOrNull(draft.depositAmount),
    depositPercent: numberOrNull(draft.depositPercent),
    discountIds: draft.discountIds.length ? draft.discountIds : null,
    maxQuantity: numberOrNull(draft.maxQuantity),
    minQuantity: numberOrNull(draft.minQuantity),
    paymentModes: draft.paymentModes,
    requiresBusinessConfirmation: draft.requiresBusinessConfirmation,
  };

  if (draft.type === "service") {
    const isOnlineService = draft.subType === "online_appointment";
    const hasLocation =
      draft.locationAddress ||
      draft.locationCity ||
      draft.locationState ||
      draft.locationCountry ||
      draft.locationPostalCode;
    const location =
      !isOnlineService && hasLocation
        ? {
            address: draft.locationAddress,
            city: draft.locationCity,
            country: draft.locationCountry,
            postalCode: draft.locationPostalCode || undefined,
            state: draft.locationState,
          }
        : null;

    return {
      ...shared,
      duration: numberOrNull(draft.duration),
      features: draft.features,
      attributes: null,
      commerce,
      imageUrls: draft.imageUrl ? [draft.imageUrl] : null,
      inventory: null,
      location,
      meta: isOnlineService && draft.meetingLink
        ? { meetingLink: draft.meetingLink }
        : null,
      subType: draft.subType || null,
      type: "service",
      options: null,
      variants: null,
    };
  }

  return {
    ...shared,
    duration: null,
    attributes: getProductAttributes(draft),
    features: draft.features.length ? draft.features : null,
    commerce,
    imageUrls: splitCommaList(draft.imageUrls),
    inventory: getProductInventory(draft),
    location: null,
    options: getProductOptions(draft),
    subType: draft.subType || null,
    type: "product",
    variants: getProductVariants(draft),
  };
}

export function formatOfferingLabel(value: string) {
  if (value === "online_appointment") return "Online appointment";

  return formatEnumLabel(value);
}

export function formatOfferingSubTypeLabel(subType: OfferingSubType) {
  return formatOfferingLabel(subType);
}

export function getDefaultCheckoutIntents(
  type: OfferingType | "",
): OfferingCheckoutIntentType[] {
  if (type === "product") return ["buy"];
  if (type === "service") return ["book"];
  if (type === "accommodation") return ["reserve_room"];
  if (type === "delivery") return ["create_delivery"];

  return [];
}

export function getDefaultPaymentModes(): CheckoutPaymentMode[] {
  return ["pay_now", "pay_later"];
}

function getCommerceCheckoutIntents(
  draft: OfferingFormDraft,
): OfferingCheckoutIntentType[] {
  return draft.checkoutIntents.length
    ? draft.checkoutIntents
    : getDefaultCheckoutIntents(draft.type);
}

function getProductInventory(draft: OfferingFormDraft) {
  if (!draft.inventoryTrackQuantity && !draft.inventorySku) return null;

  return {
    allowBackorders: draft.inventoryAllowBackorders,
    quantity: draft.inventoryTrackQuantity
      ? numberOrNull(draft.inventoryQuantity)
      : null,
    sku: draft.inventorySku || null,
    trackQuantity: draft.inventoryTrackQuantity,
  };
}

function getProductAttributes(draft: OfferingFormDraft) {
  const attributes = draft.attributes
    .filter((attribute) => attribute.name && attribute.value)
    .map((attribute) => ({
      id: attribute.id || null,
      name: attribute.name,
      unit: attribute.unit || null,
      value: attribute.value,
      valueType: attribute.valueType,
    }));

  return attributes.length ? attributes : null;
}

function getProductOptions(draft: OfferingFormDraft) {
  const options = draft.options
    .filter((option) => option.name && option.values)
    .map((option) => ({
      id: option.id || null,
      name: option.name,
      values: splitCommaList(option.values),
    }))
    .filter((option) => option.values.length);

  return options.length ? options : null;
}

function getProductVariants(draft: OfferingFormDraft) {
  const variants = draft.variants
    .filter((variant) => variant.title)
    .map((variant) => ({
      id: variant.id || `variant_${Date.now()}`,
      imageUrl: variant.imageUrl || null,
      optionValues: {},
      price: numberOrNull(variant.price),
      quantity: numberOrNull(variant.quantity),
      sku: variant.sku || null,
      status: variant.status,
      title: variant.title,
    }));

  return variants.length ? variants : null;
}
