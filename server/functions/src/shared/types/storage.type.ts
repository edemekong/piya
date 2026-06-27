type ImageContentType = "image/jpeg" | "image/png" | "image/webp";
type BusinessBrandAssetType = "logo" | "favicon" | "cover-image";

type UploadFileOptions = {
  buffer: Buffer;
  contentType: string;
  destination: string;
};

type DecodedBase64File = {
  buffer: Buffer;
  contentType: ImageContentType;
};

export {
  BusinessBrandAssetType,
  DecodedBase64File,
  ImageContentType,
  UploadFileOptions,
};
