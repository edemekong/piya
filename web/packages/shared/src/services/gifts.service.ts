import type {
  BaseAPIServiceOptions,
  GiftInput,
  GiftPayload,
  GiftsPayload,
} from "../types";
import { BaseAPIService } from "./base-api.service";
import { authService, type AuthService } from "./auth.service";

export type { GiftData, GiftStatusType } from "../models";

export class GiftsService extends BaseAPIService {
  constructor(options: BaseAPIServiceOptions & { auth?: AuthService } = {}) {
    const auth = options.auth ?? authService;
    super({
      ...options,
      tokenProvider: options.tokenProvider ?? (() => auth.getIdToken()),
    });
  }

  getGifts(): Promise<GiftsPayload> {
    return this.get<GiftsPayload>(this.urlController.gifts, {
      withToken: true,
    });
  }

  createGift(input: GiftInput): Promise<GiftPayload> {
    return this.post<GiftPayload, GiftInput>(this.urlController.gifts, {
      body: input,
      maxRetries: 0,
      withToken: true,
    });
  }

  updateGift(giftId: string, input: GiftInput): Promise<GiftPayload> {
    return this.patch<GiftPayload, GiftInput>(
      this.urlController.gift(giftId),
      {
        body: input,
        maxRetries: 0,
        withToken: true,
      },
    );
  }
}

export const giftsService = new GiftsService();
