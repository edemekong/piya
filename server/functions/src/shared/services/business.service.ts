import { db } from "../../configs/firebase";
import type {
  BusinessBranding,
  BusinessBrandingData,
  BusinessData,
  MemberData,
} from "../model/business";
import type { UserData } from "../model/user";
import type {
  AccountSetupBrandDetailsBody,
  AccountSetupBusinessProfileBody,
} from "../schema/account-setup.schema";
import { ApiError } from "../utils/api-response";
import { BUSINESS_SUBCOLLECTIONS, COLLECTIONS } from "../utils/collections";
import { API_RESPONSE } from "../utils/constants";
import { getUTCTimeNow } from "../utils/helpers/helper-functions";
import { StorageService } from "./storage.service";

type BusinessBrand = {
  businessId: string;
};

type UpsertBusinessProfileResult = {
  business: BusinessData;
  user: UserData;
};

export class BusinessService {
  static async getBrandConfig(hostname: string): Promise<BusinessBrand | null> {
    return null;
  }

  static async getBusiness(businessId?: string | null): Promise<BusinessData | null> {
    if (!businessId) return null;

    const snapshot = await this.businessDocument(businessId).get();
    if (!snapshot.exists) return null;

    return snapshot.data() as BusinessData;
  }

  static async getMember(
    businessId: string,
    memberId: string,
  ): Promise<MemberData | null> {
    const snapshot = await this.businessDocument(businessId)
      .collection(BUSINESS_SUBCOLLECTIONS.members)
      .doc(memberId)
      .get();

    if (!snapshot.exists) return null;

    return snapshot.data() as MemberData;
  }

  static async getBusinessBranding(
    businessId?: string | null,
  ): Promise<BusinessBrandingData | null> {
    if (!businessId) return null;

    const snapshot = await this.businessDocument(businessId)
      .collection(BUSINESS_SUBCOLLECTIONS.branding)
      .doc("config")
      .get();

    if (!snapshot.exists) return null;

    return snapshot.data() as BusinessBrandingData;
  }

  static async upsertBusinessProfileForUser(
    user: UserData,
    data: AccountSetupBusinessProfileBody,
  ): Promise<UpsertBusinessProfileResult> {
    const now = getUTCTimeNow();
    const primaryBusinessId = user.business?.businessIds[0];
    const businessRef = primaryBusinessId
      ? this.businessDocument(primaryBusinessId)
      : this.businessCollection().doc();
    const snapshot = await businessRef.get();
    const existingBusiness = snapshot.exists
      ? (snapshot.data() as BusinessData)
      : null;
    const category = data.category ?? existingBusiness?.category;
    const logo = data.logo ?? existingBusiness?.logo;

    const business: BusinessData = {
      id: businessRef.id,
      name: data.name,
      ...(category ? { category } : {}),
      createdBy: existingBusiness?.createdBy ?? user.id,
      ...(logo ? { logo } : {}),
      domain: data.domain,
      description: data.description,
      email: data.email ?? existingBusiness?.email ?? null,
      phoneNumber: data.phoneNumber ?? existingBusiness?.phoneNumber ?? null,
      serviceLocations: existingBusiness?.serviceLocations ?? [],
      status: existingBusiness?.status ?? "pending",
      branding: existingBusiness?.branding ?? null,
      createdAt: existingBusiness?.createdAt ?? now,
      updatedAt: now,
    };
    const businessIds = user.business?.businessIds ?? [];
    const nextBusinessIds = businessIds.includes(business.id)
      ? businessIds
      : [business.id, ...businessIds];
    const updatedUser: UserData = {
      ...user,
      business: {
        businessIds: nextBusinessIds,
        businessRoleTypes: {
          ...user.business?.businessRoleTypes,
          [business.id]: ["admin"],
        },
      },
      updatedAt: now,
    };

    const member: MemberData = {
      id: user.id,
      businessId: business.id,
      name: user.name || data.name,
      email: user.email,
      role: "owner",
      permission: "edit",
      createdAt: now,
      updatedAt: now,
    };

    const batch = db().batch();
    batch.set(businessRef, business, { merge: true });
    batch.set(
      db().collection(COLLECTIONS.users).doc(user.id),
      {
        business: updatedUser.business,
        updatedAt: updatedUser.updatedAt,
      },
      { merge: true },
    );
    batch.set(
      businessRef.collection(BUSINESS_SUBCOLLECTIONS.members).doc(user.id),
      member,
      { merge: true },
    );
    await batch.commit();

    return { business, user: updatedUser };
  }

