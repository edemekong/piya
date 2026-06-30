import { db } from "../../configs/firebase";
import type { BadgeData } from "../model/badge";
import type {
  CreateBadgeBody,
  UpdateBadgeBody,
} from "../schema/badge.schema";
import { BUSINESS_SUBCOLLECTIONS, COLLECTIONS } from "../utils/collections";
import { getUTCTimeNow } from "../utils/helpers/helper-functions";

const defaultBadges: BadgeData[] = [
  {
    id: "gold",
    businessId: "default",
    name: "Gold",
    description: "For customers with strong repeat purchase activity.",
    icon: "gold-scallop-seal",
    rule: { metric: "points_at_least", value: 3000 },
    createdBy: "system",
    createdAt: 0,
  },
  {
    id: "silver",
    businessId: "default",
    name: "Silver",
    description: "For customers crossing the first meaningful points level.",
    icon: "blue-shield-ribbon",
    rule: { metric: "points_at_least", value: 1500 },
    createdBy: "system",
    createdAt: 0,
  },
  {
    id: "new",
    businessId: "default",
    name: "New",
    description: "Default badge for customers starting the loyalty journey.",
    icon: "sage-round-seal",
    rule: { metric: "points_at_least", value: 0 },
    createdBy: "system",
    createdAt: 0,
  },
];

const defaultBadgeIds = new Set(defaultBadges.map((badge) => badge.id));

export class BadgeService {
  static isDefaultBadge(badgeId: string) {
    return defaultBadgeIds.has(badgeId);
  }

  static async getBadges(businessId: string): Promise<BadgeData[]> {
    const snapshot = await this.badgesCollection(businessId)
      .orderBy("createdAt", "desc")
      .get();
    const customBadges = snapshot.docs.map(
      (document) => document.data() as BadgeData
    );

    return [
      ...defaultBadges.map((badge) => ({ ...badge, businessId })),
      ...customBadges,
    ];
  }

  static async createBadge(params: {
    businessId: string;
    createdBy: string;
    input: CreateBadgeBody;
  }): Promise<BadgeData> {
    const { businessId, createdBy, input } = params;
    const badgeRef = this.badgesCollection(businessId).doc();
    const badge: BadgeData = {
      id: badgeRef.id,
      businessId,
      name: input.name,
      description: input.description,
      icon: input.icon,
      rule: input.rule,
      createdBy,
      createdAt: getUTCTimeNow(),
    };

    await badgeRef.create(badge);
    return badge;
  }

  static async updateBadge(params: {
    badgeId: string;
    businessId: string;
    input: UpdateBadgeBody;
  }): Promise<BadgeData | null> {
    const { badgeId, businessId, input } = params;
    if (this.isDefaultBadge(badgeId)) return null;

    const badgeRef = this.badgesCollection(businessId).doc(badgeId);
    const snapshot = await badgeRef.get();
    if (!snapshot.exists) return null;

    const existingBadge = snapshot.data() as BadgeData;
    const badge: BadgeData = {
      ...existingBadge,
      name: input.name,
      description: input.description,
      icon: input.icon,
      rule: input.rule,
    };

    await badgeRef.set(badge);
    return badge;
  }

  static async deleteBadge(params: {
    badgeId: string;
    businessId: string;
  }): Promise<"deleted" | "default" | "not-found"> {
    const { badgeId, businessId } = params;
    if (this.isDefaultBadge(badgeId)) return "default";

    const badgeRef = this.badgesCollection(businessId).doc(badgeId);
    const snapshot = await badgeRef.get();
    if (!snapshot.exists) return "not-found";

    await badgeRef.delete();
    return "deleted";
  }

  private static badgesCollection(businessId: string) {
    return db()
      .collection(COLLECTIONS.business)
      .doc(businessId)
      .collection(BUSINESS_SUBCOLLECTIONS.badges);
  }
}
