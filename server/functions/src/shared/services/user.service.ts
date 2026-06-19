import { db } from "../../configs/firebase";
import { UserModel } from "../model/user";
import { CustomerAccountSetupBody, UpdateUserBody } from "../schema/user";
import { COLLECTIONS } from "../utils/collections";

class UserService {
  static async getUser(userId: string): Promise<UserModel | null> {
    const snapshot = await db().collection(COLLECTIONS.users).doc(userId).get();
    if (!snapshot.exists) return null;

    return snapshot.data() as UserModel;
  }

  static async createUser(user: UserModel): Promise<UserModel> {
    await db().collection(COLLECTIONS.users).doc(user.id).set(user, {
      merge: true,
    });

    return user;
  }

  static async updateUser(
    userId: string,
    data: UpdateUserBody,
  ): Promise<UserModel | null> {
    const docRef = db().collection(COLLECTIONS.users).doc(userId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) return null;

    const existingUser = snapshot.data() as UserModel;
    const now = Date.now();

    const updatedUser: UserModel = {
      ...existingUser,
      ...data,
      device: {
        ...existingUser.device,
        ...data.device,
        timezone: {
          ...existingUser.device.timezone,
          ...data.device?.timezone,
        },
      },
      settings: {
        ...existingUser.settings,
        ...data.settings,
        notifications: {
          ...existingUser.settings.notifications,
          ...data.settings?.notifications,
        },
      },
      updatedAt: now,
    };

    await docRef.set(updatedUser, { merge: true });

    return updatedUser;
  }

  static async setupCustomerAccount(
    userId: string,
    data: Omit<CustomerAccountSetupBody, "profileImage"> & {
      profileImageUrl?: string;
    },
  ): Promise<UserModel | null> {
    const docRef = db().collection(COLLECTIONS.users).doc(userId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) return null;

    const existingUser = snapshot.data() as UserModel;
    const updatedUser: UserModel = {
      ...existingUser,
      accountType: "customer",
      name: data.name,
      profileImageUrl: data.profileImageUrl ?? existingUser.profileImageUrl,
      dob: data.dob,
      gender: data.gender,
      updatedAt: Date.now(),
    };

    await docRef.set(updatedUser, { merge: true });
    return updatedUser;
  }
}

export { UserService };
