export type OfferingType = "product" | "service";
export type OfferingSubType =
  | "physical"
  | "digital"
  | "consultation"
  | "consultation_online"
  | "event"
  | "event_online"
  | "digital_service";
export type OfferingStatusType =
  | "draft"
  | "active"
  | "paused"
  | "disabled";
export type OfferingFeatureType = "booking" | "delivery";

export type OfferingLocation = {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
};

export type OfferingData = {
  id: string;
  businessId: string;
  createdAt: number;
  updatedAt: number;
  name: string;
  description?: string | null;
  type: OfferingType;
  subType?: OfferingSubType | null;
  status: OfferingStatusType;
  imageUrl?: string | null;
  imageUrls?: string[] | null;
  price?: number | null;
  currency?: string | null;
  quantity?: number | null;
  duration?: number | null;
  features?: OfferingFeatureType[] | null;
  location?: OfferingLocation | null;
  meta?: Record<string, unknown> | null;
  tags: string[];
};

const offerings: OfferingData[] = [
  {
    id: "offering_001",
    businessId: "biz_northstar",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
    updatedAt: Date.now() - 1000 * 60 * 60 * 6,
    name: "Starter Skincare Kit",
    description: "A curated physical kit for first-time customers.",
    type: "product",
    subType: "physical",
    status: "active",
    price: 45000,
    currency: "NGN",
    quantity: 36,
    imageUrls: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03",
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b",
    ],
    tags: ["starter", "skin-care", "bundle"],
  },
  {
    id: "offering_002",
    businessId: "biz_northstar",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
    name: "Virtual Brand Consultation",
    description: "A 60 minute advisory session for new business owners.",
    type: "service",
    subType: "consultation_online",
    status: "active",
    price: 30000,
    currency: "NGN",
    duration: 60,
    features: ["booking"],
    imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72",
    tags: ["consultation", "virtual"],
    location: null,
    meta: {
      meetingLink: "https://meet.google.com/example",
    },
  },
  {
    id: "offering_003",
    businessId: "biz_northstar",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
    updatedAt: Date.now() - 1000 * 60 * 30,
    name: "Growth Playbook Download",
    description: "Digital templates and checklists for loyalty launches.",
    type: "product",
    subType: "digital",
    status: "draft",
    price: 15000,
    currency: "NGN",
    quantity: null,
    imageUrls: [],
    tags: ["digital", "templates"],
  },
  {
    id: "offering_004",
    businessId: "biz_northstar",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 40,
    updatedAt: Date.now() - 1000 * 60 * 60 * 48,
    name: "In-store Launch Workshop",
    description: "A hands-on event for retail teams adopting Piya.",
    type: "service",
    subType: "event",
    status: "paused",
    price: 120000,
    currency: "NGN",
    duration: 180,
    features: ["booking", "delivery"],
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
    tags: ["event", "training"],
    location: {
      address: "12 Admiralty Way",
      city: "Lekki",
      state: "Lagos",
      country: "Nigeria",
      postalCode: "105102",
    },
  },
];

export function getOfferings() {
  return offerings;
}
