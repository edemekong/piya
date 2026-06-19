import { renderTemplate } from "./template-functions";

export function renderOTPVerificationEmail(data: {
  userName: string;
  otpCode: string;
  expiresIn?: number;
}): string {
  return renderTemplate("otp-verification", {
    ...data,
    expiresIn: data.expiresIn || 30,
  });
}
