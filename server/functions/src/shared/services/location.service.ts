import axios from "axios";
import { finalConfiguration } from "../../configs/configurations";
import type {
  LocationData,
  LocationPrediction,
  LocationSearchOptions,
} from "../model/location";
import { ApiError } from "../utils/api-response";
import { API_RESPONSE } from "../utils/constants";

const AUTOCOMPLETE_URL = "https://places.googleapis.com/v1/places:autocomplete";
const AUTOCOMPLETE_FIELD_MASK = [
  "suggestions.placePrediction.placeId",
  "suggestions.placePrediction.text",
  "suggestions.placePrediction.structuredFormat",
  "suggestions.placePrediction.types",
  "suggestions.placePrediction.distanceMeters",
].join(",");
const DETAILS_FIELD_MASK = [
  "displayName",
  "formattedAddress",
  "addressComponents",
  "location",
].join(",");

type GoogleText = { text?: string };
type GooglePlacePrediction = {
  placeId?: string;
  text?: GoogleText;
  structuredFormat?: {
    mainText?: GoogleText;
    secondaryText?: GoogleText;
  };
  types?: string[];
  distanceMeters?: number;
};
type GoogleAddressComponent = {
  longText?: string;
  types?: string[];
};

export class LocationService {
  static async fetchLocationPredictions(
    input: string,
    options?: LocationSearchOptions
  ): Promise<LocationPrediction[]> {
    const apiKey = this.getApiKey();
    const body: Record<string, unknown> = { input };

    if (options?.origin) {
      body.origin = options.origin;
      body.locationBias = {
        circle: {
          center: options.origin,
          radius: 50_000,
        },
      };
    }

    if (options?.locationRestriction) {
      body.locationRestriction = options.locationRestriction;
    }

    if (options?.includedPrimaryTypes) {
      body.includedPrimaryTypes = options.includedPrimaryTypes;
    }

    try {
      const response = await axios.post<{
        suggestions?: Array<{ placePrediction?: GooglePlacePrediction }>;
      }>(AUTOCOMPLETE_URL, body, {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": AUTOCOMPLETE_FIELD_MASK,
        },
      });

      return (response.data.suggestions ?? [])
        .map((suggestion) => suggestion.placePrediction)
        .filter((prediction): prediction is GooglePlacePrediction =>
          Boolean(prediction?.placeId)
        )
        .map((prediction) => this.parseLocationPrediction(prediction));
    } catch {
      throw this.providerError();
    }
  }

  static async fetchLocationFromPlaceId(
    placeId: string
  ): Promise<LocationData | null> {
    const apiKey = this.getApiKey();

    try {
      const response = await axios.get<{
        displayName?: GoogleText;
        formattedAddress?: string;
        addressComponents?: GoogleAddressComponent[];
        location?: { latitude?: number; longitude?: number };
      }>(
        `https://places.googleapis.com/v1/places/${encodeURIComponent(
          placeId
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": DETAILS_FIELD_MASK,
          },
        }
      );
      const result = response.data;
      const latitude = result.location?.latitude;
      const longitude = result.location?.longitude;

      if (
        !result.formattedAddress ||
        typeof latitude !== "number" ||
        typeof longitude !== "number"
      ) {
        return null;
      }

      const components = result.addressComponents ?? [];
      const streetNumber = this.getAddressComponent(
        components,
        "street_number"
      );
      const route = this.getAddressComponent(components, "route");
      const city =
        this.getAddressComponent(components, "locality") ||
        this.getAddressComponent(components, "postal_town") ||
        this.getAddressComponent(components, "administrative_area_level_2");

      return {
        address: result.formattedAddress,
        streetAddress: [streetNumber, route].filter(Boolean).join(" "),
        city,
        state: this.getAddressComponent(
          components,
          "administrative_area_level_1"
        ),
        country: this.getAddressComponent(components, "country"),
        postalCode: this.getAddressComponent(components, "postal_code"),
        displayName: result.displayName?.text ?? "",
        geoPoint: {
          lat: latitude,
          lng: longitude,
        },
      };
    } catch {
      throw this.providerError();
    }
  }

  private static parseLocationPrediction(
    prediction: GooglePlacePrediction
  ): LocationPrediction {
    const fullText = prediction.text?.text ?? "";

    return {
      placeId: prediction.placeId ?? "",
      fullText,
      mainText: prediction.structuredFormat?.mainText?.text ?? fullText,
      secondaryText: prediction.structuredFormat?.secondaryText?.text ?? "",
      types: prediction.types ?? [],
      ...(typeof prediction.distanceMeters === "number"
        ? { distanceMeters: prediction.distanceMeters }
        : {}),
    };
  }

  private static getAddressComponent(
    components: GoogleAddressComponent[],
    type: string
  ) {
    return (
      components.find((component) => component.types?.includes(type))
        ?.longText ?? ""
    );
  }

  private static getApiKey() {
    const apiKey = finalConfiguration().GOOGLE_MAP_API_KEY;
    if (apiKey) return apiKey;

    const response = API_RESPONSE.locationConfigurationMissing;
    throw new ApiError(response.statusCode, response.message, response.code);
  }

  private static providerError() {
    const response = API_RESPONSE.locationProviderUnavailable;
    return new ApiError(response.statusCode, response.message, response.code);
  }
}
