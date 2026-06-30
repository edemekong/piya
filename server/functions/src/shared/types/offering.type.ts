type OfferingType = "product" | "service" | "accommodation" | "delivery";
type OfferingSubType =
  | "physical"
  | "digital"
  | "appointment"
  | "online_appointment"
  | "event"
  | "delivery"
  | "room"
  | "unit";

type OfferingStatusType =
  | "draft"
  | "active"
  | "paused"
  | "disabled";

type OfferingFeatureType = "booking" | "delivery" | "inventory";
type OfferingAttributeValueType = "text" | "number" | "yes_no" | "date";
type OfferingCheckoutIntentType =
  | "buy"
  | "book"
  | "request_quote"
  | "create_delivery"
  | "reserve_room";

export {
  OfferingType,
  OfferingSubType,
  OfferingStatusType,
  OfferingAttributeValueType,
  OfferingFeatureType,
  OfferingCheckoutIntentType,
};
