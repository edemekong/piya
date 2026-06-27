import axios from "axios";
import type { ApiClientOptions } from "../types";

export function createApiClient({ baseUrl, axiosInstance }: ApiClientOptions) {
  const newBaseUrl = baseUrl.replace(/\/$/, "");
  const client = axiosInstance ?? axios.create({ baseURL: newBaseUrl });

  return {
    async get<T>(path: string, init?: RequestInit): Promise<T> {
      const response = await client.get<T>(`${newBaseUrl}${path}`, {
        headers: init?.headers as Record<string, string> | undefined,
        signal: init?.signal ?? undefined,
      });
      return response.data;
    },
  };
}

export {
  ApiServiceError,
  BaseAPIService,
} from "./base-api.service";
export { AuthService, authService } from "./auth.service";
export * from "./communications.service";
export * from "./contacts.service";
export * from "./discounts.service";
export {
  getFirebaseApp,
  getFirebaseAuth,
  getFirebaseFirestore,
  getFirebaseStorage,
} from "./firebase.service";
export * from "./gifts.service";
export * from "./offerings.service";
export * from "./orders.service";
export { BusinessTeamService, teamService } from "./team.service";
export { UserService, userService } from "./user.service";
