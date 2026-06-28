import type { AvailabilityScheduleDraft, AvailabilityPayload } from "../types";
import type { BaseAPIServiceOptions } from "../types";
import { BaseAPIService } from "./base-api.service";
import { authService, type AuthService } from "./auth.service";

export class AvailabilityService extends BaseAPIService {
  constructor(
    options: BaseAPIServiceOptions & { auth?: AuthService } = {},
  ) {
    const auth = options.auth ?? authService;
    super({
      ...options,
      tokenProvider: options.tokenProvider ?? (() => auth.getIdToken()),
    });

  }

  getPrimaryAvailability(): Promise<AvailabilityPayload> {
    return this.get<AvailabilityPayload>(
      this.urlController.primaryAvailability,
      {
        withToken: true,
      },
    );
  }

  updatePrimaryAvailability(
    input: AvailabilityScheduleDraft,
  ): Promise<AvailabilityPayload> {
    return this.patch<AvailabilityPayload, AvailabilityScheduleDraft>(
      this.urlController.primaryAvailability,
      {
        body: input,
        withToken: true,
      },
    );
  }
}

export const availabilityService = new AvailabilityService();
