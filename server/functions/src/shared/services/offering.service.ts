import { db } from "../../configs/firebase";
import type { OfferingData } from "../model/offering";
import type {
  CreateOfferingBody,
  UpdateOfferingBody,
} from "../schema/offering.schema";
import { BUSINESS_SUBCOLLECTIONS, COLLECTIONS } from "../utils/collections";
import { getUTCTimeNow } from "../utils/helpers/helper-functions";

export class OfferingService {
  static async getOfferings(businessId: string): Promise<OfferingData[]> {
    const snapshot = await this.offeringsCollection(businessId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((document) => document.data() as OfferingData);
  }

  static async createOffering(params: {
    businessId: string;
    input: CreateOfferingBody;
  }): Promise<OfferingData> {
    const { businessId, input } = params;
    const offeringRef = this.offeringsCollection(businessId).doc();
    const now = getUTCTimeNow();
    const offering: OfferingData = {
      ...input,
      businessId,
      id: offeringRef.id,
      createdAt: now,
      updatedAt: now,
    };

    await offeringRef.create(offering);
    return offering;
  }

  static async updateOffering(params: {
    businessId: string;
    input: UpdateOfferingBody;
    offeringId: string;
  }): Promise<OfferingData | null> {
    const { businessId, input, offeringId } = params;
    const offeringRef = this.offeringsCollection(businessId).doc(offeringId);
    const snapshot = await offeringRef.get();
    if (!snapshot.exists) return null;

    const existingOffering = snapshot.data() as OfferingData;
    const offering: OfferingData = {
      ...existingOffering,
      ...input,
      businessId,
      id: offeringId,
      createdAt: existingOffering.createdAt,
      updatedAt: getUTCTimeNow(),
    };

    await offeringRef.set(offering);
    return offering;
  }

  private static offeringsCollection(businessId: string) {
    return db()
      .collection(COLLECTIONS.business)
      .doc(businessId)
      .collection(BUSINESS_SUBCOLLECTIONS.offerings);
  }
}
