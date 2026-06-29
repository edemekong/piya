interface LocationData {
  address: string;
  streetAddress?: string;
  city: string;
  state: string;
  serviceLocationId?: string | null;
  country: string;
  postalCode?: string;
  displayName?: string;
  geoPoint?: GeoPointData;
}

interface MiniLocationData {
  formattedAddress: string;
  serviceLocationId?: string | null;
  geoPoint?: GeoPointData;
}

interface GeoPointData {
  lat: number;
  lng: number;
}

interface LocationPrediction {
  placeId: string;
  fullText: string;
  mainText: string;
  secondaryText: string;
  types: string[];
  distanceMeters?: number;
  displayName?: string;
}

interface LocationArea {
  circle?: { center: { latitude: number; longitude: number }; radius: number };
  rectangle?: {
    low: { latitude: number; longitude: number };
    high: { latitude: number; longitude: number };
  };
}

interface LocationSearchOptions {
  origin?: { latitude: number; longitude: number };
  locationRestriction?: LocationArea;
  locationBias?: LocationArea;
  includedPrimaryTypes?: ("cities" | "regions" | string)[];
}

interface LocationServiceRequest {
  input: string;
  origin?: { latitude: number; longitude: number };
}
interface LocationDetailRequest {
  placeId: string;
}

const toMiniLocation = (location: LocationData): MiniLocationData => {
  return {
    formattedAddress: location.address,
    geoPoint: location.geoPoint,
  };
};
export {
  LocationData,
  MiniLocationData,
  GeoPointData,
  LocationPrediction,
  LocationSearchOptions,
  LocationServiceRequest,
  LocationDetailRequest,
  toMiniLocation,
};
