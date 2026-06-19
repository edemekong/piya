import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { getMessaging } from "firebase-admin/messaging";
import { credential } from "firebase-admin";
import { finalConfiguration } from "./configurations";

import service_account_dev = require("../../1bee-dev-adminsdk.json");
import service_account_prod = require("../../1bee-prod-adminsdk.json");

let app: ReturnType<typeof initializeApp> | null = null;

function getApp() {
  if (!app) {
    const { STORAGE_BUCKET, ENV } = finalConfiguration();
    const isProd = ENV === "prod";

    const serviceAccount = isProd ? service_account_prod : service_account_dev;

    app = initializeApp({
      credential: credential.cert(serviceAccount as any),
      storageBucket: STORAGE_BUCKET,
    });
  }
  return app;
}

export const auth = () => getAuth(getApp());
export const db = () => getFirestore(getApp());
export const storage = () => getStorage(getApp());
export const messaging = () => getMessaging(getApp());
