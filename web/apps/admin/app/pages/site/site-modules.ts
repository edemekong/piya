import {
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileUp,
  Gift,
  Home,
  MapPin,
  MessageCircle,
  PackageSearch,
  Phone,
  ShoppingCart,
  Sparkles,
  Store,
  Truck,
  UserRound,
  WalletCards,
} from "lucide-react";
import type { BusinessCategoryTypes } from "@piya/shared";
import { getOfferingDisplayConfig } from "@/utils/offering-display";
import type {
  SiteBusinessFamily,
  SiteCategory,
  SiteModuleDefinition,
  SiteModuleDisplay,
  SiteModuleGroup,
  SiteModuleId,
} from "./types";

export const siteModuleGroups: SiteModuleGroup[] = [
  { id: "start", title: "Start" },
  { id: "browse", title: "Browse" },
  { id: "customer-action", title: "Take action" },
  { id: "finish", title: "Finish" },
];

const siteModulePaths: Record<SiteModuleId, string> = {
  welcome: "/",
  "business-profile": "/about",
  "location-first": "/location",
  offerings: "/offerings",
  "offering-details": "/offerings/:offeringId",
  availability: "/offerings/:offeringId/availability",
  cart: "/cart",
  checkout: "/checkout",
  "booking-form": "/booking",
  "delivery-request": "/delivery-request",
  "quote-request": "/quote-request",
  "customer-info": "/customer-info",
  "contact-form": "/contact",
  chat: "/chat",
  "location-map": "/locations",
  "upload-documents": "/quote-request/documents",
  reviews: "/reviews",
  loyalty: "/rewards",
  confirmation: "/confirmation",
};

