import { db } from "../../configs/firebase";
import type { BusinessData } from "../model/business";
import type { UserData } from "../model/user";
import type { AccountSetupPersonalInfoBody } from "../schema/account-setup.schema";
import type { UpdateUserBody } from "../schema/user.schema";
import { ApiError } from "../utils/api-response";
import { COLLECTIONS } from "../utils/collections";
import { API_RESPONSE } from "../utils/constants";
import { getUTCTimeNow } from "../utils/helpers/helper-functions";
import { BusinessService } from "./business.service";
import { StorageService } from "./storage.service";

class UserService {
  static async getUser(userId: string): Promise<UserData | null> {
    const snapshot = await db().collection(COLLECTIONS.users).doc(userId).get();
    if (!snapshot.exists) return null;

    return snapshot.data() as UserData;
  }

  static async createUser(user: UserData): Promise<UserData> {
    await db().collection(COLLECTIONS.users).doc(user.id).set(user, {
      merge: true,
    });

    return user;
  }

  static async updateUser(
    userId: string,
    data: UpdateUserBody,
  ): Promise<UserData | null> {
    const docRef = db().collection(COLLECTIONS.users).doc(userId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) return null;

    const existingUser = snapshot.data() as UserData;

    const updatedUser: UserData = {
      ...existingUser,
      ...data,
      settings: {
        ...existingUser.settings,
        ...data.settings,
        notifications: {
          ...existingUser.settings.notifications,
          ...data.settings?.notifications,
        },
      },
      updatedAt: getUTCTimeNow(),
    };

    await docRef.set(updatedUser, { merge: true });

    return updatedUser;
  }

  static async updateAccountSetupPersonalInfo(
    userId: string,
    data: AccountSetupPersonalInfoBody,
  ): Promise<UserData | null> {
    const docRef = db().collection(COLLECTIONS.users).doc(userId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) return null;

    const existingUser = snapshot.data() as UserData;
    let profileImageUrl =
      data.profileImageUrl ?? existingUser.profileImageUrl ?? "";

    if (data.profileImage) {
      try {
        profileImageUrl = await StorageService.uploadUserProfileImage(
          userId,
          StorageService.decodeBase64Image(data.profileImage),
        );
      } catch (error) {
        const response = API_RESPONSE.invalidRequest;
        throw new ApiError(
          response.statusCode,
          error instanceof Error ? error.message : response.message,
          response.code,
        );
      }
    }

    const updatedUser: UserData = {
      ...existingUser,
      name: data.name,
      phoneNumber: data.phoneNumber ?? existingUser.phoneNumber ?? null,
      profileImageUrl,
      dob: data.dob ?? existingUser.dob ?? null,
      gender: data.gender ?? existingUser.gender ?? null,
      updatedAt: getUTCTimeNow(),
    };

    await docRef.set(updatedUser, { merge: true });

    return updatedUser;
  }

  static async completeAccountSetup(userId: string): Promise<UserData | null> {
    const docRef = db().collection(COLLECTIONS.users).doc(userId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) return null;

    const existingUser = snapshot.data() as UserData;
    const updatedUser: UserData = {
      ...existingUser,
      accountSetupCompleted: true,
      updatedAt: getUTCTimeNow(),
    };

    await docRef.set(updatedUser, { merge: true });

    return updatedUser;
  }

  static async getAccountSetupCompletion(userId: string): Promise<
    | {
        success: true;
        business: BusinessData;
        user: UserData;
      }
    | {
        success: false;
        message: string;
      }
  > {
    const user = await this.getUser(userId);

    if (!user?.name?.trim()) {
      return {
        success: false,
        message: "Add your personal information first.",
      };
    }

    const businessId = user.business?.businessIds[0];
    if (!businessId) {
      return {
        success: false,
        message: "Add your business profile first.",
      };
    }

    const business = await BusinessService.getBusiness(businessId);
    if (
      !business?.name?.trim() ||
      !business.description?.trim()
    ) {
      return {
        success: false,
        message: "Complete your business profile first.",
      };
    }

    const member = await BusinessService.getMember(businessId, userId);
    if (!member) {
      return {
        success: false,
        message: "Add the business owner member first.",
      };
    }

    const branding = await BusinessService.getBusinessBranding(businessId);
    if (!branding) {
      return {
        success: false,
        message: "Add your brand details first.",
      };
    }

    return { success: true, business, user };
  }

}

export { UserService };
