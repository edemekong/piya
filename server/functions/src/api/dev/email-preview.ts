import { Router } from "express";
import { renderOTPVerificationEmail } from "../../shared/email_templates/email-template-functions";

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
