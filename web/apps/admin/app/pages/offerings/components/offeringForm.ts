import type {
  OfferingData,
  OfferingFeatureType,
  OfferingStatusType,
  OfferingSubType,
  OfferingType,
} from "@/services/offerings.service";

export type OfferingFormDraft = {
  currency: string;
  description: string;
  duration: string;
  features: OfferingFeatureType[];
  imageUrl: string;
  imageUrls: string;
  locationAddress: string;
  locationCity: string;
  locationCountry: string;
  locationPostalCode: string;
  locationState: string;
  meetingLink: string;
  name: string;
  price: string;
  quantity: string;
  status: OfferingStatusType;
  subType: OfferingSubType | "";
  tags: string;
  type: OfferingType | "";
};

export function createEmptyOfferingDraft(): OfferingFormDraft {
  return {
    currency: "NGN",
    description: "",
    duration: "",
    features: [],
    imageUrl: "",
    imageUrls: "",
    locationAddress: "",
    locationCity: "",
    locationCountry: "",
    locationPostalCode: "",
    locationState: "",
    meetingLink: "",
    name: "",
    price: "",
    quantity: "",
    status: "draft",
    subType: "",
    tags: "",
    type: "",
  };
}

export function createOfferingDraft(offering: OfferingData): OfferingFormDraft {
  return {
    currency: offering.currency ?? "NGN",
    description: offering.description ?? "",
    duration: offering.duration?.toString() ?? "",
    features: offering.features ?? [],
    imageUrl: offering.imageUrl ?? "",
    imageUrls: offering.imageUrls?.join(", ") ?? "",
    locationAddress: offering.location?.address ?? "",
    locationCity: offering.location?.city ?? "",
    locationCountry: offering.location?.country ?? "",
    locationPostalCode: offering.location?.postalCode ?? "",
    locationState: offering.location?.state ?? "",
    meetingLink:
      typeof offering.meta?.meetingLink === "string"
        ? offering.meta.meetingLink
        : "",
    name: offering.name,
    price: offering.price?.toString() ?? "",
    quantity: offering.quantity?.toString() ?? "",
    status: offering.status,
    subType: offering.subType ?? "",
    tags: offering.tags.join(", "),
    type: offering.type,
  };
}

export function draftToOffering(
  draft: OfferingFormDraft,
  existing?: OfferingData | null,
): OfferingData {
  const now = Date.now();
  const shared = {
    businessId: existing?.businessId ?? "biz_northstar",
    createdAt: existing?.createdAt ?? now,
    currency: draft.currency || null,
    description: draft.description || null,
    id: existing?.id ?? `offering_${now}`,
    name: draft.name,
    price: numberOrNull(draft.price),
    status: draft.status,
    tags: splitList(draft.tags),
    type: draft.type || "product",
    updatedAt: now,
  };

  if (draft.type === "service") {
    const isOnlineService =
      draft.subType === "consultation_online" || draft.subType === "event_online";
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
      imageUrl: draft.imageUrl || null,
      imageUrls: null,
      location,
      meta: isOnlineService && draft.meetingLink
        ? { meetingLink: draft.meetingLink }
        : null,
      quantity: null,
      subType: draft.subType || null,
      type: "service",
    };
  }

  return {
    ...shared,
    duration: null,
    features: null,
    imageUrl: null,
    imageUrls: splitList(draft.imageUrls),
    location: null,
    quantity: numberOrNull(draft.quantity),
    subType: draft.subType || null,
    type: "product",
  };
}

export function formatOfferingLabel(value: string) {
  if (value === "consultation_online") return "Consultation | Online";
  if (value === "event_online") return "Event | Online";

  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function numberOrNull(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && value.trim() !== "" ? parsed : null;
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
