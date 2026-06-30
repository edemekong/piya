import { db } from "../../configs/firebase";
import type { GiftData } from "../model/gift";
import type {
  CreateGiftBody,
  UpdateGiftBody,
} from "../schema/gift.schema";
import { BUSINESS_SUBCOLLECTIONS, COLLECTIONS } from "../utils/collections";
import { getUTCTimeNow } from "../utils/helpers/helper-functions";
import { StorageService } from "./storage.service";

export class GiftService {
  static async getGifts(businessId: string): Promise<GiftData[]> {
    const snapshot = await this.giftsCollection(businessId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((document) => document.data() as GiftData);
  }

  static async createGift(params: {
    businessId: string;
    createdBy: string;
    input: CreateGiftBody;
  }): Promise<GiftData> {
    const { businessId, createdBy, input } = params;
    const giftRef = this.giftsCollection(businessId).doc();
    const { imageBase64, ...giftInput } = input;
    const imageUrl = imageBase64
      ? await StorageService.uploadBusinessGiftImage(
          businessId,
          giftRef.id,
          StorageService.decodeBase64Image(imageBase64),
        )
      : null;
    const now = getUTCTimeNow();
    const gift: GiftData = {
      ...giftInput,
      businessId,
      createdAt: now,
      createdBy,
      id: giftRef.id,
      imageUrl,
      updatedAt: now,
    };

    await giftRef.create(gift);
    return gift;
  }

  static async updateGift(params: {
    businessId: string;
    giftId: string;
    input: UpdateGiftBody;
  }): Promise<GiftData | null> {
    const { businessId, giftId, input } = params;
    const giftRef = this.giftsCollection(businessId).doc(giftId);
    const snapshot = await giftRef.get();
    if (!snapshot.exists) return null;

    const existingGift = snapshot.data() as GiftData;
    const { imageBase64, ...giftInput } = input;
    const imageUrl = imageBase64
      ? await StorageService.uploadBusinessGiftImage(
          businessId,
          giftId,
          StorageService.decodeBase64Image(imageBase64),
        )
      : existingGift.imageUrl ?? null;
    const gift: GiftData = {
      ...giftInput,
      businessId,
      createdAt: existingGift.createdAt,
      createdBy: existingGift.createdBy,
      id: giftId,
      imageUrl,
      updatedAt: getUTCTimeNow(),
    };

    await giftRef.set(gift);
    return gift;
  }

  private static giftsCollection(businessId: string) {
    return db()
      .collection(COLLECTIONS.business)
      .doc(businessId)
      .collection(BUSINESS_SUBCOLLECTIONS.gifts);
  }
}
