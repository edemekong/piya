import express = require("express");

import "./configs/firebase";
import { rateLimit } from "express-rate-limit";

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

const app = express();

app.use(CORSSettings);
app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW,
  max: RATE_LIMIT_MAX,
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
  validate: { trustProxy: false, xForwardedForHeader: false },
});

app.use(limiter);
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

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
