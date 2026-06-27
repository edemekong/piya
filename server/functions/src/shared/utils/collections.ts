const COLLECTIONS = {
  auth_otp_codes: "auth_otp_codes",
  business: "business",
  users: "users",
} as const;

const BUSINESS_SUBCOLLECTIONS = {
  branding: "branding",
  members: "members",
} as const;

export { BUSINESS_SUBCOLLECTIONS, COLLECTIONS };
