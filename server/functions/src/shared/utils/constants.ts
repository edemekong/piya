import type { OTPDeliveryChannel, OTPRequestType } from "../types/auth.type";

const STATUS_CODES = {
  ok: 200,
  created: 201,
  accepted: 202,
  noContent: 204,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
  gone: 410,
  unprocessableEntity: 422,
  tooManyRequests: 429,
  internalServerError: 500,
  badGateway: 502,
  serviceUnavailable: 503,
} as const;

const API_RESPONSE = {
  emailOTPSent: {
    statusCode: STATUS_CODES.ok,
    code: "EMAIL_OTP_SENT",
    message: "OTP sent",
  },
  phoneOTPSent: {
    statusCode: STATUS_CODES.ok,
    code: "PHONE_OTP_SENT",
    message: "OTP sent successfully",
  },
  authSuccessful: {
    statusCode: STATUS_CODES.ok,
    code: "AUTH_SUCCESSFUL",
    message: "Authentication Successful",
  },
  userCreated: {
    statusCode: STATUS_CODES.created,
    code: "USER_CREATED",
    message: "User created",
  },
  userFetched: {
    statusCode: STATUS_CODES.ok,
    code: "USER_FETCHED",
    message: "User fetched",
  },
  userUpdated: {
    statusCode: STATUS_CODES.ok,
    code: "USER_UPDATED",
    message: "User updated",
  },
  accountSetupUpdated: {
    statusCode: STATUS_CODES.ok,
    code: "ACCOUNT_SETUP_UPDATED",
    message: "Account setup updated",
  },
  accountSetupFetched: {
    statusCode: STATUS_CODES.ok,
    code: "ACCOUNT_SETUP_FETCHED",
    message: "Account setup fetched",
  },
  accountSetupCompleted: {
    statusCode: STATUS_CODES.ok,
    code: "ACCOUNT_SETUP_COMPLETED",
    message: "Account setup completed",
  },
  availabilityFetched: {
    statusCode: STATUS_CODES.ok,
    code: "AVAILABILITY_FETCHED",
    message: "Availability fetched",
  },
  availabilityUpdated: {
    statusCode: STATUS_CODES.ok,
    code: "AVAILABILITY_UPDATED",
    message: "Availability updated",
  },
  accountSetupIncomplete: {
    statusCode: STATUS_CODES.unprocessableEntity,
    code: "ACCOUNT_SETUP_INCOMPLETE",
    message: "Complete the required account setup fields first",
  },
  businessNotFound: {
    statusCode: STATUS_CODES.notFound,
    code: "BUSINESS_NOT_FOUND",
    message: "Business not found",
  },
  businessSlugUnavailable: {
    statusCode: STATUS_CODES.conflict,
    code: "BUSINESS_SLUG_UNAVAILABLE",
    message: "This Piya sub-domain is not available",
  },
  businessSlugAvailabilityChecked: {
    statusCode: STATUS_CODES.ok,
    code: "BUSINESS_SLUG_AVAILABILITY_CHECKED",
    message: "Piya sub-domain availability checked",
  },
  teamFetched: {
    statusCode: STATUS_CODES.ok,
    code: "TEAM_FETCHED",
    message: "Team fetched",
  },
  memberInvitationSent: {
    statusCode: STATUS_CODES.created,
    code: "MEMBER_INVITATION_SENT",
    message: "Invitation sent",
  },
  memberInvitationAccepted: {
    statusCode: STATUS_CODES.ok,
    code: "MEMBER_INVITATION_ACCEPTED",
    message: "Invitation accepted",
  },
  memberInvitationNotFound: {
    statusCode: STATUS_CODES.notFound,
    code: "MEMBER_INVITATION_NOT_FOUND",
    message: "No pending invitation was found for this email",
  },
  memberInvitationExpired: {
    statusCode: STATUS_CODES.gone,
    code: "MEMBER_INVITATION_EXPIRED",
    message: "This invitation has expired",
  },
  memberInvitationEmailFailed: {
    statusCode: STATUS_CODES.badGateway,
    code: "MEMBER_INVITATION_EMAIL_FAILED",
    message: "The invitation was saved, but the email could not be sent",
  },
  memberAlreadyExists: {
    statusCode: STATUS_CODES.conflict,
    code: "MEMBER_ALREADY_EXISTS",
    message: "This email already belongs to a team member",
  },
  memberUpdated: {
    statusCode: STATUS_CODES.ok,
    code: "MEMBER_UPDATED",
    message: "Team member updated",
  },
  memberDeleted: {
    statusCode: STATUS_CODES.ok,
    code: "MEMBER_DELETED",
    message: "Team member deleted",
  },
  memberInvitationDeleted: {
    statusCode: STATUS_CODES.ok,
    code: "MEMBER_INVITATION_DELETED",
    message: "Invitation deleted",
  },
  leadRequestCreated: {
    statusCode: STATUS_CODES.created,
    code: "LEAD_REQUEST_CREATED",
    message: "Lead request created",
  },
  whatsappWebhookVerified: {
    statusCode: STATUS_CODES.ok,
    code: "WHATSAPP_WEBHOOK_VERIFIED",
    message: "WhatsApp webhook verified",
  },
  whatsappWebhookRejected: {
    statusCode: STATUS_CODES.forbidden,
    code: "WHATSAPP_WEBHOOK_REJECTED",
    message: "WhatsApp webhook verification failed",
  },
  whatsappWebhookReceived: {
    statusCode: STATUS_CODES.ok,
    code: "WHATSAPP_WEBHOOK_RECEIVED",
    message: "WhatsApp webhook received",
  },
  whatsappConnectionFetched: {
    statusCode: STATUS_CODES.ok,
    code: "WHATSAPP_CONNECTION_FETCHED",
    message: "WhatsApp connection fetched",
  },
  whatsappConnectionCompleted: {
    statusCode: STATUS_CODES.ok,
    code: "WHATSAPP_CONNECTION_COMPLETED",
    message: "WhatsApp connection completed",
  },
  whatsappConnectionDisconnected: {
    statusCode: STATUS_CODES.ok,
    code: "WHATSAPP_CONNECTION_DISCONNECTED",
    message: "WhatsApp connection disconnected",
  },
  whatsappMessageSent: {
    statusCode: STATUS_CODES.ok,
    code: "WHATSAPP_MESSAGE_SENT",
    message: "WhatsApp message sent",
  },
  whatsappConnectionNotFound: {
    statusCode: STATUS_CODES.notFound,
    code: "WHATSAPP_CONNECTION_NOT_FOUND",
    message: "WhatsApp is not connected for this business",
  },
  whatsappConfigurationMissing: {
    statusCode: STATUS_CODES.serviceUnavailable,
    code: "WHATSAPP_CONFIGURATION_MISSING",
    message: "WhatsApp configuration is missing",
  },
  teamOwnerRequired: {
    statusCode: STATUS_CODES.forbidden,
    code: "TEAM_OWNER_REQUIRED",
    message: "Only the business owner can manage team roles and members",
  },
  teamInvitePermissionRequired: {
    statusCode: STATUS_CODES.forbidden,
    code: "TEAM_INVITE_PERMISSION_REQUIRED",
    message: "You do not have permission to invite team members",
  },
  riderAccountSetupUnavailable: {
    statusCode: STATUS_CODES.unprocessableEntity,
    code: "RIDER_ACCOUNT_SETUP_UNAVAILABLE",
    message: "Rider account setup is not available yet",
  },
  userNotFound: {
    statusCode: STATUS_CODES.notFound,
    code: "USER_NOT_FOUND",
    message: "User not found",
  },
  invalidRequest: {
    statusCode: STATUS_CODES.badRequest,
    code: "INVALID_REQUEST",
    message: "Invalid request data",
  },
  invalidEmail: {
    statusCode: STATUS_CODES.badRequest,
    code: "INVALID_EMAIL",
    message: "Email is required or invalid",
  },
  invalidOTPType: {
    statusCode: STATUS_CODES.badRequest,
    code: "INVALID_OTP_TYPE",
    message: "Type is required or invalid",
  },
  invalidPhone: {
    statusCode: STATUS_CODES.badRequest,
    code: "INVALID_PHONE",
    message: "Phone is required or invalid",
  },
  otpDeliveryFailed: {
    statusCode: STATUS_CODES.badGateway,
    code: "OTP_DELIVERY_FAILED",
    message: "Failed to send OTP. Please try again.",
  },
  invalidAuthIdentifier: {
    statusCode: STATUS_CODES.badRequest,
    code: "INVALID_AUTH_IDENTIFIER",
    message: "Phone or email is required or invalid",
  },
  invalidOTP: {
    statusCode: STATUS_CODES.badRequest,
    code: "INVALID_OTP",
    message: "OTP is required or is invalid",
  },
  otpExpired: {
    statusCode: STATUS_CODES.gone,
    code: "OTP_EXPIRED",
    message: "Expired OTP code",
  },
  otpInvalid: {
    statusCode: STATUS_CODES.unauthorized,
    code: "OTP_INVALID",
    message: "Invalid OTP code",
  },
  phoneAlreadyInUse: {
    statusCode: STATUS_CODES.conflict,
    code: "PHONE_ALREADY_IN_USE",
    message: "Phone number is already linked to another account",
  },
  emailAlreadyInUse: {
    statusCode: STATUS_CODES.conflict,
    code: "EMAIL_ALREADY_IN_USE",
    message: "Email is already linked to another account",
  },
  authTokenRequired: {
    statusCode: STATUS_CODES.unauthorized,
    code: "AUTH_TOKEN_REQUIRED",
    message: "A token is required",
  },
  unauthorized: {
    statusCode: STATUS_CODES.unauthorized,
    code: "UNAUTHORIZED",
    message: "You are not authorized to make this request!",
  },
  endpointNotFound: {
    statusCode: STATUS_CODES.notFound,
    code: "ENDPOINT_NOT_FOUND",
    message: "Endpoint Not Found",
  },
  rateLimited: {
    statusCode: STATUS_CODES.tooManyRequests,
    code: "RATE_LIMITED",
    message: "Too many requests from this IP, please try again later.",
  },
  serverError: {
    statusCode: STATUS_CODES.internalServerError,
    code: "SERVER_ERROR",
    message: "Server Error",
  },
} as const;

const OTP_AUTH_TYPE = "login-or-register";
const OTP_CODE_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 30;

const VERIFY_AUTH_OTP_REASON = {
  expired: "expired",
  invalid: "invalid",
  phoneInUse: "phone-in-use",
  emailInUse: "email-in-use",
} as const;

type VerifyAuthOTPReason =
  (typeof VERIFY_AUTH_OTP_REASON)[keyof typeof VERIFY_AUTH_OTP_REASON];

const OTP_REQUEST_TYPE_OPTIONS: OTPRequestType[] = ["sms", "whatsapp"];
const OTP_DELIVERY_CHANNELS: Record<OTPRequestType, OTPDeliveryChannel> = {
  sms: "generic",
  whatsapp: "whatsapp",
};

const TEST_EMAIL_SUFFIX = "@test.piya.store";

export {
  API_RESPONSE,
  OTP_AUTH_TYPE,
  OTP_CODE_LENGTH,
  OTP_EXPIRY_MINUTES,
  OTP_REQUEST_TYPE_OPTIONS,
  OTP_DELIVERY_CHANNELS,
  STATUS_CODES,
  VERIFY_AUTH_OTP_REASON,
  VerifyAuthOTPReason,
  TEST_EMAIL_SUFFIX,
};
