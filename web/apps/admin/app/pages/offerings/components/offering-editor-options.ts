import type {
  BusinessCategoryTypes,
  OfferingFormDraft,
  OfferingAttributeValueType,
  OfferingFeatureType,
  OfferingSubType,
  OfferingType,
} from "@piya/shared/types";
import type { CheckoutPaymentMode } from "@piya/shared";
import {
  getDefaultCheckoutIntents,
  getDefaultPaymentModes,
} from "@piya/shared/utils";

type OfferingEditorStep =
  | "basics"
  | "details"
  | "configuration"
  | "checkout"
  | "media";
type OfferingTypeOption = { label: string; value: OfferingType };
type OfferingCategoryOption = { label: string; value: OfferingSubType };
type PaymentModeOption = { label: string; value: CheckoutPaymentMode };
type ProductCategoryOption = { id: string; label: string };
type OfferingAttributePreset = {
  label: string;
  name: string;
  unit?: string;
  valueType: OfferingAttributeValueType;
  values?: string[];
};
type OfferingOptionPreset = {
  label: string;
  name: string;
  values: string[];
};
type OfferingVariantPreset = {
  label: string;
  title: string;
};
type ProductPresetContext = {
  businessCategory: BusinessCategoryTypes | null;
  categoryId: string;
  subType: OfferingSubType | "";
  type: OfferingType | "";
};
type ProductBusinessCategory = Extract<
  BusinessCategoryTypes,
  | "electronics_store"
  | "farm_produce"
  | "fashion_store"
  | "food_vendor"
  | "restaurant"
  | "supermarket"
>;

const offeringEditorSteps: { key: OfferingEditorStep; label: string }[] = [
  { key: "basics", label: "Basics" },
  { key: "details", label: "Details" },
  { key: "configuration", label: "Configure" },
  { key: "media", label: "Media" },
  { key: "checkout", label: "Checkout" },
];

function getOfferingEditorSteps(type: OfferingType | "") {
  if (type === "product") return offeringEditorSteps;

  return offeringEditorSteps.filter((step) => step.key !== "configuration");
}

type TaggableOfferingType = Extract<OfferingType, "product" | "service">;

const predefinedTagsByType: Record<TaggableOfferingType, string[]> = {
  product: [
    "starter",
    "bundle",
    "digital",
    "skin-care",
    "featured",
    "seasonal",
  ],
  service: [
    "appointment",
    "virtual",
    "event",
    "training",
    "featured",
    "seasonal",
  ],
};

const maxOfferingTags = 5;

const currencies = [
  { code: "NGN", label: "Naira" },
  { code: "USD", label: "Dollar" },
  { code: "GHS", label: "Ghana cedi" },
  { code: "KES", label: "Kenya shilling" },
  { code: "ZAR", label: "South African rand" },
];

const countryOptions = [
  { country: "Nigeria", currency: "NGN", flag: "🇳🇬" },
  { country: "United States", currency: "USD", flag: "🇺🇸" },
  { country: "Ghana", currency: "GHS", flag: "🇬🇭" },
  { country: "Kenya", currency: "KES", flag: "🇰🇪" },
  { country: "South Africa", currency: "ZAR", flag: "🇿🇦" },
];

const productCategoryOptions: ProductCategoryOption[] = [
  { id: "apparel_accessories", label: "Apparel and accessories" },
  { id: "beauty_personal_care", label: "Beauty and personal care" },
  { id: "books_stationery", label: "Books and stationery" },
  { id: "digital_products", label: "Digital products" },
  { id: "electronics", label: "Electronics" },
  { id: "farm_produce", label: "Farm produce" },
  { id: "food_beverages", label: "Food and beverages" },
  { id: "gifts_bundles", label: "Gifts and bundles" },
  { id: "groceries", label: "Groceries" },
  { id: "health_wellness", label: "Health and wellness" },
  { id: "home_living", label: "Home and living" },
  { id: "other", label: "Other" },
];

const productCategoryOptionsByBusinessCategory: Record<
  ProductBusinessCategory,
  ProductCategoryOption[]
> = {
  electronics_store: [{ id: "electronics", label: "Electronics" }],
  farm_produce: [{ id: "farm_produce", label: "Farm produce" }],
  fashion_store: [
    { id: "apparel_accessories", label: "Apparel and accessories" },
  ],
  food_vendor: [{ id: "food_beverages", label: "Food and beverages" }],
  restaurant: [{ id: "food_beverages", label: "Food and beverages" }],
  supermarket: [{ id: "groceries", label: "Groceries" }],
};

