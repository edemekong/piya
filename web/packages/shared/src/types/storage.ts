export type ImageContentType = "image/jpeg" | "image/png" | "image/webp";

export type UploadFileOptions<TBuffer = ArrayBuffer> = {
  buffer: TBuffer;
  contentType: string;
  destination: string;
};

export type DecodedBase64File<TBuffer = ArrayBuffer> = {
  buffer: TBuffer;
  contentType: ImageContentType;
};
