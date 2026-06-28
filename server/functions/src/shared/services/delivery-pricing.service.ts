import { db } from "../../configs/firebase";
import type { DeliveryPricingData } from "../model/delivery-pricing";
import type { UpdateDeliveryPricingBody } from "../schema/delivery-pricing.schema";
import { BUSINESS_SUBCOLLECTIONS, COLLECTIONS } from "../utils/collections";
import { getUTCTimeNow } from "../utils/helpers/helper-functions";

const PRIMARY_DELIVERY_PRICING_ID = "primary";

export class DeliveryPricingService {
  static async getPrimaryDeliveryPricing(
    businessId: string
  ): Promise<DeliveryPricingData | null> {
    const snapshot = await this.primaryDeliveryPricingDocument(
      businessId
    ).get();
    return snapshot.exists ? (snapshot.data() as DeliveryPricingData) : null;
  }

  static async upsertPrimaryDeliveryPricing(params: {
    businessId: string;
    createdBy: string;
    pricing: UpdateDeliveryPricingBody;
  }): Promise<DeliveryPricingData> {
    const { businessId, createdBy, pricing } = params;
    const documentRef = this.primaryDeliveryPricingDocument(businessId);
    const snapshot = await documentRef.get();
    const existingPricing = snapshot.exists
      ? (snapshot.data() as DeliveryPricingData)
      : null;
    const now = getUTCTimeNow();
    const deliveryPricing: DeliveryPricingData = {
      id: PRIMARY_DELIVERY_PRICING_ID,
      businessId,
      createdBy: existingPricing?.createdBy ?? createdBy,
      currency: pricing.currency,
      vehicles: pricing.vehicles,
      createdAt: existingPricing?.createdAt ?? now,
      updatedAt: now,
    };

    await documentRef.set(deliveryPricing);
    return deliveryPricing;
  }

  private static primaryDeliveryPricingDocument(businessId: string) {
    return db()
      .collection(COLLECTIONS.business)
      .doc(businessId)
      .collection(BUSINESS_SUBCOLLECTIONS.deliveryPricing)
      .doc(PRIMARY_DELIVERY_PRICING_ID);
  }
}
