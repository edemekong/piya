import { appConfig } from "./app-config";
import { requireConfigValue } from "./env-config";

export class URLController {
  private readonly urlPrefix: string;

  constructor(baseUrl = appConfig.apiBaseUrl) {
    this.urlPrefix = baseUrl.replace(/\/$/, "");
  }

  get baseUrl() {
    return this.urlPrefix;
  }

  get health() {
    return this.path("/v1/health");
  }

  get requestAuthOTP() {
    return this.path("/v1/auth/request-otp");
  }

  get verifyAuthOTP() {
    return this.path("/v1/auth/verify-otp");
  }

  get createUser() {
    return this.path("/v1/users/create");
  }

  get updateUser() {
    return this.path("/v1/users/update");
  }

  user(id: string) {
    return this.path(`/v1/users/fetch/${encodeURIComponent(id)}`);
  }

  private path(pathname: string) {
    return `${requireConfigValue(this.urlPrefix, "VITE_API_BASE_URL")}${pathname}`;
  }
}
