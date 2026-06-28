const COLLECTIONS = {
  auth_otp_codes: "auth_otp_codes",
  business: "business",
  leadRequests: "lead_requests",
  users: "users",
} as const;

const BUSINESS_SUBCOLLECTIONS = {
  availability: "availability",
  branding: "branding",
  channelSettings: "channel_settings",
  memberInvitations: "member_invitations",
  members: "members",
} as const;

export { BUSINESS_SUBCOLLECTIONS, COLLECTIONS };
