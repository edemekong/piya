import { auth, db } from "../../configs/firebase";
import { renderOTPVerificationEmail } from "../email_templates/email-template-functions";

import { sendEmailTo } from "../utils/helpers/email-notifications";
import {
  generateOTPCode,
  getOTPExpiryTime,
  getUTCTimeNow,
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
  OTP_DELIVERY_CHANNELS,
  OTP_EXPIRY_MINUTES,
  VERIFY_AUTH_OTP_REASON,
  ZOLT_TEST_EMAIL_SUFFIX,
} from "../utils/constants";

export class AuthService {
  private static isFirebaseUserNotFound(error: unknown): boolean {
    return (error as { code?: unknown })?.code === "auth/user-not-found";
  }

  static async requestEmailOTP(
    params: RequestEmailOTPParams,
  ): Promise<RequestOTPResult> {
    const { email } = params;
    let userRecord;

    try {
      userRecord = await auth().getUserByEmail(email);
    } catch (error) {
      if (!AuthService.isFirebaseUserNotFound(error)) {
        console.warn(error);
      }
    }

    if (email.endsWith(ZOLT_TEST_EMAIL_SUFFIX)) {
      return { sent: true };
    }

    const otpCode = generateOTPCode();

    await db()
      .collection(COLLECTIONS.auth_otp_codes)
      .doc(email)
      .set({
        email,
        code: otpCode,
        expiresAt: getOTPExpiryTime(),
        uid: userRecord?.uid ?? email,
        type: OTP_AUTH_TYPE,
      });

    await sendEmailTo({
      emails: [email],
      subject: "Your 1Bee Online Verification Code",
      html: renderOTPVerificationEmail({
        userName: userRecord?.displayName || "there",
        otpCode,
        expiresIn: OTP_EXPIRY_MINUTES,
      }),
    });

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

    await db()
      .collection(COLLECTIONS.auth_otp_codes)
      .doc(phone)
      .set({
        phone,
        code: otpCode,
        expiresAt: getOTPExpiryTime(),
        uid: userRecord?.uid ?? phone,
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
    const otpSnapshot = await db()
      .collection(COLLECTIONS.auth_otp_codes)
      .doc(phoneOrEmail)
      .get();
    const otpCodeData = otpSnapshot.data();

    if (otpSnapshot.exists && getUTCTimeNow() > otpCodeData?.expiresAt) {
      return { verified: false, reason: VERIFY_AUTH_OTP_REASON.expired };
    }

    if (!otpSnapshot.exists || otpCodeData?.code !== code) {
      return { verified: false, reason: VERIFY_AUTH_OTP_REASON.invalid };
    }

    let userRecord;

    if (linkToUid) {
      try {
        const existingUser = isPhone
          ? await auth().getUserByPhoneNumber(phoneOrEmail)
          : await auth().getUserByEmail(phoneOrEmail);

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
          ? { phoneNumber: phoneOrEmail }
          : { email: phoneOrEmail, emailVerified: true },
      );
    } else {
      try {
        userRecord = isPhone
          ? await auth().getUserByPhoneNumber(phoneOrEmail)
          : await auth().getUserByEmail(phoneOrEmail);
      } catch (error) {
        if (!AuthService.isFirebaseUserNotFound(error)) {
          console.warn(error);
        }
      }

      if (!userRecord) {
        userRecord = isPhone
          ? await auth().createUser({ phoneNumber: phoneOrEmail })
          : await auth().createUser({ email: phoneOrEmail });
      }
    }

    if (!isPhone && !linkToUid) {
      await auth().updateUser(userRecord.uid, {
        emailVerified: true,
      });
    }

    const authToken = await auth().createCustomToken(userRecord.uid, {
      code,
      expiresAt: otpCodeData?.expiresAt,
    });

    if (!phoneOrEmail.endsWith(ZOLT_TEST_EMAIL_SUFFIX)) {
      await otpSnapshot.ref.delete();
    }

    return { verified: true, authToken };
  }
}
