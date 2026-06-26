type BusinessStatusType = "verified" | "pending" | "suspended";
type MemberRoleType = "owner" | "manager";
type MemberPermissionType = "edit" | "view";

type BusinessCategoryTypes =
  | "laundry"
  | "fashion_tailoring"
  | "salon"
  | "barbershop"
  | "spa"
  | "beauty_studio"
  | "car_wash"
  | "logistics_delivery"
  | "restaurant"
  | "food_vendor"
  | "supermarket"
  | "farm_produce"
  | "fashion_store"
  | "electronics_store"
  | "photography"
  | "consulting"
  | "real_estate_agent"
  | "hotel_guesthouse"
  | "shortlet_apartment";

export type {
  BusinessStatusType,
  MemberRoleType,
  MemberPermissionType,
  BusinessCategoryTypes,
};
