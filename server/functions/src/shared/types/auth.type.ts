import type { VerifyAuthOTPReason } from "../utils/constants";

type OTPDeliveryChannel = "generic" | "whatsapp";

type SendSMSParams = {
  to: string;
  message: string;
  channel?: "generic" | "dnd" | Omit<OTPDeliveryChannel, "generic">;
};

type SendSMSResponse = {
  success: boolean;
  messageId?: string;
  error?: string;
};

type OTPRequestType = "sms" | "whatsapp";

type RequestEmailOTPParams = {
  email: string;
};

type RequestPhoneOTPParams = {
  phone: string;
  type: OTPRequestType;
};

type RequestOTPResult = {
  sent: boolean;
  error?: string;
};

type VerifyAuthOTPParams = {
  phoneOrEmail: string;
  code: string;
  isPhone: boolean;
  linkToUid?: string;
};

type VerifyAuthOTPResult = {
  verified: boolean;
  authToken?: string;
  reason?: VerifyAuthOTPReason;
};

export {
  OTPDeliveryChannel,
  OTPRequestType,
  RequestEmailOTPParams,
  RequestOTPResult,
  RequestPhoneOTPParams,
  SendSMSParams,
  SendSMSResponse,
  VerifyAuthOTPParams,
  VerifyAuthOTPResult,
};
