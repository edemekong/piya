import express = require("express");

import "./configs/firebase";
import { ipKeyGenerator, rateLimit } from "express-rate-limit";

import {
  CORSSettings,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW,
} from "./configs/server";
import { ErrorMiddleware, TenantMiddleware } from "./middlewares/middleware";
import { onRequest } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/options";
import { ApiRouter } from "./api/api-router";
import { ErrorResult } from "./shared/utils/api-response";
import { API_RESPONSE } from "./shared/utils/constants";
import { renderOTPVerificationEmail } from "./shared/email_templates/email-template-functions";

const app = express();

app.use(CORSSettings);
app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW,
  max: RATE_LIMIT_MAX,
  keyGenerator: (req) => {
    const requestIp = Reflect.get(req, "ip") as string | undefined;
    const forwardedFor = req.headers["x-forwarded-for"];
    const forwardedIp = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor?.split(",")[0]?.trim();
    const ip = requestIp ?? forwardedIp ?? req.socket.remoteAddress;

    return ip ? ipKeyGenerator(ip) : "local";
  },
  handler: (req, res) => {
    const error = API_RESPONSE.rateLimited;
    return ErrorResult(
      res,
      error.statusCode,
      error.message,
      error.code,
    );
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { ip: false, trustProxy: false, xForwardedForHeader: false },
});

app.use(limiter);
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

if (process.env.FUNCTIONS_EMULATOR === "true") {
  app.get("/__dev/email-preview/otp", (req, res) => {
    const userName =
      typeof req.query.userName === "string" ? req.query.userName : "Paul";
    const otpCode =
      typeof req.query.code === "string" ? req.query.code : "123456";
    const expiresIn =
      typeof req.query.expiresIn === "string"
        ? Number(req.query.expiresIn)
        : undefined;

    res
      .type("html")
      .send(
        renderOTPVerificationEmail({
          userName,
          otpCode,
          expiresIn: Number.isFinite(expiresIn) ? expiresIn : undefined,
        }),
      );
  });
}

app.use(TenantMiddleware);
app.use(ApiRouter);

app.use("*", (req, res) => {
  const error = API_RESPONSE.endpointNotFound;
  return ErrorResult(res, error.statusCode, error.message, error.code);
});

app.use(ErrorMiddleware);

setGlobalOptions({ region: "europe-west3" });

export const api = onRequest(
  {
    concurrency: 1,
    cors: true,
    memory: "1GiB",
    timeoutSeconds: 300,
  },
  app,
);
