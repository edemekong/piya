import admin = require("firebase-admin");
import base64url from "base64url";
import jwt from "jsonwebtoken";
import { finalConfiguration } from "../../../configs/configurations";
import { resendEmailClient } from "../../../configs/resend";
import randomstring = require("randomstring");
import { OTPRequestType } from "../../types/auth";
import { OTP_EXPIRY_MINUTES } from "../constants";
import { OTP_REQUEST_TYPE_OPTIONS } from "../constants";

export async function deleteCollection(
  db: any,
  collectionRef: admin.firestore.CollectionReference,
  batchSize: number,
) {
  const query = collectionRef.limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

export async function deleteQueryBatch(
  db: any,
  query: admin.firestore.Query<admin.firestore.DocumentData>,
  resolve: any,
) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    resolve();
    return;
  }

  const batch = db().batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}

export const compareArrays = (a: Array<any>, b: Array<any>) =>
  a.length === b.length && a.every((element, index) => element === b[index]);

export const uniqueItemList = (originalList: Array<any>) => {
  let unique = originalList.filter(
    (value, index, array) => array.indexOf(value) === index,
  );
  return unique;
};

export const getUTCTimeNow = () => {
  return Date.now();
};

export function getFirstName(fullName: string): string {
  let firstName = "";
  const names = fullName.split(" ");

  if (names.length > 0) {
    firstName = names[0];
  }

  return firstName;
}

export function getLastName(fullName: string): string {
  let lastName = "";
  const names = fullName.split(" ");

  if (names.length > 1) {
    lastName = names[names.length - 1];
  }

  return lastName;
}

export async function decodeBase64Url(url: string) {
  try {
    let docodeString = base64url.decode(url);
    return JSON.parse(docodeString);
  } catch (e) {
    console.log(e);
  }
  return null;
}

export async function encodeBase64Url(data: Record<string, any>) {
  try {
    const jsonString = JSON.stringify(data);
    const encodedString = base64url.encode(jsonString);
    return encodedString;
  } catch (e) {
    console.log(e);
  }
  return null;
}

export const generateJwtToken = (payload: string) => {
  const { JWT_SECRET } = finalConfiguration();

  const token = jwt.sign(payload, JWT_SECRET!);
  return token;
};

export const decodeJwtToken = (payload: string) => {
  const { JWT_SECRET } = finalConfiguration();

  try {
    const verify = jwt.verify(payload, JWT_SECRET!);

    return verify;
  } catch (error) {}

  return null;
};

export const createUpdateContactOnResend = async (
  userData: Record<string, any>,
  audienceId: string,
) => {
  if (userData.email && userData.email.includes("@")) {
    try {
      const response = await resendEmailClient().contacts.create({
        audienceId: audienceId,
        email: userData["email"],
        firstName: getFirstName(userData["name"] ?? "User"),
        lastName: getLastName(userData["name"] ?? ""),
      });

      console.log("User data created/updated on Resend:", response);
    } catch (error) {
      console.log("Error creating/updating user data on Resend:", error);
    }
  }
};

export const removeUserDataFromResend = async (
  userEmail: string,
  audienceId: string,
) => {
  if (userEmail && userEmail.includes("@")) {
    try {
      const response = await resendEmailClient().contacts.remove({
        audienceId: audienceId,
        email: userEmail,
      });

      console.log("User data removed from Resend:", response);
    } catch (error) {
      console.log("Error removing user data from Resend:", error);
    }
  }
};

export function generateOTPCode() {
  return randomstring.generate({ length: 4, charset: "numeric" });
}


export function getOTPExpiryTime() {
  return getUTCTimeNow() + OTP_EXPIRY_MINUTES * 60 * 1000;
}

export function isValidOTPRequestType(
  type: string | undefined,
): type is OTPRequestType {
  return OTP_REQUEST_TYPE_OPTIONS.includes(type as OTPRequestType);
}
