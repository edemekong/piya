type BusinessDomainFamily =
  | "product_business"
  | "appointment_business"
  | "logistics_business"
  | "custom_work_business"
  | "hospitality_business";

type StorefrontPresetId =
  | "product_catalog"
  | "appointment_services"
  | "logistics_delivery"
  | "custom_work"
  | "hospitality_booking";

type StorefrontConfigStatus = "draft" | "published" | "disabled";

type StorefrontNodeType =
  | "business_profile"
  | "hero"
  | "product_catalog"
  | "product_detail"
  | "service_catalog"
  | "service_detail"
  | "availability_calendar"
  | "booking_form"
  | "cart"
  | "checkout"
  | "delivery_order_form"
  | "pickup_form"
  | "quote_request_form"
  | "room_catalog"
  | "room_detail"
  | "room_reservation_form"
  | "contact_form"
  | "location_map"
  | "reviews"
  | "loyalty";

type StorefrontNodeActionType =
  | "view"
  | "select"
  | "add_to_cart"
  | "book"
  | "request_quote"
  | "create_delivery"
  | "reserve_room"
  | "contact"
  | "checkout";

type CheckoutIntentType =
  | "buy"
  | "book"
  | "request_quote"
  | "create_delivery"
  | "reserve_room"
  | "contact_business";

type CheckoutPaymentMode =
  | "none"
  | "pay_now"
  | "pay_later"
  | "deposit"
  | "business_confirms_first";

type StorefrontRequirementType =
  | "customer"
  | "offering"
  | "cart"
  | "availability"
  | "fulfillment"
  | "delivery_details"
  | "package_details"
  | "quote_details"
  | "room_dates"
  | "guest_details"
  | "payment";

type StorefrontCreateType =
  | "order"
  | "booking"
  | "delivery"
  | "lead_request"
  | "payment"
  | "reservation";

type StorefrontCreateRelation = "primary" | "child" | "linked";

type StorefrontSetupRequirementType =
  | "business_profile"
  | "branding"
  | "contact_details"
  | "offering"
  | "availability"
  | "delivery_pricing"
  | "pickup_location"
  | "quote_form"
  | "accommodation_unit"
  | "accommodation_availability"
  | "payment_settings";

export type {
  BusinessDomainFamily,
  CheckoutIntentType,
  CheckoutPaymentMode,
  StorefrontConfigStatus,
  StorefrontCreateRelation,
  StorefrontCreateType,
  StorefrontNodeActionType,
  StorefrontNodeType,
  StorefrontPresetId,
  StorefrontRequirementType,
  StorefrontSetupRequirementType,
};