  static async updateBusinessBranding(
    businessId: string,
    data: AccountSetupBrandDetailsBody,
  ): Promise<BusinessData | null> {
    const businessRef = this.businessDocument(businessId);
    const snapshot = await businessRef.get();

    if (!snapshot.exists) return null;

    const now = getUTCTimeNow();
    const existingBusiness = snapshot.data() as BusinessData;
    const existingBranding = await this.getBusinessBranding(businessId);
    const uploadedAssets = await this.uploadBrandImages(businessId, data);
    const branding: BusinessBranding = {
      logo:
        uploadedAssets.logo ??
        data.logo ??
        existingBranding?.logo ??
        existingBusiness.branding?.logo ??
        null,
      favicon:
        uploadedAssets.favicon ??
        data.favicon ??
        existingBranding?.favicon ??
        existingBusiness.branding?.favicon ??
        null,
      coverImage:
        uploadedAssets.coverImage ??
        data.coverImage ??
        existingBranding?.coverImage ??
        existingBusiness.branding?.coverImage ??
        null,
      primaryColor:
        data.primaryColor ??
        existingBranding?.primaryColor ??
        existingBusiness.branding?.primaryColor,
      secondaryColor:
        data.secondaryColor ??
        existingBranding?.secondaryColor ??
        existingBusiness.branding?.secondaryColor ??
        null,
      accentColor:
        data.accentColor ??
        existingBranding?.accentColor ??
        existingBusiness.branding?.accentColor ??
        null,
      socialLinks:
        data.socialLinks ??
        existingBranding?.socialLinks ??
        existingBusiness.branding?.socialLinks ??
        null,
    };
    const business: BusinessData = {
      ...existingBusiness,
      logo: branding.logo ?? existingBusiness.logo,
      branding,
      updatedAt: now,
    };

    const batch = db().batch();
    batch.set(businessRef, business, { merge: true });
    batch.set(
      businessRef.collection(BUSINESS_SUBCOLLECTIONS.branding).doc("config"),
      {
        ...branding,
        id: "config",
        businessId,
        createdAt: existingBranding?.createdAt ?? now,
        updatedAt: now,
      },
      { merge: true },
    );
    await batch.commit();

    return business;
  }

  private static async uploadBrandImages(
    businessId: string,
    data: AccountSetupBrandDetailsBody,
  ) {
    try {
      const logoFile = data.logoBase64
        ? StorageService.decodeBase64Image(data.logoBase64)
        : null;
      const faviconFile = data.faviconBase64
        ? StorageService.decodeBase64Image(data.faviconBase64)
        : null;
      const coverImageFile = data.coverImageBase64
        ? StorageService.decodeBase64Image(data.coverImageBase64)
        : null;

      const [logo, favicon, coverImage] = await Promise.all([
        logoFile
          ? StorageService.uploadBusinessBrandImage(
              businessId,
              "logo",
              logoFile,
            )
          : null,
        faviconFile
          ? StorageService.uploadBusinessBrandImage(
              businessId,
              "favicon",
              faviconFile,
            )
          : null,
        coverImageFile
          ? StorageService.uploadBusinessBrandImage(
              businessId,
              "cover-image",
              coverImageFile,
            )
          : null,
      ]);

      return { logo, favicon, coverImage };
    } catch (error) {
      const response = API_RESPONSE.invalidRequest;
      throw new ApiError(
        response.statusCode,
        error instanceof Error ? error.message : response.message,
        response.code,
      );
    }
  }

  private static businessDocument(businessId: string) {
    return this.businessCollection().doc(businessId);
  }

  private static businessCollection() {
    return db().collection(COLLECTIONS.business);
  }
}
