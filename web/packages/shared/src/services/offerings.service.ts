import type { BaseAPIServiceOptions } from "../types";
import { dummyOfferings } from "../utils/dummy_data";
import { BaseAPIService } from "./base-api.service";

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
  constructor(options: BaseAPIServiceOptions = {}) {
    super(options);
  }

  getOfferings() {
    return dummyOfferings;
  }
}

export const offeringsService = new OfferingsService();
