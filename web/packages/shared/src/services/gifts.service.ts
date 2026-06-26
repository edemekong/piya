import type { BaseAPIServiceOptions } from "../types";
import { dummyGifts } from "../utils/dummy_data";
import { BaseAPIService } from "./base-api.service";

export type { GiftData, GiftStatusType } from "../models";

export class GiftsService extends BaseAPIService {
  constructor(options: BaseAPIServiceOptions = {}) {
    super(options);
  }

  getGifts() {
    return dummyGifts;
  }
}

export const giftsService = new GiftsService();
