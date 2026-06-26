import { auth, db } from "../../configs/firebase";
import { finalConfiguration } from "../../configs/configurations";
import { renderOTPVerificationEmail } from "../email_templates/email-template-functions";

import { sendEmailTo } from "../utils/helpers/email-notifications";
import {
  generateOTPCode,
  getValidEmail,
  getOTPExpiryTime,
  getUTCTimeNow,
  hashOTP,
} from "../utils/helpers/helper-functions";
import { sendOTP } from "../utils/helpers/sms";
import {
  RequestEmailOTPParams,
  RequestOTPResult,
  RequestPhoneOTPParams,
  VerifyAuthOTPParams,
  VerifyAuthOTPResult,
} from "../types/auth.type";
import { COLLECTIONS } from "../utils/collections";
import {
  OTP_AUTH_TYPE,
  OTP_CODE_LENGTH,
  OTP_DELIVERY_CHANNELS,
  OTP_EXPIRY_MINUTES,
  VERIFY_AUTH_OTP_REASON,
  TEST_EMAIL_SUFFIX,
} from "../utils/constants";

export class AuthService {
  private static isFirebaseUserNotFound(error: unknown): boolean {
    return (error as { code?: unknown })?.code === "auth/user-not-found";
  }

  static async requestEmailOTP(
    params: RequestEmailOTPParams,
  ): Promise<RequestOTPResult> {
    const email = getValidEmail(params.email);
    let userRecord;

    try {
      userRecord = await auth().getUserByEmail(email);
    } catch (error) {
      if (!AuthService.isFirebaseUserNotFound(error)) {
        console.warn(error);
      }
    }

    if (email.endsWith(TEST_EMAIL_SUFFIX)) {
      return { sent: true };
    }

    const { RESEND_API_KEY } = finalConfiguration();
    const isFunctionsEmulator = process.env.FUNCTIONS_EMULATOR === "true";
    const shouldSendEmail =
      !isFunctionsEmulator || Boolean(RESEND_API_KEY?.trim());
    const otpCode = shouldSendEmail
      ? generateOTPCode()
      : "0".repeat(OTP_CODE_LENGTH);
    const uid = userRecord?.uid ?? email;

    await db()
      .collection(COLLECTIONS.auth_otp_codes)
      .doc(email)
      .set({
        email,
        codeHash: hashOTP(uid, email, otpCode),
        expiresAt: getOTPExpiryTime(),
        uid,
        type: OTP_AUTH_TYPE,
      });

    if (shouldSendEmail) {
      await sendEmailTo({
        emails: [email],
        subject: "Your Piya OTP Code",
        html: renderOTPVerificationEmail({
          userName: userRecord?.displayName || "there",
          otpCode,
          expiresIn: OTP_EXPIRY_MINUTES,
        }),
      });
    }

    return { sent: true };
  }

  static async requestPhoneOTP(
    params: RequestPhoneOTPParams,
  ): Promise<RequestOTPResult> {
    const { phone, type } = params;
    let userRecord;

    try {
      userRecord = await auth().getUserByPhoneNumber(phone);
    } catch (error) {
      if (!AuthService.isFirebaseUserNotFound(error)) {
        console.warn(error);
      }
    }

    const otpCode = generateOTPCode();
    const uid = userRecord?.uid ?? phone;

    await db()
      .collection(COLLECTIONS.auth_otp_codes)
      .doc(phone)
      .set({
        phone,
        codeHash: hashOTP(uid, phone, otpCode),
        expiresAt: getOTPExpiryTime(),
        uid,
        type: OTP_AUTH_TYPE,
      });

    try {
      const result = await sendOTP({
        to: phone,
        otpCode,
        channel: OTP_DELIVERY_CHANNELS[type],
      });

      return {
        sent: result.success,
        error: result.error,
      };
    } catch (error) {
      console.error("Failed to send phone OTP:", error);
      return {
        sent: false,
        error: "Failed to send OTP",
      };
    }
  }

  static async verifyAuthOTP(
    params: VerifyAuthOTPParams,
  ): Promise<VerifyAuthOTPResult> {
    const { phoneOrEmail, code, isPhone, linkToUid } = params;
    const authIdentifier = isPhone
      ? phoneOrEmail
      : getValidEmail(phoneOrEmail);
    const otpSnapshot = await db()
      .collection(COLLECTIONS.auth_otp_codes)
      .doc(authIdentifier)
      .get();
    const otpCodeData = otpSnapshot.data();

    if (otpSnapshot.exists && getUTCTimeNow() > otpCodeData?.expiresAt) {
      return { verified: false, reason: VERIFY_AUTH_OTP_REASON.expired };
    }

    const otpUid =
      typeof otpCodeData?.uid === "string" ? otpCodeData.uid : null;
    const isValidCode =
      otpUid !== null &&
      otpCodeData?.codeHash === hashOTP(otpUid, authIdentifier, code);

    if (!otpSnapshot.exists || !isValidCode) {
      return { verified: false, reason: VERIFY_AUTH_OTP_REASON.invalid };
    }

    let userRecord;

    if (linkToUid) {
      try {
        const existingUser = isPhone
          ? await auth().getUserByPhoneNumber(authIdentifier)
          : await auth().getUserByEmail(authIdentifier);

        if (existingUser.uid !== linkToUid) {
          return {
            verified: false,
            reason: isPhone
              ? VERIFY_AUTH_OTP_REASON.phoneInUse
              : VERIFY_AUTH_OTP_REASON.emailInUse,
          };
        }
      } catch (error) {
        if (!AuthService.isFirebaseUserNotFound(error)) {
          console.warn(error);
          return { verified: false, reason: VERIFY_AUTH_OTP_REASON.invalid };
        }
      }

      userRecord = await auth().updateUser(
        linkToUid,
        isPhone
          ? { phoneNumber: authIdentifier }
          : { email: authIdentifier, emailVerified: true },
      );
    } else {
      try {
        userRecord = isPhone
          ? await auth().getUserByPhoneNumber(authIdentifier)
          : await auth().getUserByEmail(authIdentifier);
      } catch (error) {
        if (!AuthService.isFirebaseUserNotFound(error)) {
          console.warn(error);
        }
      }

      if (!userRecord) {
        userRecord = isPhone
          ? await auth().createUser({ phoneNumber: authIdentifier })
          : await auth().createUser({ email: authIdentifier });
      }
    }

    if (!isPhone && !linkToUid) {
      await auth().updateUser(userRecord.uid, {
        emailVerified: true,
      });
    }

    const authToken = await auth().createCustomToken(userRecord.uid, {
      expiresAt: otpCodeData?.expiresAt,
    });

    if (!authIdentifier.endsWith(TEST_EMAIL_SUFFIX)) {
      await otpSnapshot.ref.delete();
    }

    return { verified: true, authToken };
  }
}
