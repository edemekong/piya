import { GeoPointData } from "./location";

export interface ServiceLocation {
  serviceLocationId: string;
  active: boolean;
  country: string;
  city: string;
  geoPoint: GeoPointData;
  createdAt: number;
  updatedAt: number;
}
