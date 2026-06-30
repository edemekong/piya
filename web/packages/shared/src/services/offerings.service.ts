import type {
  BaseAPIServiceOptions,
  OfferingInput,
  OfferingListQuery,
  OfferingPayload,
  OfferingsPayload,
} from "../types";
import { BaseAPIService } from "./base-api.service";
import { authService, type AuthService } from "./auth.service";

export type {
  OfferingData,
} from "../models";

export type {
  OfferingFeatureType,
  OfferingStatusType,
  OfferingSubType,
  OfferingType,
} from "../types";

export class OfferingsService extends BaseAPIService {
  constructor(options: BaseAPIServiceOptions & { auth?: AuthService } = {}) {
    const auth = options.auth ?? authService;
    super({
      ...options,
      tokenProvider: options.tokenProvider ?? (() => auth.getIdToken()),
    });
  }

  getOfferings(input: OfferingListQuery = {}): Promise<OfferingsPayload> {
    return this.get<OfferingsPayload>(this.urlController.offerings, {
      queryParameters: input,
      withToken: true,
    });
  }

  createOffering(input: OfferingInput): Promise<OfferingPayload> {
    return this.post<OfferingPayload, OfferingInput>(
      this.urlController.offerings,
      {
        body: input,
        maxRetries: 0,
        withToken: true,
      },
    );
  }

  updateOffering(
    offeringId: string,
    input: OfferingInput,
  ): Promise<OfferingPayload> {
    return this.patch<OfferingPayload, OfferingInput>(
      this.urlController.offering(offeringId),
      {
        body: input,
        maxRetries: 0,
        withToken: true,
      },
    );
  }

  deleteOffering(offeringId: string): Promise<void> {
    return this.delete<void>(this.urlController.offering(offeringId), {
      maxRetries: 0,
      withToken: true,
    });
  }
}

export const offeringsService = new OfferingsService();
