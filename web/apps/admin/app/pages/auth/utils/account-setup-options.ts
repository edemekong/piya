import type { BusinessCategoryTypes, BusinessSellingType } from "@piya/shared";

const businessCategories = [
  { label: "Select business category", value: "" },
  { label: "Laundry", value: "laundry" },
  { label: "Fashion tailoring", value: "fashion_tailoring" },
  { label: "Salon", value: "salon" },
  { label: "Barbershop", value: "barbershop" },
  { label: "Spa", value: "spa" },
  { label: "Beauty studio", value: "beauty_studio" },
  { label: "Car wash", value: "car_wash" },
  { label: "Logistics delivery", value: "logistics_delivery" },
  { label: "Restaurant", value: "restaurant" },
  { label: "Food vendor", value: "food_vendor" },
  { label: "Supermarket", value: "supermarket" },
  { label: "Farm produce", value: "farm_produce" },
  { label: "Fashion store", value: "fashion_store" },
  { label: "Electronics store", value: "electronics_store" },
  { label: "Photography", value: "photography" },
  { label: "Consulting", value: "consulting" },
  { label: "Real estate agent", value: "real_estate_agent" },
  { label: "Hotel guesthouse", value: "hotel_guesthouse" },
  { label: "Shortlet apartment", value: "shortlet_apartment" },
];

const productBusinessCategories: BusinessCategoryTypes[] = [
  "restaurant",
  "food_vendor",
  "supermarket",
  "farm_produce",
  "fashion_store",
  "electronics_store",
];

const deliveryIntegrationBusinessCategories: BusinessCategoryTypes[] = [
  "logistics_delivery",
  ...productBusinessCategories,
];

function getBusinessSellingTypes(
  category: BusinessCategoryTypes | null | undefined,
): BusinessSellingType[] {
  if (!category) return [];

  return productBusinessCategories.includes(category)
    ? ["products"]
    : ["services"];
}

function shouldShowAvailabilityIntegration(
  category: BusinessCategoryTypes | null | undefined,
) {
  return getBusinessSellingTypes(category).includes("services");
}

function shouldShowDeliveryIntegration(
  category: BusinessCategoryTypes | null | undefined,
) {
  return Boolean(
    category && deliveryIntegrationBusinessCategories.includes(category),
  );
}

const genderOptions = [
  { label: "Select gender", value: "" },
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

export {
  businessCategories,
  genderOptions,
  getBusinessSellingTypes,
  shouldShowAvailabilityIntegration,
  shouldShowDeliveryIntegration,
};
