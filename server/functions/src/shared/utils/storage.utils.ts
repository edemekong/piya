import {
  ALLOWED_IMAGE_TYPES,
  MAX_PROFILE_IMAGE_SIZE,
} from "../constants";
import type {
  DecodedBase64File,
  ImageContentType,
} from "../types/storage.type";

const BASE64_IMAGE_PATTERN =
  /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=\s]+)$/;

function isAllowedImageType(
  contentType: string,
): contentType is ImageContentType {
  return ALLOWED_IMAGE_TYPES.has(contentType as ImageContentType);
}

function decodeBase64Image(value: string): DecodedBase64File {
  const match = value.match(BASE64_IMAGE_PATTERN);

  if (!match) {
    throw new Error("Image must be a JPEG, PNG, or WebP base64 data URI");
  }

  const file: DecodedBase64File = {
    contentType: match[1] as ImageContentType,
    buffer: Buffer.from(match[2].replace(/\s/g, ""), "base64"),
  };

  validateImage(file);
  return file;
}

function validateImage(file: DecodedBase64File) {
  if (!isAllowedImageType(file.contentType)) {
    throw new Error("Only JPEG, PNG, and WebP images are allowed");
  }

  if (file.buffer.length === 0) {
    throw new Error("Image is empty");
  }

  if (file.buffer.length > MAX_PROFILE_IMAGE_SIZE) {
    throw new Error("Image must not exceed 5 MB");
  }

  if (!matchesImageSignature(file.buffer, file.contentType)) {
    throw new Error("Image content does not match its file type");
  }
}

function extensionForContentType(contentType: ImageContentType) {
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  return "jpg";
}

function matchesImageSignature(
  buffer: Buffer,
  contentType: ImageContentType,
) {
  if (contentType === "image/jpeg") {
    return (
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff
    );
  }

  if (contentType === "image/png") {
    return (
      buffer.length >= 8 &&
      buffer.subarray(0, 8).equals(
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      )
    );
  }

  return (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  );
}

export {
  decodeBase64Image,
  extensionForContentType,
  isAllowedImageType,
  matchesImageSignature,
  validateImage,
};
