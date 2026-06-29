import type {
  BaseAPIServiceOptions,
  LocationPayload,
  LocationPredictionsPayload,
} from "../types";
import type { LocationDetailRequest, LocationServiceRequest } from "../models";
import { BaseAPIService } from "./base-api.service";
import { authService, type AuthService } from "./auth.service";

export class LocationsService extends BaseAPIService {
  constructor(options: BaseAPIServiceOptions & { auth?: AuthService } = {}) {
    const auth = options.auth ?? authService;
    super({
      ...options,
      tokenProvider: options.tokenProvider ?? (() => auth.getIdToken()),
    });
  }

  async searchLocations(input: LocationServiceRequest, signal?: AbortSignal) {
    const data = await this.post<
      LocationPredictionsPayload,
      LocationServiceRequest
    >(this.urlController.locationSearch, {
      body: input,
      maxRetries: 0,
      signal,
      withToken: true,
    });

    return data.predictions;
  }

  async getLocationDetails(input: LocationDetailRequest, signal?: AbortSignal) {
    const data = await this.post<LocationPayload, LocationDetailRequest>(
      this.urlController.locationDetails,
      {
        body: input,
        maxRetries: 0,
        signal,
        withToken: true,
      }
    );

    return data.location;
  }
}

export const locationsService = new LocationsService();
