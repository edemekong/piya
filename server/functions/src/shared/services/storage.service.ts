import { randomUUID } from "crypto";
import { storage } from "../../configs/firebase";
import { MAX_BRAND_IMAGE_SIZE } from "../constants";
import type {
  BusinessBrandAssetType,
  DecodedBase64File,
  UploadFileOptions,
} from "../types/storage.type";
import {
  decodeBase64Image,
  extensionForContentType,
  validateImage,
} from "../utils/storage.utils";

class StorageService {
  static async uploadFile({
    buffer,
    contentType,
    destination,
  }: UploadFileOptions): Promise<string> {
    const bucket = storage().bucket();
    const file = bucket.file(destination);
    const downloadToken = randomUUID();

    await file.save(buffer, {
      resumable: false,
      contentType,
      metadata: {
        cacheControl: "public, max-age=31536000",
        metadata: {
          firebaseStorageDownloadTokens: downloadToken,
        },
      },
    });

    return [
      "https://firebasestorage.googleapis.com/v0/b/",
      encodeURIComponent(bucket.name),
      "/o/",
      encodeURIComponent(destination),
      `?alt=media&token=${downloadToken}`,
    ].join("");
  }

  static async uploadUserProfileImage(
    userId: string,
    file: DecodedBase64File,
  ): Promise<string> {
    validateImage(file);

    const extension = extensionForContentType(file.contentType);
    return this.uploadFile({
      buffer: file.buffer,
      contentType: file.contentType,
      destination: `users/${userId}/profile/profile.${extension}`,
    });
  }

  static async uploadBusinessBrandImage(
    businessId: string,
    asset: BusinessBrandAssetType,
    file: DecodedBase64File,
  ): Promise<string> {
    validateImage(file);
    if (file.buffer.length > MAX_BRAND_IMAGE_SIZE) {
      throw new Error("Brand image must not exceed 4 MB");
    }

    const extension = extensionForContentType(file.contentType);
    return this.uploadFile({
      buffer: file.buffer,
      contentType: file.contentType,
      destination: `business/${businessId}/branding/${asset}.${extension}`,
    });
  }

  static async uploadBusinessGiftImage(
    businessId: string,
    giftId: string,
    file: DecodedBase64File,
  ): Promise<string> {
    validateImage(file);

    const extension = extensionForContentType(file.contentType);
    return this.uploadFile({
      buffer: file.buffer,
      contentType: file.contentType,
      destination: `business/${businessId}/gifts/${giftId}/image.${extension}`,
    });
  }

  static decodeBase64Image(value: string): DecodedBase64File {
    return decodeBase64Image(value);
  }
}

export { StorageService };
