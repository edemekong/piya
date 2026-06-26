import * as express from "express";
import { OptionalAuthMiddleware } from "../../middlewares/middleware";
import { AuthService } from "../../shared/services/auth.service";
import {
  asyncHandler,
  ErrorResult,
  SuccessResult,
} from "../../shared/utils/api-response";
import { ValidationsUtils } from "../../shared/utils/validations.utils";
import {
  API_RESPONSE,
  VERIFY_AUTH_OTP_REASON,
} from "../../shared/utils/constants";

export const verifyAuthOTPRoute = express.Router();

verifyAuthOTPRoute.post(
  "/verify-otp",
  OptionalAuthMiddleware,
  asyncHandler(async (req, res) => {
    const { phoneOrEmail, code, dialCode } = req.body;
    const newPhone =
      typeof phoneOrEmail === "string"
        ? ValidationsUtils.getValidPhoneNumber(phoneOrEmail, dialCode)
        : null;
    const isPhone = newPhone !== null;
    const isEmail = ValidationsUtils.isValidEmail(phoneOrEmail);

    if (!phoneOrEmail || (!isPhone && !isEmail)) {
      const error = API_RESPONSE.invalidAuthIdentifier;
      return ErrorResult(res, error.statusCode, error.message, error.code);
    }

    if (!code || code.length < 4) {
      const error = API_RESPONSE.invalidOTP;
      return ErrorResult(res, error.statusCode, error.message, error.code);
    }

    const result = await AuthService.verifyAuthOTP({
      phoneOrEmail: isPhone ? newPhone! : phoneOrEmail,
      code,
      isPhone,
      linkToUid: req.currentUser?.uid,
    });

    if (!result.verified) {
      const error =
        result.reason === VERIFY_AUTH_OTP_REASON.expired
          ? API_RESPONSE.otpExpired
          : result.reason === VERIFY_AUTH_OTP_REASON.phoneInUse
            ? API_RESPONSE.phoneAlreadyInUse
            : result.reason === VERIFY_AUTH_OTP_REASON.emailInUse
              ? API_RESPONSE.emailAlreadyInUse
              : API_RESPONSE.otpInvalid;
      return ErrorResult(res, error.statusCode, error.message, error.code);
    }

    const response = API_RESPONSE.authSuccessful;
    return SuccessResult(
      res,
      response.message,
      {
        authToken: result.authToken,
      },
      response.statusCode,
      response.code,
    );
  }),
);