const paymentModeOptions: PaymentModeOption[] = [
  { label: "Pay now", value: "pay_now" },
  { label: "Pay later", value: "pay_later" },
];

const attributeUnitOptions = [
  { label: "Pieces", value: "pcs" },
  { label: "Pack", value: "pack" },
  { label: "Box", value: "box" },
  { label: "Pair", value: "pair" },
  { label: "Set", value: "set" },
  { label: "Kilogram", value: "kg" },
  { label: "Gram", value: "g" },
  { label: "Litre", value: "l" },
  { label: "Millilitre", value: "ml" },
  { label: "Metre", value: "m" },
  { label: "Centimetre", value: "cm" },
  { label: "Inch", value: "in" },
  { label: "Foot", value: "ft" },
  { label: "Hour", value: "hr" },
  { label: "Minute", value: "min" },
  { label: "Day", value: "day" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];

const attributePresets: OfferingAttributePreset[] = [
  {
    label: "Color",
    name: "Color",
    valueType: "text",
    values: ["Black", "White", "Blue", "Red", "Green", "Gold", "Silver"],
  },
  {
    label: "Material",
    name: "Material",
    valueType: "text",
    values: ["Cotton", "Leather", "Plastic", "Metal", "Glass", "Wood"],
  },
  {
    label: "Weight",
    name: "Weight",
    unit: "kg",
    valueType: "number",
  },
  {
    label: "Volume",
    name: "Volume",
    unit: "ml",
    valueType: "number",
  },
  {
    label: "Brand",
    name: "Brand",
    valueType: "text",
  },
  {
    label: "Made locally",
    name: "Made locally",
    valueType: "yes_no",
    values: ["Yes", "No"],
  },
  {
    label: "Expiry date",
    name: "Expiry date",
    valueType: "date",
  },
];

const optionPresets: OfferingOptionPreset[] = [
  { label: "Size", name: "Size", values: ["Small", "Medium", "Large"] },
  { label: "Color", name: "Color", values: ["Black", "White", "Blue"] },
  { label: "Style", name: "Style", values: ["Classic", "Premium"] },
  { label: "Pack size", name: "Pack size", values: ["Single", "Pack of 3"] },
  { label: "Flavor", name: "Flavor", values: ["Original", "Spicy"] },
  { label: "Storage", name: "Storage", values: ["64GB", "128GB", "256GB"] },
];

const variantPresets: OfferingVariantPreset[] = [
  { label: "Default variant", title: "Default" },
  { label: "Color / Size", title: "Black / Medium" },
  { label: "Pack size", title: "Pack of 3" },
  { label: "Premium version", title: "Premium" },
];

type ProductPresetCategory =
  | "apparel_accessories"
  | "beauty_personal_care"
  | "digital_products"
  | "electronics"
  | "farm_produce"
  | "food_beverages"
  | "groceries"
  | "home_living"
  | "other";

const productPresetCategoryByBusinessCategory: Partial<
  Record<BusinessCategoryTypes, ProductPresetCategory>
> = {
  electronics_store: "electronics",
  farm_produce: "farm_produce",
  fashion_store: "apparel_accessories",
  food_vendor: "food_beverages",
  restaurant: "food_beverages",
  supermarket: "groceries",
};

const productPresetCategoryIds = new Set<ProductPresetCategory>([
  "apparel_accessories",
  "beauty_personal_care",
  "digital_products",
  "electronics",
  "farm_produce",
  "food_beverages",
  "groceries",
  "home_living",
  "other",
]);

const attributePresetNamesByProductCategory: Record<
  ProductPresetCategory,
  string[]
> = {
  apparel_accessories: ["Color", "Material", "Brand", "Made locally"],
  beauty_personal_care: [
    "Color",
    "Volume",
    "Brand",
    "Made locally",
    "Expiry date",
  ],
  digital_products: ["Brand"],
  electronics: ["Brand", "Color", "Weight"],
  farm_produce: ["Weight", "Made locally", "Expiry date"],
  food_beverages: ["Weight", "Volume", "Made locally", "Expiry date"],
  groceries: ["Weight", "Volume", "Brand", "Made locally", "Expiry date"],
  home_living: ["Color", "Material", "Brand", "Weight"],
  other: ["Color", "Material", "Weight", "Brand", "Made locally"],
};

const attributeUnitValuesByProductCategory: Record<
  ProductPresetCategory,
  string[]
> = {
  apparel_accessories: ["pcs", "pair", "set", "cm", "in"],
  beauty_personal_care: ["pcs", "pack", "set", "g", "ml", "l"],
  digital_products: ["pcs"],
  electronics: ["pcs", "set", "kg", "g", "cm", "in"],
  farm_produce: ["kg", "g", "pack", "box"],
  food_beverages: ["pcs", "pack", "box", "kg", "g", "l", "ml"],
  groceries: ["pcs", "pack", "box", "kg", "g", "l", "ml"],
  home_living: ["pcs", "set", "kg", "g", "m", "cm", "in", "ft"],
  other: ["pcs", "pack", "box", "pair", "set", "kg", "g"],
};

const optionPresetNamesByProductCategory: Record<
  ProductPresetCategory,
  string[]
> = {
  apparel_accessories: ["Size", "Color", "Style"],
  beauty_personal_care: ["Pack size", "Style"],
  digital_products: ["Style"],
  electronics: ["Storage", "Color", "Style"],
  farm_produce: ["Pack size"],
  food_beverages: ["Flavor", "Pack size"],
  groceries: ["Pack size", "Flavor"],
  home_living: ["Size", "Color", "Style"],
  other: ["Size", "Color", "Style", "Pack size"],
};

const variantPresetTitlesByProductCategory: Record<
  ProductPresetCategory,
  string[]
> = {
  apparel_accessories: ["Default", "Black / Medium", "Premium"],
  beauty_personal_care: ["Default", "Pack of 3", "Premium"],
  digital_products: ["Default", "Premium"],
  electronics: ["Default", "Premium"],
  farm_produce: ["Default", "Pack of 3"],
  food_beverages: ["Default", "Pack of 3", "Premium"],
  groceries: ["Default", "Pack of 3"],
  home_living: ["Default", "Black / Medium", "Premium"],
  other: ["Default", "Black / Medium", "Pack of 3", "Premium"],
};

function isProductBusinessCategory(
  businessCategory: BusinessCategoryTypes | null,
): businessCategory is ProductBusinessCategory {
  return Boolean(
    businessCategory &&
      businessCategory in productCategoryOptionsByBusinessCategory,
  );
}

function getOfferingTypeOptions(
  businessCategory: BusinessCategoryTypes | null,
): OfferingTypeOption[] {
  if (isProductBusinessCategory(businessCategory)) {
    return [{ label: "Product", value: "product" }];
  }

  return [{ label: "Service", value: "service" }];
}

function getProductCategoryOptions(
  businessCategory: BusinessCategoryTypes | null,
): ProductCategoryOption[] {
  if (isProductBusinessCategory(businessCategory)) {
    return productCategoryOptionsByBusinessCategory[businessCategory];
  }

  return productCategoryOptions;
}

function getProductAttributePresets(
  context: ProductPresetContext,
): OfferingAttributePreset[] {
  const category = getProductPresetCategory(context);
  const presetNames = new Set(attributePresetNamesByProductCategory[category]);

  return attributePresets.filter((preset) => presetNames.has(preset.name));
}

function getProductAttributeUnitOptions(context: ProductPresetContext) {
  const category = getProductPresetCategory(context);
  const unitValues = new Set(attributeUnitValuesByProductCategory[category]);

  return attributeUnitOptions.filter((option) => unitValues.has(option.value));
}

function getProductOptionPresets(
  context: ProductPresetContext,
): OfferingOptionPreset[] {
  const category = getProductPresetCategory(context);
  const presetNames = new Set(optionPresetNamesByProductCategory[category]);

  return optionPresets.filter((preset) => presetNames.has(preset.name));
}

function getProductVariantPresets(
  context: ProductPresetContext,
): OfferingVariantPreset[] {
  const category = getProductPresetCategory(context);
  const presetTitles = new Set(variantPresetTitlesByProductCategory[category]);

  return variantPresets.filter((preset) => presetTitles.has(preset.title));
}

function shouldShowProductStock(context: ProductPresetContext) {
  if (context.type !== "product") return false;
  if (context.subType === "digital") return false;

  return getProductPresetCategory(context) !== "digital_products";
}

function getProductPresetCategory(
  context: ProductPresetContext,
): ProductPresetCategory {
  if (context.subType === "digital") return "digital_products";

  if (productPresetCategoryIds.has(context.categoryId as ProductPresetCategory)) {
    return context.categoryId as ProductPresetCategory;
  }

  if (context.businessCategory) {
    return productPresetCategoryByBusinessCategory[context.businessCategory] ??
      "other";
  }

  return "other";
}

function getOfferingTypeDraftUpdates(
  type: OfferingType | "",
): Partial<OfferingFormDraft> {
  return {
    attributes: [],
    categoryId: "",
    categoryName: "",
    duration: "",
    features: getDefaultOfferingFeatures(type, null),
    imageUrl: "",
    imageUrls: "",
    inventoryAllowBackorders: false,
    inventoryQuantity: "",
    inventorySku: "",
    inventoryTrackQuantity: false,
    options: [],
    checkoutIntents: getDefaultCheckoutIntents(type),
    locationAddress: "",
    locationCity: "",
    locationCountry: "",
    locationPostalCode: "",
    locationState: "",
    maxQuantity: "",
    meetingLink: "",
    minQuantity: "",
    paymentModes: getDefaultPaymentModes(),
    depositAmount: "",
    depositPercent: "",
    requiresBusinessConfirmation: false,
    subType: "",
    type,
    variants: [],
  };
}

function getDefaultOfferingFeatures(
  type: OfferingType | "",
  businessCategory: BusinessCategoryTypes | null,
): OfferingFeatureType[] {
  if (type === "product") {
    const features: OfferingFeatureType[] = ["inventory"];

    if (isProductBusinessCategory(businessCategory)) {
      features.push("delivery");
    }

    return features;
  }

  if (type === "service") {
    const features: OfferingFeatureType[] = ["booking"];

    if (
      businessCategory &&
      ["logistics_delivery", "laundry", "fashion_tailoring"].includes(
        businessCategory,
      )
    ) {
      features.push("delivery");
    }

    return features;
  }

  if (type === "delivery") return ["delivery"];
  if (type === "accommodation") return ["booking"];

  return [];
}

function getOfferingCategoryOptions(
  type: OfferingType,
  businessCategory: BusinessCategoryTypes | null,
): OfferingCategoryOption[] {
  if (type === "product") {
    if (isProductBusinessCategory(businessCategory)) {
      return [{ label: "Physical product", value: "physical" }];
    }

    return [
      { label: "Physical product", value: "physical" },
      { label: "Digital product", value: "digital" },
    ];
  }

  if (businessCategory === "consulting") {
    return [{ label: "Online appointment", value: "online_appointment" }];
  }

  if (businessCategory === "photography") {
    return [
      { label: "Photo session", value: "appointment" },
      { label: "Event coverage", value: "event" },
    ];
  }

  if (
    businessCategory &&
    ["barbershop", "salon", "spa", "beauty_studio", "car_wash"].includes(
      businessCategory,
    )
  ) {
    return [{ label: "Appointment service", value: "appointment" }];
  }

  if (
    businessCategory &&
    ["fashion_tailoring", "laundry", "real_estate_agent"].includes(
      businessCategory,
    )
  ) {
    return [{ label: "Appointment service", value: "appointment" }];
  }

  return [
    { label: "Appointment service", value: "appointment" },
    { label: "Online service", value: "online_appointment" },
    { label: "Event", value: "event" },
  ];
}

function shouldShowServiceLocationFields(subType: OfferingSubType | "") {
  return subType === "event";
}

export {
  countryOptions,
  currencies,
  attributePresets,
  attributeUnitOptions,
  getDefaultOfferingFeatures,
  getOfferingEditorSteps,
  getOfferingCategoryOptions,
  getOfferingTypeDraftUpdates,
  getOfferingTypeOptions,
  getProductAttributePresets,
  getProductAttributeUnitOptions,
  getProductCategoryOptions,
  getProductOptionPresets,
  getProductVariantPresets,
  maxOfferingTags,
  offeringEditorSteps,
  optionPresets,
  paymentModeOptions,
  predefinedTagsByType,
  shouldShowProductStock,
  variantPresets,
  productCategoryOptions,
  shouldShowServiceLocationFields,
  type OfferingAttributePreset,
  type OfferingCategoryOption,
  type OfferingEditorStep,
  type OfferingOptionPreset,
  type PaymentModeOption,
  type ProductCategoryOption,
  type ProductPresetContext,
  type OfferingVariantPreset,
  type TaggableOfferingType,
  type OfferingTypeOption,
};
