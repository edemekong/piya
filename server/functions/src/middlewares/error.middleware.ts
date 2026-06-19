import { ErrorRequestHandler } from "express";
import { ApiError, ErrorResult } from "../shared/utils/api-response";
import { API_RESPONSE } from "../shared/utils/constants";

export const ErrorMiddleware: ErrorRequestHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof ApiError) {
    console.error(`[${req.method}] ${req.originalUrl}:`, error);
    return ErrorResult(
      res,
      error.statusCode,
      error.message,
      error.code,
      error.details,
    );
  }

  console.error(`[${req.method}] ${req.originalUrl}:`, error);
  const serverError = API_RESPONSE.serverError;
  return ErrorResult(
    res,
    serverError.statusCode,
    serverError.message,
    serverError.code,
  );
};
