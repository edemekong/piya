import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "./constants";

type ApiResponseBody<T = unknown> = {
  status: 0 | 1;
  message: string;
  code?: string;
  data?: T;
  details?: unknown;
};

type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

class ApiError extends Error {
  statusCode: number;
  code?: string;
  details?: unknown;

  constructor(
    statusCode: number,
    message: string,
    code?: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

function SuccessResult<T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = STATUS_CODES.ok,
  code?: string,
) {
  const body: ApiResponseBody<T | null> = {
    status: 0,
    message,
    data: data ?? null,
  };

  if (code) {
    body.code = code;
  }

  return res.status(statusCode).send(body);
}

function ErrorResult(
  res: Response,
  statusCode: number,
  message: string,
  code?: string,
  details?: unknown,
) {
  const body: ApiResponseBody = {
    status: 1,
    message,
  };

  if (code) {
    body.code = code;
  }

  if (details) {
    body.details = details;
  }

  return res.status(statusCode).send(body);
}

function asyncHandler(handler: AsyncRouteHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

export { ApiError, asyncHandler, ErrorResult, SuccessResult };
