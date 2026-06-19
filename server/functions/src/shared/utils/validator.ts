import { RequestHandler } from "express";
import { z } from "zod";
import { ErrorResult } from "./api-response";
import { API_RESPONSE } from "./constants";

type RequestValidationSchemas = {
  body?: z.ZodType;
  params?: z.ZodType;
  query?: z.ZodType;
};

function formatZodIssues(error: z.ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}

function validateRequest(schemas: RequestValidationSchemas): RequestHandler {
  return (req, res, next) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as typeof req.params;
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as typeof req.query;
      }

      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const response = API_RESPONSE.invalidRequest;
        return ErrorResult(
          res,
          response.statusCode,
          response.message,
          response.code,
          formatZodIssues(error),
        );
      }

      return next(error);
    }
  };
}

export { validateRequest };
