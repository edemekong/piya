import {
  FieldPath,
  type DocumentData,
  type Query,
} from "firebase-admin/firestore";
import { db } from "../../configs/firebase";
import type { OfferingData } from "../model/offering";
import type {
  CreateOfferingBody,
  GetOfferingsQuery,
  UpdateOfferingBody,
} from "../schema/offering.schema";
import { ApiError } from "../utils/api-response";
import { BUSINESS_SUBCOLLECTIONS, COLLECTIONS } from "../utils/collections";
import { API_RESPONSE } from "../utils/constants";
import { getUTCTimeNow } from "../utils/helpers/helper-functions";

type OfferingCursor = {
  createdAt: number;
  id: string;
};

type OfferingPage = {
  offerings: OfferingData[];
  nextCursor: string | null;
  hasNextPage: boolean;
};

export class OfferingService {
  static async getOfferings(
    businessId: string,
    input: GetOfferingsQuery,
  ): Promise<OfferingPage> {
    const searchToken = input.query
      ? this.normalizeSearchValue(input.query)
      : null;
    let baseQuery: Query<DocumentData> = this.offeringsCollection(businessId)
      .orderBy("createdAt", "desc")
      .orderBy(FieldPath.documentId(), "desc");

    if (searchToken) {
      baseQuery = baseQuery.where(
        "searchTokens",
        "array-contains",
        searchToken,
      );
    }
    if (input.status) baseQuery = baseQuery.where("status", "==", input.status);
    if (input.type) baseQuery = baseQuery.where("type", "==", input.type);
    if (input.subType) {
      baseQuery = baseQuery.where("subType", "==", input.subType);
    }
    if (input.categoryId) {
      baseQuery = baseQuery.where("category.id", "==", input.categoryId);
    }
    if (input.tag) {
      baseQuery = baseQuery.where("tags", "array-contains", input.tag);
    }

    if (input.cursor) {
      const cursor = this.decodeOfferingCursor(input.cursor);
      baseQuery = baseQuery.startAfter(cursor.createdAt, cursor.id);
    }

    const snapshot = await baseQuery.limit(input.limit + 1).get();
    const matchedOfferings = snapshot.docs.map(
      (document) => document.data() as OfferingData,
    );
    const offerings = matchedOfferings.slice(0, input.limit);
    const hasNextPage = snapshot.size > input.limit;
    const lastOffering = offerings[offerings.length - 1];

    return {
      offerings,
      hasNextPage,
      nextCursor:
        hasNextPage && lastOffering
          ? this.encodeOfferingCursor({
              createdAt: lastOffering.createdAt,
              id: lastOffering.id,
            })
          : null,
    };
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
      searchTokens: this.getOfferingSearchTokens(input),
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
      searchTokens: this.getOfferingSearchTokens(input),
      updatedAt: getUTCTimeNow(),
    };

    await offeringRef.set(offering);
    return offering;
  }

  static async deleteOffering(params: {
    businessId: string;
    offeringId: string;
  }): Promise<"deleted" | "in-use" | "not-found"> {
    const { businessId, offeringId } = params;
    const offeringRef = this.offeringsCollection(businessId).doc(offeringId);
    const snapshot = await offeringRef.get();
    if (!snapshot.exists) return "not-found";

    const discountsSnapshot = await db()
      .collection(COLLECTIONS.business)
      .doc(businessId)
      .collection(BUSINESS_SUBCOLLECTIONS.discounts)
      .where("rules.offeringIds", "array-contains", offeringId)
      .limit(1)
      .get();
    if (!discountsSnapshot.empty) return "in-use";

    await offeringRef.delete();
    return "deleted";
  }

  private static offeringsCollection(businessId: string) {
    return db()
      .collection(COLLECTIONS.business)
      .doc(businessId)
      .collection(BUSINESS_SUBCOLLECTIONS.offerings);
  }

  private static encodeOfferingCursor(cursor: OfferingCursor) {
    return Buffer.from(JSON.stringify(cursor)).toString("base64url");
  }

  private static decodeOfferingCursor(cursor: string): OfferingCursor {
    try {
      const value = JSON.parse(
        Buffer.from(cursor, "base64url").toString("utf8"),
      ) as Partial<OfferingCursor>;
      if (
        typeof value.createdAt === "number" &&
        Number.isFinite(value.createdAt) &&
        typeof value.id === "string" &&
        value.id.length > 0
      ) {
        return { createdAt: value.createdAt, id: value.id };
      }
    } catch {
      // Return the standardized invalid request response below.
    }

    const response = API_RESPONSE.invalidRequest;
    throw new ApiError(response.statusCode, response.message, response.code);
  }

  private static getOfferingSearchTokens(
    input: Pick<OfferingData, "category" | "name" | "tags">,
  ) {
    const tokens = new Set<string>();
    const normalizedName = this.normalizeSearchValue(input.name);

    this.addPrefixes(tokens, normalizedName);
    normalizedName
      .split(" ")
      .filter(Boolean)
      .forEach((word) => this.addPrefixes(tokens, word));

    if (input.category?.name) {
      this.addPrefixes(tokens, this.normalizeSearchValue(input.category.name));
    }

    input.tags.forEach((tag) => {
      this.addPrefixes(tokens, this.normalizeSearchValue(tag));
    });

    return Array.from(tokens).filter(Boolean);
  }

  private static addPrefixes(tokens: Set<string>, value: string) {
    for (let index = 1; index <= value.length; index += 1) {
      tokens.add(value.slice(0, index));
    }
  }

  private static normalizeSearchValue(value: string) {
    return value.trim().toLocaleLowerCase().replace(/\s+/g, " ");
  }
}
