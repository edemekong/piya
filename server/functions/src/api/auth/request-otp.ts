import * as express from "express";
import { AuthService } from "../../shared/services/auth.service";
import {
  asyncHandler,
  ErrorResult,
  SuccessResult,
} from "../../shared/utils/api-response";
import { API_RESPONSE } from "../../shared/utils/constants";
import { isValidOTPRequestType } from "../../shared/utils/helpers/helper-functions";
import { ValidationsUtils } from "../../shared/utils/validations.utils";

export const requestOTPRoute = express.Router();

requestOTPRoute.post(
  "/request-otp",
  asyncHandler(async (req, res) => {
    const phoneOrEmail =
      req.body.phoneOrEmail ??
      req.body.email ??
      req.body.phone ??
      req.query.phoneOrEmail ??
      req.query.email ??
      req.query.phone;
    const dialCode = req.body.dialCode ?? req.query.dialCode;
    const type = req.body.type ?? req.query.type ?? "sms";

    const isEmail =
      typeof phoneOrEmail === "string" &&
      ValidationsUtils.isValidEmail(phoneOrEmail);
    const normalizedPhone =
      typeof phoneOrEmail === "string"
        ? ValidationsUtils.getValidPhoneNumber(
            phoneOrEmail,
            String(dialCode ?? ""),
          )
        : null;
    const isPhone =
      typeof phoneOrEmail === "string" && normalizedPhone !== null;

    if (!phoneOrEmail || (!isEmail && !isPhone)) {
      const error = API_RESPONSE.invalidAuthIdentifier;
      return ErrorResult(res, error.statusCode, error.message, error.code);
    }

    if (isEmail) {
      await AuthService.requestEmailOTP({ email: phoneOrEmail });

      const response = API_RESPONSE.emailOTPSent;
      return SuccessResult(
        res,
        response.message,
        undefined,
        response.statusCode,
        response.code,
      );
    }

    if (!isValidOTPRequestType(type)) {
      const error = API_RESPONSE.invalidOTPType;
      return ErrorResult(res, error.statusCode, error.message, error.code);
    }

    const result = await AuthService.requestPhoneOTP({
      phone: normalizedPhone!,
      type,
    });

    if (!result.sent) {
      console.error("Failed to send OTP:", result.error);

      const error = API_RESPONSE.otpDeliveryFailed;
      return ErrorResult(res, error.statusCode, error.message, error.code);
    }

    const response = API_RESPONSE.phoneOTPSent;
    return SuccessResult(
      res,
      response.message,
      undefined,
      response.statusCode,
      response.code,
    );
  }),
);
