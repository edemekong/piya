import { Router } from "express";
import {
  renderMemberInvitationEmail,
  renderOTPVerificationEmail,
} from "../../shared/email_templates/email-template-functions";

export const EmailPreviewRouter = Router();

EmailPreviewRouter.get("/otp", (req, res) => {
  const userName =
    typeof req.query.userName === "string" ? req.query.userName : "Paul";
  const otpCode = typeof req.query.code === "string" ? req.query.code : "123456";
  const expiresIn =
    typeof req.query.expiresIn === "string"
      ? Number(req.query.expiresIn)
      : undefined;

  res
    .type("html")
    .send(
      renderOTPVerificationEmail({
        userName,
        otpCode,
        expiresIn: Number.isFinite(expiresIn) ? expiresIn : undefined,
      }),
    );
});

EmailPreviewRouter.get("/member-invitation", (req, res) => {
  const businessName =
    typeof req.query.businessName === "string"
      ? req.query.businessName
      : "Piya Store";
  const role = typeof req.query.role === "string" ? req.query.role : "Admin";
  const acceptUrl =
    typeof req.query.acceptUrl === "string"
      ? req.query.acceptUrl
      : "https://dashboard.piya.store/auth?invitationTo=business_demo";
  const expiresInDays =
    typeof req.query.expiresInDays === "string"
      ? Number(req.query.expiresInDays)
      : 7;

  res
    .type("html")
    .send(
      renderMemberInvitationEmail({
        acceptUrl,
        businessName,
        expiresInDays: Number.isFinite(expiresInDays) ? expiresInDays : 7,
        role,
      }),
    );
});
