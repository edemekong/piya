import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { getMessaging } from "firebase-admin/messaging";
import { finalConfiguration } from "./configurations";

let app: ReturnType<typeof initializeApp> | null = null;

function getApp() {
  if (!app) {
    const { STORAGE_BUCKET } = finalConfiguration();

    app = initializeApp({
      storageBucket: STORAGE_BUCKET,
    });
  }
  return app;
}

export const auth = () => getAuth(getApp());
export const db = () => getFirestore(getApp());
export const storage = () => getStorage(getApp());
export const messaging = () => getMessaging(getApp());