export const siteModuleDefinitions: SiteModuleDefinition[] = [
  {
    appliesTo: ["all"],
    description: "The first section customers see on the site.",
    groupId: "start",
    icon: Home,
    id: "welcome",
    modelLabels: ["site", "business", "storefront"],
    title: "Welcome",
  },
  {
    appliesTo: ["all"],
    description: "Business story, contact details, hours, and trust information.",
    groupId: "start",
    icon: Store,
    id: "business-profile",
    modelLabels: ["business", "location", "channel-settings"],
    title: "Business profile",
  },
  {
    appliesTo: ["commerce", "delivery"],
    description: "Ask for customer location before showing available options.",
    groupId: "start",
    icon: MapPin,
    id: "location-first",
    modelLabels: ["location", "delivery-pricing", "site"],
    title: "Location first",
  },
  {
    appliesTo: ["all"],
    description: "Show what the business provides, adapted by business category.",
    groupId: "browse",
    icon: PackageSearch,
    id: "offerings",
    modelLabels: ["offering", "discount", "gift"],
    title: "Offerings",
  },
  {
    appliesTo: ["all"],
    description: "Details, pricing, options, images, duration, or availability hints.",
    groupId: "browse",
    icon: ClipboardList,
    id: "offering-details",
    modelLabels: ["offering", "discount", "gift"],
    title: "Offering details",
  },
  {
    appliesTo: ["appointment", "hospitality"],
    description: "Let customers pick date, time, stay dates, or available slots.",
    groupId: "customer-action",
    icon: CalendarClock,
    id: "availability",
    modelLabels: ["availability", "booking", "accommodation"],
    title: "Availability",
  },
  {
    appliesTo: ["commerce"],
    description: "Review selected items before checkout.",
    groupId: "customer-action",
    icon: ShoppingCart,
    id: "cart",
    modelLabels: ["order", "offering", "discount", "gift"],
    title: "Cart",
  },
  {
    appliesTo: ["commerce"],
    description: "Customer details, fulfillment, discounts, gifts, and payment.",
    groupId: "customer-action",
    icon: WalletCards,
    id: "checkout",
    modelLabels: ["order", "contact", "delivery-pricing", "discount", "gift"],
    title: "Checkout",
  },
  {
    appliesTo: ["appointment", "hospitality"],
    description: "Collect booking details and create a booking or reservation.",
    groupId: "customer-action",
    icon: CalendarClock,
    id: "booking-form",
    modelLabels: ["booking", "contact", "order", "accommodation"],
    title: "Booking form",
  },
  {
    appliesTo: ["delivery"],
    description: "Send or receive package flow with locations, package info, and contact info.",
    groupId: "customer-action",
    icon: Truck,
    id: "delivery-request",
    modelLabels: ["delivery", "delivery-pricing", "location", "contact", "order"],
    title: "Delivery request",
  },
  {
    appliesTo: ["custom-work", "appointment"],
    description: "Collect custom work requirements and create a lead request.",
    groupId: "customer-action",
    icon: FileUp,
    id: "quote-request",
    modelLabels: ["lead-request", "document", "contact"],
    title: "Quote request",
  },
  {
    appliesTo: ["all"],
    description: "Collect name, phone, email, or other customer details.",
    groupId: "customer-action",
    icon: UserRound,
    id: "customer-info",
    modelLabels: ["contact", "lead-request", "order", "booking", "delivery"],
    title: "Customer info",
  },
  {
    appliesTo: ["all"],
    description: "Let customers ask a question or request a callback.",
    groupId: "customer-action",
    icon: Phone,
    id: "contact-form",
    modelLabels: ["lead-request", "contact", "communication"],
    title: "Contact form",
  },
  {
    appliesTo: ["all"],
    description: "Start a conversation from the site.",
    groupId: "customer-action",
    icon: MessageCircle,
    id: "chat",
    modelLabels: ["chat", "communication", "contact"],
    title: "Chat",
  },
  {
    appliesTo: ["all"],
    description: "Show address, service area, pickup point, or delivery coverage.",
    groupId: "customer-action",
    icon: MapPin,
    id: "location-map",
    modelLabels: ["location", "service-location"],
    title: "Location / map",
  },
  {
    appliesTo: ["custom-work"],
    description: "Collect references, files, and supporting documents.",
    groupId: "customer-action",
    icon: FileUp,
    id: "upload-documents",
    modelLabels: ["document", "lead-request"],
    title: "Upload documents",
  },
  {
    appliesTo: ["all"],
    description: "Show proof and help customers feel confident.",
    groupId: "customer-action",
    icon: BadgeCheck,
    id: "reviews",
    modelLabels: ["storefront"],
    title: "Reviews",
  },
  {
    appliesTo: ["commerce"],
    description: "Show rewards, perks, badges, or gifts in catalog and checkout.",
    groupId: "customer-action",
    icon: Gift,
    id: "loyalty",
    modelLabels: ["badge", "contact-tag", "gift"],
    title: "Loyalty / rewards",
  },
  {
    appliesTo: ["all"],
    description: "Show what happened and what customers should expect next.",
    groupId: "finish",
    icon: CheckCircle2,
    id: "confirmation",
    modelLabels: ["order", "booking", "delivery", "lead-request", "communication"],
    title: "Confirmation",
  },
];

const categoryFamilies: Record<BusinessCategoryTypes, SiteBusinessFamily> = {
  barbershop: "appointment",
  beauty_studio: "appointment",
  car_wash: "appointment",
  consulting: "custom-work",
  electronics_store: "commerce",
  farm_produce: "commerce",
  fashion_store: "commerce",
  fashion_tailoring: "custom-work",
  food_vendor: "commerce",
  hotel_guesthouse: "hospitality",
  laundry: "appointment",
  logistics_delivery: "delivery",
  photography: "custom-work",
  real_estate_agent: "custom-work",
  restaurant: "commerce",
  salon: "appointment",
  shortlet_apartment: "hospitality",
  spa: "appointment",
  supermarket: "commerce",
};

const siteModulesByBusinessCategory: Record<
  BusinessCategoryTypes,
  SiteModuleId[]
