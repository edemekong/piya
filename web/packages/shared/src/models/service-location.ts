import type { BaseModel } from "./base";
import type { LocationData } from "./location";

export interface ServiceLocationData extends BaseModel {
  businessId: string;
  active: boolean;
  location: LocationData;
}
