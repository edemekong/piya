import {
  onAuthStateChanged,
  signInWithCustomToken,
  signOut,
  type IdTokenResult,
  type Unsubscribe,
  type User,
  type UserCredential,
} from "firebase/auth";
import type {
  AuthTokenPayload,
  BaseAPIServiceOptions,
  RequestOTPBody,
  RequestOTPResult,
  VerifyAuthOTPParams,
  VerifyAuthOTPResult,
} from "../types";
import { BaseAPIService } from "./base-api.service";
import { getFirebaseAuth } from "./firebase.service";

export class AuthService extends BaseAPIService {
  constructor(options: BaseAPIServiceOptions = {}) {
    super({
      ...options,
      tokenProvider:
        options.tokenProvider ??
        (() => getFirebaseAuth().currentUser?.getIdToken() ?? null),
    });
  }

  get currentFirebaseUser(): User | null {
    return getFirebaseAuth().currentUser;
  }

  async getIdToken(forceRefresh = false): Promise<string | null> {
    return this.currentFirebaseUser?.getIdToken(forceRefresh) ?? null;
  }

  async getIdTokenResult(forceRefresh = false): Promise<IdTokenResult | null> {
    return this.currentFirebaseUser?.getIdTokenResult(forceRefresh) ?? null;
  }

  onAuthStateChanged(callback: (user: User | null) => void): Unsubscribe {
    return onAuthStateChanged(getFirebaseAuth(), callback);
  }

  async requestOTP({
    phoneOrEmail,
    dialCode,
    type = "sms",
  }: RequestOTPBody): Promise<RequestOTPResult> {
    await this.post<null, RequestOTPBody>(this.urlController.requestAuthOTP, {
      body: { dialCode, phoneOrEmail, type },
    });

    return { sent: true };
  }

  async verifyOTP({
    phoneOrEmail,
    code,
    dialCode,
    isPhone,
    linkToUid,
  }: VerifyAuthOTPParams & {
    dialCode?: string;
  }): Promise<VerifyAuthOTPResult> {
    const data = await this.post<AuthTokenPayload, Record<string, unknown>>(
      this.urlController.verifyAuthOTP,
      {
        body: {
          code,
          dialCode,
          isPhone,
          linkToUid,
          phoneOrEmail,
        },
        withToken: Boolean(linkToUid),
      },
    );

    if (!data.authToken) {
      return { verified: false };
    }

    await this.signInWithCustomToken(data.authToken);

    return {
      authToken: data.authToken,
      verified: true,
    };
  }

  signInWithCustomToken(authToken: string): Promise<UserCredential> {
    return signInWithCustomToken(getFirebaseAuth(), authToken);
  }

  async reloadFirebaseUser(forceRefreshToken = true): Promise<string | null> {
    await this.currentFirebaseUser?.reload();
    await this.getIdToken(forceRefreshToken);

    return this.currentFirebaseUser?.uid ?? null;
  }

  async signOut(): Promise<void> {
    await signOut(getFirebaseAuth());
  }
}

export const authService = new AuthService();
