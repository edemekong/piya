interface LocationData {
  address: string;
  city: string;
  state: string;
  serviceLocationId?: string | null;
  country: string;
  postalCode?: string;
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

interface LocationSearchOptions {
  origin?: {
    latitude: number;
    longitude: number;
  };
  locationRestriction?: {
    circle?: {
      center: {
        latitude: number;
        longitude: number;
      };
      radius: number;
    };
    rectangle?: {
      low: { latitude: number; longitude: number };
      high: { latitude: number; longitude: number };
    };
  };
  locationBias?: {
    circle?: {
      center: {
        latitude: number;
        longitude: number;
      };
      radius: number;
    };
    rectangle?: {
      low: { latitude: number; longitude: number };
      high: { latitude: number; longitude: number };
    };
  };
  includedPrimaryTypes?: ("cities" | "regions" | string)[];
}

interface LocationServiceRequest {
  input: string;
  origin?: {
    latitude: number;
    longitude: number;
  };
}

interface LocationDetailRequest {
  placeId: string;
}

const toMiniLocation = (location: LocationData): MiniLocationData => {
  return {
    formattedAddress: location.address,
    serviceLocationId: location.serviceLocationId,
    geoPoint: location.geoPoint,
  };
};
export {
  LocationData,
  MiniLocationData,
  GeoPointData,
  LocationPrediction,
  LocationSearchOptions,
  toMiniLocation,
  LocationServiceRequest,
  LocationDetailRequest,
};
