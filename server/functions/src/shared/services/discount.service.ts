import { db } from "../../configs/firebase";
import type { DiscountData } from "../model/discount";
import type {
  CreateDiscountBody,
  UpdateDiscountBody,
} from "../schema/discount.schema";
import { BUSINESS_SUBCOLLECTIONS, COLLECTIONS } from "../utils/collections";
import { getUTCTimeNow } from "../utils/helpers/helper-functions";

export class DiscountService {
  static async getDiscounts(businessId: string): Promise<DiscountData[]> {
    const snapshot = await this.discountsCollection(businessId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((document) => document.data() as DiscountData);
  }

  static async createDiscount(params: {
    businessId: string;
    createdBy: string;
    input: CreateDiscountBody;
  }): Promise<DiscountData> {
    const { businessId, createdBy, input } = params;
    const discountRef = this.discountsCollection(businessId).doc();
    const now = getUTCTimeNow();
    const discount: DiscountData = {
      ...input,
      businessId,
      createdAt: now,
      createdBy,
      id: discountRef.id,
      updatedAt: now,
    };

    await discountRef.create(discount);
    return discount;
  }

  static async updateDiscount(params: {
    businessId: string;
    discountId: string;
    input: UpdateDiscountBody;
  }): Promise<DiscountData | null> {
    const { businessId, discountId, input } = params;
    const discountRef = this.discountsCollection(businessId).doc(discountId);
    const snapshot = await discountRef.get();
    if (!snapshot.exists) return null;

    const existingDiscount = snapshot.data() as DiscountData;
    const discount: DiscountData = {
      ...input,
      businessId,
      createdAt: existingDiscount.createdAt,
      createdBy: existingDiscount.createdBy,
      id: discountId,
      updatedAt: getUTCTimeNow(),
    };

    await discountRef.set(discount);
    return discount;
  }

  private static discountsCollection(businessId: string) {
    return db()
      .collection(COLLECTIONS.business)
      .doc(businessId)
      .collection(BUSINESS_SUBCOLLECTIONS.discounts);
  }
}
