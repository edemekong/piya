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
  accountSetupCompleted: {
    statusCode: STATUS_CODES.ok,
    code: "ACCOUNT_SETUP_COMPLETED",
    message: "Account setup completed",
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

const ZOLT_TEST_EMAIL_SUFFIX = "@test.1bee.online.com";

export {
  API_RESPONSE,
  OTP_AUTH_TYPE,
  OTP_EXPIRY_MINUTES,
  OTP_REQUEST_TYPE_OPTIONS,
  OTP_DELIVERY_CHANNELS,
  STATUS_CODES,
  VERIFY_AUTH_OTP_REASON,
  VerifyAuthOTPReason,
  ZOLT_TEST_EMAIL_SUFFIX,
};
