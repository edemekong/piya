import type {
  BaseAPIServiceOptions,
  BusinessSlugAvailabilityPayload,
} from "../types";
import { BaseAPIService } from "./base-api.service";
import { authService, type AuthService } from "./auth.service";

export class BusinessService extends BaseAPIService {
  constructor(
    options: BaseAPIServiceOptions & { auth?: AuthService } = {},
  ) {
    const auth = options.auth ?? authService;
    super({
      ...options,
      tokenProvider: options.tokenProvider ?? (() => auth.getIdToken()),
    });
  }

  checkSlugAvailability(
    slug: string,
    signal?: AbortSignal,
  ): Promise<BusinessSlugAvailabilityPayload> {
    return this.get<BusinessSlugAvailabilityPayload>(
      this.urlController.businessSlugAvailability,
      {
        queryParameters: { slug },
        signal,
        withToken: true,
      },
    );
  }
}

export const businessService = new BusinessService();
