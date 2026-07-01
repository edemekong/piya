import { db } from "../../configs/firebase";
import type { BusinessData } from "../model/business";
import type {
  SiteFlowData,
  SiteFlowModuleData,
  SiteModuleId,
} from "../model/site-flow";
import type { UpdateSiteFlowBody } from "../schema/site-flow.schema";
import type { BusinessCategoryTypes } from "../types/business.type";
import { BUSINESS_SUBCOLLECTIONS, COLLECTIONS } from "../utils/collections";
import { getUTCTimeNow } from "../utils/helpers/helper-functions";

const PRIMARY_SITE_FLOW_ID = "primary";

const starterModuleIdsByCategory: Record<
  BusinessCategoryTypes,
  SiteModuleId[]
> = {
  laundry: [
    "welcome",
    "offerings",
    "offering-details",
    "availability",
    "booking-form",
    "confirmation",
  ],
  fashion_tailoring: [
    "welcome",
    "offerings",
    "offering-details",
    "quote-request",
    "upload-documents",
    "confirmation",
  ],
  salon: [
    "welcome",
    "offerings",
    "offering-details",
    "availability",
    "booking-form",
    "confirmation",
  ],
  barbershop: [
    "welcome",
    "offerings",
    "offering-details",
    "availability",
    "booking-form",
    "confirmation",
  ],
  spa: [
    "welcome",
    "offerings",
    "offering-details",
    "availability",
    "booking-form",
    "confirmation",
  ],
  beauty_studio: [
    "welcome",
    "offerings",
    "offering-details",
    "availability",
    "booking-form",
    "confirmation",
  ],
  car_wash: [
    "welcome",
    "offerings",
    "offering-details",
    "availability",
    "booking-form",
    "confirmation",
  ],
  logistics_delivery: [
    "welcome",
    "location-first",
    "delivery-request",
    "confirmation",
  ],
  restaurant: [
    "welcome",
    "location-first",
    "offerings",
    "offering-details",
    "cart",
    "checkout",
    "confirmation",
  ],
  food_vendor: [
    "welcome",
    "location-first",
    "offerings",
    "offering-details",
    "cart",
    "checkout",
    "confirmation",
  ],
  supermarket: [
    "welcome",
    "location-first",
    "offerings",
    "offering-details",
    "cart",
    "checkout",
    "confirmation",
  ],
  farm_produce: [
    "welcome",
    "location-first",
    "offerings",
    "offering-details",
    "cart",
    "checkout",
    "confirmation",
  ],
  fashion_store: [
    "welcome",
    "offerings",
    "offering-details",
    "cart",
    "checkout",
    "confirmation",
  ],
  electronics_store: [
    "welcome",
    "offerings",
    "offering-details",
    "cart",
    "checkout",
    "confirmation",
  ],
  photography: [
    "welcome",
    "offerings",
    "offering-details",
    "quote-request",
    "upload-documents",
    "confirmation",
  ],
  consulting: [
    "welcome",
    "offerings",
    "offering-details",
    "quote-request",
    "confirmation",
  ],
  real_estate_agent: [
    "welcome",
    "offerings",
    "offering-details",
    "quote-request",
    "confirmation",
  ],
  hotel_guesthouse: [
    "welcome",
    "offerings",
    "offering-details",
    "availability",
    "booking-form",
    "confirmation",
  ],
  shortlet_apartment: [
    "welcome",
    "offerings",
    "offering-details",
    "availability",
    "booking-form",
    "confirmation",
  ],
};

export class SiteFlowService {
  static async getSiteFlow(businessId: string): Promise<SiteFlowData | null> {
    const snapshot = await this.siteFlowDocument(businessId).get();
    return snapshot.exists ? (snapshot.data() as SiteFlowData) : null;
  }

  static async updateSiteFlow(
    businessId: string,
    input: UpdateSiteFlowBody,
  ): Promise<SiteFlowData> {
    const documentRef = this.siteFlowDocument(businessId);
    const snapshot = await documentRef.get();
    const existingFlow = snapshot.exists
      ? (snapshot.data() as SiteFlowData)
      : null;
    const now = getUTCTimeNow();
    const flow: SiteFlowData = {
      id: PRIMARY_SITE_FLOW_ID,
      businessId,
      modules: input.modules,
      createdAt: existingFlow?.createdAt ?? now,
      updatedAt: now,
    };

    await documentRef.set(flow);
    return flow;
  }

  static async createStarterFlowIfMissing(
    business: BusinessData & { category: BusinessCategoryTypes },
  ): Promise<SiteFlowData> {
    const documentRef = this.siteFlowDocument(business.id);

    return db().runTransaction(async (transaction) => {
      const snapshot = await transaction.get(documentRef);
      if (snapshot.exists) return snapshot.data() as SiteFlowData;

      const now = getUTCTimeNow();
      const modules: SiteFlowModuleData[] = starterModuleIdsByCategory[
        business.category
      ].map((moduleId) => ({
        flowId: moduleId,
        moduleId,
      }));
      const flow: SiteFlowData = {
        id: PRIMARY_SITE_FLOW_ID,
        businessId: business.id,
        modules,
        createdAt: now,
        updatedAt: now,
      };

      transaction.create(documentRef, flow);
      return flow;
    });
  }

  private static siteFlowDocument(businessId: string) {
    return db()
      .collection(COLLECTIONS.business)
      .doc(businessId)
      .collection(BUSINESS_SUBCOLLECTIONS.siteFlows)
      .doc(PRIMARY_SITE_FLOW_ID);
  }
}
