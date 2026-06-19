import { parsePhoneNumberWithError } from "libphonenumber-js";

export class ValidationsUtils {
  static isValidEmail(email: string | undefined): boolean {
    if(!email) return false;
    
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  }

  static isValidPhoneNumber(phone: string | undefined, code?: string): boolean {
    if(!phone) return false;

    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (phoneRegex.test(phone)) {
      const phoneNumber = parsePhoneNumberWithError(phone, {
        defaultCallingCode: code,
      });
      return phoneNumber.isValid();
    }
    
    return false;
  }

  static getValidPhoneNumber(phone: string, code?: string): string | null {
    try {
      const phoneNumber = parsePhoneNumberWithError(phone, {
        defaultCallingCode: code,
      });
 
      return phoneNumber.isValid() ? phoneNumber.number : null;
    } catch (error) {
      return null;
    }
  }

  static isNonEmptyString(value: string): boolean {
    return typeof value === "string" && value.trim().length > 0;
  }

  static isValidPassword(password: string): boolean {
    return typeof password === "string" && password.length >= 6;
  }

  static isValidUser(user: any): boolean {
    return (
      user && typeof user.uid === "string" && this.isValidEmail(user.email)
    );
  }
}
