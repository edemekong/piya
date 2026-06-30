type OfferingType = "product" | "service";
type OfferingSubType =
  | "consultation"
  | "consultation_online"
  | "event"
  | "event_online"
  | "digital_service"
  | "physical"
  | "digital";

type OfferingStatusType =
  | "draft"
  | "active"
  | "paused"
  | "disabled";

type OfferingFeatureType = "booking" | "delivery";
type OfferingCheckoutIntentType =
  | "buy"
  | "book"
  | "request_quote"
  | "reserve_room";

export type {
  OfferingType,
  OfferingSubType,
  OfferingStatusType,
  OfferingFeatureType,
  OfferingCheckoutIntentType,
};