> = {
  barbershop: [
    "welcome",
    "business-profile",
    "offerings",
    "offering-details",
    "availability",
    "booking-form",
    "customer-info",
    "contact-form",
    "chat",
    "location-map",
    "reviews",
    "confirmation",
  ],
  beauty_studio: [
    "welcome",
    "business-profile",
    "offerings",
    "offering-details",
    "availability",
    "booking-form",
    "customer-info",
    "contact-form",
    "chat",
    "location-map",
    "reviews",
    "confirmation",
  ],
  car_wash: [
    "welcome",
    "business-profile",
    "offerings",
    "offering-details",
    "availability",
    "booking-form",
    "customer-info",
    "contact-form",
    "chat",
    "location-map",
    "reviews",
    "confirmation",
  ],
  consulting: [
    "welcome",
    "business-profile",
    "offerings",
    "offering-details",
    "quote-request",
    "customer-info",
    "contact-form",
    "chat",
    "reviews",
    "confirmation",
  ],
  electronics_store: [
    "welcome",
    "business-profile",
    "offerings",
    "offering-details",
    "cart",
    "checkout",
    "customer-info",
    "contact-form",
    "chat",
    "location-map",
    "reviews",
    "loyalty",
    "confirmation",
  ],
  farm_produce: [
    "welcome",
    "business-profile",
    "location-first",
    "offerings",
    "offering-details",
    "cart",
    "checkout",
    "customer-info",
    "contact-form",
    "chat",
    "location-map",
    "reviews",
    "loyalty",
    "confirmation",
  ],
  fashion_store: [
    "welcome",
    "business-profile",
    "offerings",
    "offering-details",
    "cart",
    "checkout",
    "customer-info",
    "contact-form",
    "chat",
    "location-map",
    "reviews",
    "loyalty",
    "confirmation",
  ],
  fashion_tailoring: [
    "welcome",
    "business-profile",
    "offerings",
    "offering-details",
    "quote-request",
    "upload-documents",
    "customer-info",
    "contact-form",
    "chat",
    "location-map",
    "reviews",
    "confirmation",
  ],
  food_vendor: [
    "welcome",
    "business-profile",
    "location-first",
    "offerings",
    "offering-details",
    "cart",
    "checkout",
    "customer-info",
    "contact-form",
    "chat",
    "location-map",
    "reviews",
    "loyalty",
    "confirmation",
  ],
  hotel_guesthouse: [
    "welcome",
    "business-profile",
    "offerings",
    "offering-details",
    "availability",
    "booking-form",
    "customer-info",
    "contact-form",
    "chat",
    "location-map",
    "reviews",
    "confirmation",
  ],
  laundry: [
    "welcome",
    "business-profile",
    "offerings",
    "offering-details",
    "availability",
    "booking-form",
    "customer-info",
    "contact-form",
    "chat",
    "location-map",
    "reviews",
    "confirmation",
  ],
  logistics_delivery: [
    "welcome",
    "business-profile",
    "location-first",
    "offerings",
    "offering-details",
    "delivery-request",
    "customer-info",
    "contact-form",
    "chat",
    "location-map",
    "reviews",
    "confirmation",
  ],
  photography: [
    "welcome",
    "business-profile",
    "offerings",
    "offering-details",
    "quote-request",
    "upload-documents",
    "customer-info",
    "contact-form",
    "chat",
    "location-map",
    "reviews",
    "confirmation",
  ],
  real_estate_agent: [
    "welcome",
    "business-profile",
    "offerings",
    "offering-details",
    "quote-request",
    "customer-info",
    "contact-form",
    "chat",
    "location-map",
    "reviews",
    "confirmation",
  ],
  restaurant: [
    "welcome",
    "business-profile",
    "location-first",
    "offerings",
    "offering-details",
    "cart",
    "checkout",
    "customer-info",
    "contact-form",
    "chat",
    "location-map",
    "reviews",
    "loyalty",
    "confirmation",
  ],
  salon: [
    "welcome",
    "business-profile",
    "offerings",
    "offering-details",
    "availability",
    "booking-form",
    "customer-info",
    "contact-form",
    "chat",
    "location-map",
    "reviews",
    "confirmation",
  ],
  shortlet_apartment: [
    "welcome",
    "business-profile",
    "offerings",
    "offering-details",
    "availability",
    "booking-form",
    "customer-info",
    "contact-form",
    "chat",
    "location-map",
    "reviews",
    "confirmation",
  ],
  spa: [
    "welcome",
    "business-profile",
    "offerings",
    "offering-details",
    "availability",
    "booking-form",
    "customer-info",
    "contact-form",
    "chat",
    "location-map",
    "reviews",
    "confirmation",
  ],
  supermarket: [
    "welcome",
    "business-profile",
    "location-first",
    "offerings",
    "offering-details",
    "cart",
    "checkout",
    "customer-info",
    "contact-form",
    "chat",
    "location-map",
    "reviews",
    "loyalty",
    "confirmation",
  ],
};

