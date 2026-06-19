import { Request, Response, NextFunction } from "express";
import { auth } from "../configs/firebase";
import { ErrorResult } from "../shared/utils/api-response";
import { API_RESPONSE } from "../shared/utils/constants";

export const getAuthToken = (req: Request): string | undefined => {
  const headerToken = req.headers["x-access-token"];
  if (typeof headerToken === "string" && headerToken.trim().length > 0) {
    return headerToken;
  }

  const authorization = req.headers.authorization;
  if (authorization) {
    const [scheme, value] = authorization.split(" ");
    if (scheme?.toLowerCase() === "bearer" && value) return value;
  }

  const bodyToken = req.body?.token;
  if (typeof bodyToken === "string" && bodyToken.trim().length > 0) {
    return bodyToken;
  }

  const queryToken = req.query.token;
  if (typeof queryToken === "string" && queryToken.trim().length > 0) {
    return queryToken;
  }

  return undefined;
};

const attachCurrentUser = async (req: Request, token: string) => {
  const firebaseUser = await auth().verifyIdToken(token);
  const currentUser = await auth().getUser(firebaseUser.uid);

  req.currentUser = currentUser;
  req.body ??= {};
  req.body.token = currentUser.uid;
  req.query.token = currentUser.uid;
  req.body.user = currentUser;
};

export const OptionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = getAuthToken(req);
  if (!token) return next();

  try {
    await attachCurrentUser(req, token);
  } catch (e) {
    console.log(e);
    const error = API_RESPONSE.unauthorized;
    return ErrorResult(res, error.statusCode, error.message, error.code);
  }

  return next();
};

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = getAuthToken(req);

    if (!token) {
      const error = API_RESPONSE.authTokenRequired;
      return ErrorResult(res, error.statusCode, error.message, error.code);
    }

    await attachCurrentUser(req, token);
  } catch (e) {
    console.log(e);
    const error = API_RESPONSE.unauthorized;
    return ErrorResult(res, error.statusCode, error.message, error.code);
  }

  return next();
};
