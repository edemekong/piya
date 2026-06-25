export type GeoPointData = {
  lat: number;
  lng: number;
};

export type LocationData = {
  address: string;
  city: string;
  state: string;
  serviceLocationId?: string | null;
  country: string;
  postalCode?: string;
  geoPoint?: GeoPointData;
};

export type MiniLocationData = {
  formattedAddress: string;
  serviceLocationId?: string | null;
  geoPoint?: GeoPointData;
};

export type LocationPrediction = {
  placeId: string;
  fullText: string;
  mainText: string;
  secondaryText: string;
  types: string[];
  distanceMeters?: number;
  displayName?: string;
};

export type LocationArea = {
  circle?: { center: { latitude: number; longitude: number }; radius: number };
  rectangle?: {
    low: { latitude: number; longitude: number };
    high: { latitude: number; longitude: number };
  };
};

export type LocationSearchOptions = {
  origin?: { latitude: number; longitude: number };
  locationRestriction?: LocationArea;
  locationBias?: LocationArea;
  includedPrimaryTypes?: ("cities" | "regions" | string)[];
};

export type LocationServiceRequest = {
  input: string;
  origin?: { latitude: number; longitude: number };
};

export type LocationDetailRequest = {
  placeId: string;
};

export function toMiniLocation(location: LocationData): MiniLocationData {
  return {
    formattedAddress: location.address,
    geoPoint: location.geoPoint,
    serviceLocationId: location.serviceLocationId,
  };
}
