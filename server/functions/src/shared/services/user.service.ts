import { db } from "../../configs/firebase";
import type { UserData } from "../model/user";
import { CustomerAccountSetupBody, UpdateUserBody } from "../schema/user";
import { COLLECTIONS } from "../utils/collections";
import { getUTCTimeNow } from "../utils/helpers/helper-functions";

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

  static async setupCustomerAccount(
    userId: string,
    data: Omit<CustomerAccountSetupBody, "profileImage"> & {
      profileImageUrl?: string;
    },
  ): Promise<UserData | null> {
    const docRef = db().collection(COLLECTIONS.users).doc(userId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) return null;

    const existingUser = snapshot.data() as UserData;
    const updatedUser: UserData = {
      ...existingUser,
      name: data.name,
      profileImageUrl: data.profileImageUrl ?? existingUser.profileImageUrl,
      dob: data.dob,
      gender: data.gender,
      updatedAt: getUTCTimeNow(),
    };

    await docRef.set(updatedUser, { merge: true });
    return updatedUser;
  }
}

export { UserService };
