type BusinessStatusType = "verified" | "pending" | "suspended";
type MemberRoleType = "owner" | "admin" | "manager";
type InvitableMemberRoleType = Exclude<MemberRoleType, "owner">;
type MemberPermissionType = "edit" | "view";
type MemberInvitationStatusType = "pending" | "accepted";
type BusinessSellingType = "products" | "services";

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

export {
  BusinessStatusType,
  InvitableMemberRoleType,
  MemberInvitationStatusType,
  MemberRoleType,
  MemberPermissionType,
  BusinessCategoryTypes,
  BusinessSellingType,
};