export function getSiteBusinessFamily(category: SiteCategory) {
  return category ? categoryFamilies[category] : undefined;
}

export function getVisibleSiteModules(category: SiteCategory) {
  const family = getSiteBusinessFamily(category);
  const suitableModuleIds = category
    ? siteModulesByBusinessCategory[category]
    : undefined;

  return siteModuleDefinitions.filter(
    (module) =>
      (!suitableModuleIds || suitableModuleIds.includes(module.id)) &&
      (module.appliesTo.includes("all") ||
        (family ? module.appliesTo.includes(family) : true)),
  );
}

export function getNextSiteModuleGroupId(groupId?: SiteModuleGroup["id"]) {
  if (!groupId) return "start";
  if (groupId === "start") return "browse";
  if (groupId === "browse") return "customer-action";
  if (groupId === "customer-action") return "finish";
  return "finish";
}

export function getSiteModuleGroupTitle(groupId: SiteModuleGroup["id"]) {
  return siteModuleGroups.find((group) => group.id === groupId)?.title ?? "";
}

export function getSiteModuleDefinition(moduleId: SiteModuleId) {
  return siteModuleDefinitions.find((module) => module.id === moduleId);
}

export function getSiteModulePath(moduleId: SiteModuleId) {
  return siteModulePaths[moduleId];
}

export function getSiteModuleDisplay(
  module: SiteModuleDefinition,
  category: SiteCategory,
): SiteModuleDisplay {
  const offeringDisplay = getOfferingDisplayConfig(category ?? null);
  const offeringPlural = offeringDisplay.plural.toLowerCase();
  const offeringSingular = offeringDisplay.singular.toLowerCase();
  const family = getSiteBusinessFamily(category);
  const override = getCategorySiteModuleDisplay(module.id, category);

  if (override) return override;

  const displays: Partial<Record<SiteModuleId, SiteModuleDisplay>> = {
    availability: {
      description: `Let customers pick dates, times, or slots for ${offeringPlural}.`,
      title: family === "hospitality" ? "Availability calendar" : "Time slots",
    },
    "booking-form": {
      description: `Collect customer details and confirm the selected ${offeringSingular}.`,
      title: family === "hospitality" ? "Reservation form" : "Booking form",
    },
    cart: {
      description: `Review selected ${offeringPlural} before checkout.`,
      title: "Cart",
    },
    checkout: {
      description: `Collect customer details, fulfillment, discounts, gifts, and payment for ${offeringPlural}.`,
      title: "Checkout",
    },
    "customer-info": {
      description: `Collect customer details needed for ${offeringPlural}, bookings, or requests.`,
      title: "Customer info",
    },
    offerings: {
      description: `Show the ${offeringPlural} customers can choose from.`,
      title: offeringDisplay.plural,
    },
    "offering-details": {
      description: `Show pricing, options, images, and details for one ${offeringSingular}.`,
      title: `${offeringDisplay.singular} details`,
    },
    confirmation: {
      description: `Show what happened and what customers should expect next.`,
      title:
        family === "appointment" || family === "hospitality"
          ? "Booking confirmation"
          : "Confirmation",
    },
    loyalty: {
      description: `Show rewards, perks, badges, or gifts connected to ${offeringPlural}.`,
      title: "Rewards",
    },
    reviews: {
      description: `Show proof that helps customers trust these ${offeringPlural}.`,
      title: "Reviews",
    },
  };

  return displays[module.id] ?? module;
}

const siteModulePrerequisites: Partial<Record<SiteModuleId, SiteModuleId>> = {
  availability: "offerings",
  "booking-form": "availability",
  cart: "offerings",
  checkout: "cart",
  "offering-details": "offerings",
  loyalty: "offerings",
  "upload-documents": "quote-request",
};

