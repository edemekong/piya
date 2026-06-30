const COLLECTIONS = {
  auth_otp_codes: "auth_otp_codes",
  business: "business",
  leadRequests: "lead_requests",
  users: "users",
} as const;

const BUSINESS_SUBCOLLECTIONS = {
  availability: "availability",
  badges: "badges",
  branding: "branding",
  channelSettings: "channel_settings",
  contacts: "contacts",
  deliveryPricing: "delivery_pricing",
  discounts: "discounts",
  gifts: "gifts",
  memberInvitations: "member_invitations",
  members: "members",
  offerings: "offerings",
  tags: "tags",
} as const;

export { BUSINESS_SUBCOLLECTIONS, COLLECTIONS };
