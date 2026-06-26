import type { AxiosInstance } from "axios";

export type ApiResponseBody<T = unknown> = {
  status: 0 | 1;
  message: string;
  code?: string;
  data?: T | null;
  details?: unknown;
};

export type TokenProvider = () => Promise<string | null> | string | null;

export type BaseAPIServiceOptions = {
  baseUrl?: string;
  timeoutMs?: number;
  maxRetries?: number;
  tokenProvider?: TokenProvider;
  axiosInstance?: AxiosInstance;
};

export type ApiRequestOptions<TBody = unknown> = {
  body?: TBody;
  headers?: Record<string, string>;
  maxRetries?: number;
  queryParameters?: Record<string, unknown>;
  withToken?: boolean;
  signal?: AbortSignal;
};

export type ApiClientOptions = {
  baseUrl: string;
  axiosInstance?: AxiosInstance;
};

export type UserPayload = {
  user: import("../models").UserData;
};

export type AuthTokenPayload = {
  authToken: string;
};

export type CreateUserInput = Partial<
  Omit<import("../models").UserData, "id" | "createdAt" | "updatedAt">
>;

export type UpdateUserInput = Partial<
  Pick<
    import("../models").UserData,
    "name" | "profileImageUrl" | "accountSetupCompleted" | "dob" | "gender"
  > & {
    settings: Partial<import("../models").UserSettingsData>;
  }
>;