export function getSiteModuleRequirement(
  moduleId: SiteModuleId,
  existingModuleIds: SiteModuleId[],
  category?: SiteCategory,
) {
  const requiredModuleId = siteModulePrerequisites[moduleId];
  if (!requiredModuleId || existingModuleIds.includes(requiredModuleId)) {
    return undefined;
  }

  const requiredModule = getSiteModuleDefinition(requiredModuleId);
  return requiredModule
    ? `Needs ${getSiteModuleDisplay(requiredModule, category).title}`
    : "Needs another step";
}

export function getSiteModuleAccentClassName(groupId: SiteModuleGroup["id"]) {
  const accents: Record<SiteModuleGroup["id"], string> = {
    browse: "bg-emerald-600/10 text-emerald-600 ring-emerald-600/10",
    "customer-action": "bg-blue-600/10 text-blue-600 ring-blue-600/10",
    finish: "bg-amber-600/10 text-amber-600 ring-amber-600/10",
    start: "bg-cyan-600/10 text-cyan-600 ring-cyan-600/10",
  };

  return accents[groupId];
}

export const siteModuleEmptyIcon = Sparkles;

function getCategorySiteModuleDisplay(
  moduleId: SiteModuleId,
  category: SiteCategory,
): SiteModuleDisplay | undefined {
  if (!category) return undefined;

  const categoryDisplays: Partial<
    Record<BusinessCategoryTypes, Partial<Record<SiteModuleId, SiteModuleDisplay>>>
  > = {
    barbershop: {
      availability: {
        description: "Let customers pick an open haircut or grooming slot.",
        title: "Appointment slots",
      },
      "booking-form": {
        description: "Collect the service, barber preference, and customer details.",
        title: "Barber booking",
      },
      welcome: {
        description: "Introduce the barbershop, style, and booking options.",
        title: "Barbershop welcome",
      },
    },
    beauty_studio: {
      availability: {
        description: "Let clients pick an open beauty appointment slot.",
        title: "Beauty slots",
      },
      "booking-form": {
        description: "Collect the treatment, preferences, and client details.",
        title: "Beauty booking",
      },
      welcome: {
        description: "Introduce beauty services, style, and booking options.",
        title: "Studio welcome",
      },
    },
    car_wash: {
      availability: {
        description: "Let customers pick an open wash or detailing time.",
        title: "Wash slots",
      },
      "booking-form": {
        description: "Collect vehicle details, service choice, and customer info.",
        title: "Car wash booking",
      },
      welcome: {
        description: "Introduce wash packages, detailing, and booking options.",
        title: "Car wash welcome",
      },
    },
    consulting: {
      "booking-form": {
        description: "Collect goals, contact details, and session preferences.",
        title: "Session request",
      },
      "quote-request": {
        description: "Collect project goals, budget, and consulting needs.",
        title: "Consultation request",
      },
      welcome: {
        description: "Introduce expertise, outcomes, and ways to start.",
        title: "Consulting welcome",
      },
    },
    electronics_store: {
      cart: {
        description: "Review selected electronics before checkout.",
        title: "Tech cart",
      },
      checkout: {
        description: "Collect customer details, delivery, warranty notes, and payment.",
        title: "Device checkout",
      },
      welcome: {
        description: "Introduce electronics, deals, and shopping options.",
        title: "Electronics welcome",
      },
    },
    farm_produce: {
      cart: {
        description: "Review selected produce before checkout.",
        title: "Produce basket",
      },
      checkout: {
        description: "Collect customer details, delivery, quantity notes, and payment.",
        title: "Produce checkout",
      },
      welcome: {
        description: "Introduce fresh produce, harvest options, and ordering.",
        title: "Farm produce welcome",
      },
    },
    fashion_store: {
      cart: {
        description: "Review selected fashion items before checkout.",
        title: "Style bag",
      },
      checkout: {
        description: "Collect customer details, sizes, delivery, and payment.",
        title: "Fashion checkout",
      },
      welcome: {
        description: "Introduce styles, collections, and shopping options.",
        title: "Fashion welcome",
      },
    },
    fashion_tailoring: {
      "quote-request": {
        description: "Collect measurements, style references, and sewing needs.",
        title: "Tailoring request",
      },
      "upload-documents": {
        description: "Collect style references, measurements, and inspiration files.",
        title: "Upload style references",
      },
      welcome: {
        description: "Introduce tailoring services, styles, and how orders begin.",
        title: "Tailoring welcome",
      },
    },
    food_vendor: {
      cart: {
        description: "Review selected food items before checkout.",
        title: "Food basket",
      },
      checkout: {
        description: "Collect customer details, pickup or delivery, and payment.",
        title: "Food checkout",
      },
      welcome: {
        description: "Introduce food items, specials, and ordering options.",
        title: "Food vendor welcome",
      },
    },
    hotel_guesthouse: {
      availability: {
        description: "Let guests pick stay dates and available rooms.",
        title: "Room availability",
      },
      "booking-form": {
        description: "Collect guest details and reservation preferences.",
        title: "Room reservation",
      },
      welcome: {
        description: "Introduce the property, rooms, amenities, and location.",
        title: "Hotel welcome",
      },
    },
    laundry: {
      availability: {
        description: "Let customers pick pickup, dropoff, or service times.",
        title: "Laundry slots",
      },
      "booking-form": {
        description: "Collect laundry type, pickup details, and customer info.",
        title: "Laundry booking",
      },
      welcome: {
        description: "Introduce laundry services, turnaround, and pickup options.",
        title: "Laundry welcome",
      },
    },
    logistics_delivery: {
      "delivery-request": {
        description: "Collect pickup, dropoff, package, and sender details.",
        title: "Delivery request",
      },
      "location-first": {
        description: "Ask for pickup and dropoff areas before showing delivery options.",
        title: "Route first",
      },
      welcome: {
        description: "Introduce delivery coverage, speed, and request options.",
        title: "Delivery welcome",
      },
    },
    photography: {
      "booking-form": {
        description: "Collect shoot type, date, location, and customer details.",
        title: "Shoot booking",
      },
      "quote-request": {
        description: "Collect event details, references, and package needs.",
        title: "Photography request",
      },
      welcome: {
        description: "Introduce photography style, packages, and booking options.",
        title: "Photography welcome",
      },
    },
    real_estate_agent: {
      "location-map": {
        description: "Show property locations, service areas, or viewing points.",
        title: "Property map",
      },
      "quote-request": {
        description: "Collect buyer, renter, or seller requirements.",
        title: "Property enquiry",
      },
      welcome: {
        description: "Introduce listings, neighborhoods, and enquiry options.",
        title: "Real estate welcome",
      },
    },
    restaurant: {
      cart: {
        description: "Review selected menu items before checkout.",
        title: "Order basket",
      },
      checkout: {
        description: "Collect diner details, fulfillment, discounts, and payment.",
        title: "Place order",
      },
      welcome: {
        description: "Introduce the restaurant, menu, and ordering options.",
        title: "Restaurant welcome",
      },
    },
    salon: {
      availability: {
        description: "Let clients pick an open hair or beauty appointment.",
        title: "Salon slots",
      },
      "booking-form": {
        description: "Collect service choice, stylist preference, and client details.",
        title: "Salon booking",
      },
      welcome: {
        description: "Introduce salon services, stylists, and booking options.",
        title: "Salon welcome",
      },
    },
    shortlet_apartment: {
      availability: {
        description: "Let guests pick stay dates and available apartments.",
        title: "Stay availability",
      },
      "booking-form": {
        description: "Collect guest details and stay preferences.",
        title: "Stay reservation",
      },
      welcome: {
        description: "Introduce apartments, amenities, location, and stay options.",
        title: "Apartment welcome",
      },
    },
    spa: {
      availability: {
        description: "Let customers pick an open treatment time.",
        title: "Treatment slots",
      },
      "booking-form": {
        description: "Collect treatment choice, preferences, and customer details.",
        title: "Treatment booking",
      },
      welcome: {
        description: "Introduce treatments, ambience, and booking options.",
        title: "Spa welcome",
      },
    },
    supermarket: {
      cart: {
        description: "Review selected groceries before checkout.",
        title: "Grocery cart",
      },
      checkout: {
        description: "Collect customer details, delivery, discounts, and payment.",
        title: "Grocery checkout",
      },
      welcome: {
        description: "Introduce grocery aisles, deals, and shopping options.",
        title: "Supermarket welcome",
      },
    },
  };

  return categoryDisplays[category]?.[moduleId];
}
