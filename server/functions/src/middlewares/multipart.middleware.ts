import { RequestHandler } from "express";
import multer from "multer";
import {
  MAX_PROFILE_IMAGE_SIZE,
} from "../shared/constants";
import { ErrorResult } from "../shared/utils/api-response";
import { API_RESPONSE } from "../shared/utils/constants";
import { isAllowedImageType } from "../shared/utils/storage.utils";

const profileImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_PROFILE_IMAGE_SIZE,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    if (!isAllowedImageType(file.mimetype)) {
      return callback(new Error("Only JPEG, PNG, and WebP images are allowed"));
    }

    return callback(null, true);
  },
}).single("profileImage");

const parseProfileImageUpload: RequestHandler = (req, res, next) => {
  if (!req.is("multipart/form-data")) return next();

  profileImageUpload(req, res, (error) => {
    if (!error) return next();

    const response = API_RESPONSE.invalidRequest;
    const message =
      error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE"
        ? "Profile image must not exceed 5 MB"
        : error.message;

    return ErrorResult(
      res,
      response.statusCode,
      response.message,
      response.code,
      [{ path: "profileImage", message }],
    );
  });
};

export { parseProfileImageUpload };
