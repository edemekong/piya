type ImageContentType = "image/jpeg" | "image/png" | "image/webp";

type UploadFileOptions = {
  buffer: Buffer;
  contentType: string;
  destination: string;
};

type DecodedBase64File = {
  buffer: Buffer;
  contentType: ImageContentType;
};

export { DecodedBase64File, ImageContentType, UploadFileOptions };
