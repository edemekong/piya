export type VerifyAuthOTPReason =
  | "expired"
  | "invalid"
  | "phone-in-use"
  | "email-in-use";

export type OTPDeliveryChannel = "generic" | "whatsapp";

export type SendSMSParams = {
  to: string;
  message: string;
  channel?: "generic" | "dnd" | Exclude<OTPDeliveryChannel, "generic">;
};

export type SendSMSResponse = {
  success: boolean;
  messageId?: string;
  error?: string;
};

export type OTPRequestType = "sms" | "whatsapp";

export type RequestEmailOTPParams = {
  email: string;
};

export type RequestPhoneOTPParams = {
  phone: string;
  type: OTPRequestType;
};

export type RequestOTPResult = {
  sent: boolean;
  error?: string;
};

export type VerifyAuthOTPParams = {
  phoneOrEmail: string;
  code: string;
  isPhone: boolean;
  linkToUid?: string;
};

export type VerifyAuthOTPResult = {
  verified: boolean;
  authToken?: string;
  reason?: VerifyAuthOTPReason;
};
