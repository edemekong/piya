import type { ImageContentType } from "./types/storage.type";

const ALLOWED_IMAGE_TYPES: ReadonlySet<ImageContentType> = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_BRAND_IMAGE_SIZE = 4 * 1024 * 1024;

export {
  ALLOWED_IMAGE_TYPES,
  MAX_BRAND_IMAGE_SIZE,
  MAX_PROFILE_IMAGE_SIZE,
};
