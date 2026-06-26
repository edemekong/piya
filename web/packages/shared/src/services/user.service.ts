import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import type { UserData } from "../models";
import type {
  BaseAPIServiceOptions,
  CreateUserInput,
  UpdateUserInput,
  UserPayload,
} from "../types";
import { userConverter } from "../utils/firestore-converters";
import { BaseAPIService } from "./base-api.service";
import { authService, type AuthService } from "./auth.service";
import { getFirebaseFirestore } from "./firebase.service";

export class UserService extends BaseAPIService {
  private readonly auth: AuthService;

  constructor(
    options: BaseAPIServiceOptions & { auth?: AuthService } = {},
  ) {
    const auth = options.auth ?? authService;
    super({
      ...options,
      tokenProvider: options.tokenProvider ?? (() => auth.getIdToken()),
    });

    this.auth = auth;
  }

  get currentFirebaseUserId() {
    return this.auth.currentFirebaseUser?.uid ?? null;
  }

  async getUser(id: string): Promise<UserData> {
    const data = await this.get<UserPayload>(this.urlController.user(id), {
      withToken: true,
    });

    return data.user;
  }

  async createUser(input: CreateUserInput): Promise<UserData> {
    const data = await this.post<UserPayload, CreateUserInput>(
      this.urlController.createUser,
      {
        body: input,
        withToken: true,
      },
    );

    return data.user;
  }

  async updateUser(input: UpdateUserInput): Promise<UserData> {
    const data = await this.patch<UserPayload, UpdateUserInput>(
      this.urlController.updateUser,
      {
        body: input,
        withToken: true,
      },
    );

    return data.user;
  }

  async getCurrentUser(uid = this.currentFirebaseUserId): Promise<UserData | null> {
    if (!uid) return null;

    const snapshot = await getDoc(this.userDocument(uid));
    return snapshot.exists() ? snapshot.data() : null;
  }

  listenToCurrentUser(
    uid: string,
    onUserUpdate: (user: UserData | null) => void,
  ): Unsubscribe {
    return onSnapshot(this.userDocument(uid), (snapshot) => {
      onUserUpdate(snapshot.exists() ? snapshot.data() : null);
    });
  }

  private userDocument(uid: string) {
    return doc(this.usersCollection(), uid).withConverter(userConverter);
  }

  private usersCollection() {
    return collection(getFirebaseFirestore(), "users");
  }
}

export const userService = new UserService();
