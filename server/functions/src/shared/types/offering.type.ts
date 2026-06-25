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

export {
  OfferingType,
  OfferingSubType,
  OfferingStatusType,
  OfferingFeatureType,
};
