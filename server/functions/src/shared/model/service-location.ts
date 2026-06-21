import { BaseModel } from "./base";
import { LocationData } from "./location";

export interface ServiceLocationData extends BaseModel {
  businessId: string;
  active: boolean;
  location: LocationData;
}
