import type { BusinessCategoryTypes } from "@piya/shared";

type OfferingTableColumn =
  | "category"
  | "duration"
  | "price"
  | "status"
  | "stock";

type OfferingDisplayConfig = {
  categoryColumnLabel: string;
  createLabel: string;
  createTitle: string;
  description: string;
  editActionLabel: string;
  editTitle: string;
  filterLabel: string;
  namePlaceholder: string;
  plural: string;
  searchPlaceholder: string;
  singular: string;
  tableColumns: OfferingTableColumn[];
};

const defaultConfig: OfferingDisplayConfig = {
  categoryColumnLabel: "Category",
  createLabel: "Create item",
  createTitle: "Create item",
  description: "Create, view, and manage catalog items from one place.",
  editActionLabel: "Edit item",
  editTitle: "Edit item",
  filterLabel: "Filter items",
  namePlaceholder: "Enter item name",
  plural: "Catalog",
  searchPlaceholder: "Search items",
  singular: "Item",
  tableColumns: ["category", "price", "status"],
};

const productColumns: OfferingTableColumn[] = [
  "category",
  "price",
  "stock",
  "status",
];
const serviceColumns: OfferingTableColumn[] = [
  "category",
  "duration",
  "price",
  "status",
];

const configsByBusinessCategory: Record<
  BusinessCategoryTypes,
  OfferingDisplayConfig
> = {
  barbershop: serviceConfig("Services", "service"),
  beauty_studio: serviceConfig("Services", "service"),
  car_wash: serviceConfig("Services", "service"),
  consulting: {
    ...serviceConfig("Sessions", "session"),
    categoryColumnLabel: "Session type",
  },
  electronics_store: productConfig("Products", "product"),
  farm_produce: productConfig("Produce", "produce item"),
  fashion_store: productConfig("Products", "product"),
  fashion_tailoring: serviceConfig("Services", "service"),
  food_vendor: productConfig("Food items", "food item"),
  hotel_guesthouse: {
    ...productConfig("Rooms", "room"),
    categoryColumnLabel: "Room type",
    tableColumns: ["category", "price", "status"],
  },
  laundry: serviceConfig("Services", "service"),
  logistics_delivery: {
    ...serviceConfig("Delivery services", "delivery service"),
    categoryColumnLabel: "Service type",
    tableColumns: ["category", "price", "status"],
  },
  photography: {
    ...serviceConfig("Packages", "package"),
    categoryColumnLabel: "Package type",
  },
  real_estate_agent: {
    ...productConfig("Listings", "listing"),
    categoryColumnLabel: "Listing type",
    tableColumns: ["category", "price", "status"],
  },
  restaurant: productConfig("Menu items", "menu item"),
  salon: serviceConfig("Services", "service"),
  shortlet_apartment: {
    ...productConfig("Apartments", "apartment"),
    categoryColumnLabel: "Apartment type",
    tableColumns: ["category", "price", "status"],
  },
  spa: {
    ...serviceConfig("Treatments", "treatment"),
    categoryColumnLabel: "Treatment type",
  },
  supermarket: productConfig("Products", "product"),
};

function getOfferingDisplayConfig(
  businessCategory?: BusinessCategoryTypes | null,
) {
  return businessCategory
    ? (configsByBusinessCategory[businessCategory] ?? defaultConfig)
    : defaultConfig;
}

function productConfig(
  plural: string,
  singular: string,
): OfferingDisplayConfig {
  return {
    categoryColumnLabel: "Category",
    createLabel: `Create ${singular}`,
    createTitle: `Create ${singular}`,
    description: `Create, view, and manage ${plural.toLowerCase()} from one place.`,
    editActionLabel: `Edit ${singular}`,
    editTitle: `Edit ${singular}`,
    filterLabel: `Filter ${plural.toLowerCase()}`,
    namePlaceholder: `Enter ${singular} name`,
    plural,
    searchPlaceholder: `Search ${plural.toLowerCase()}`,
    singular: titleCase(singular),
    tableColumns: productColumns,
  };
}

function serviceConfig(
  plural: string,
  singular: string,
): OfferingDisplayConfig {
  return {
    categoryColumnLabel: "Service type",
    createLabel: `Create ${singular}`,
    createTitle: `Create ${singular}`,
    description: `Create, view, and manage ${plural.toLowerCase()} from one place.`,
    editActionLabel: `Edit ${singular}`,
    editTitle: `Edit ${singular}`,
    filterLabel: `Filter ${plural.toLowerCase()}`,
    namePlaceholder: `Enter ${singular} name`,
    plural,
    searchPlaceholder: `Search ${plural.toLowerCase()}`,
    singular: titleCase(singular),
    tableColumns: serviceColumns,
  };
}

function titleCase(value: string) {
  return value
    .split(" ")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

export {
  getOfferingDisplayConfig,
  type OfferingDisplayConfig,
  type OfferingTableColumn,
};
