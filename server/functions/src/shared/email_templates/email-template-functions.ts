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

export function renderMemberInvitationEmail(data: {
  acceptUrl: string;
  businessName: string;
  expiresInDays: number;
  role: string;
}): string {
  return renderTemplate("member-invitation", data);
}
