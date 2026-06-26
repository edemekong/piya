import type { FirebaseWebConfig, ImportMetaWithEnv } from "../types";

function readEnv(name: string, fallback = "") {
  return ((import.meta as ImportMetaWithEnv).env?.[name] ?? fallback).trim();
}

export const appConfig = {
  name: "Piya",
  adminName: "Piya",
  portalName: "Piya Portal",
  apiBaseUrl: readEnv("VITE_API_BASE_URL"),
  mapApiKey: readEnv("VITE_GOOGLE_MAPS_API_KEY"),
  firebase: {
    apiKey: readEnv("VITE_FIREBASE_API_KEY"),
    authDomain: readEnv("VITE_FIREBASE_AUTH_DOMAIN"),
    projectId: readEnv("VITE_FIREBASE_PROJECT_ID"),
    storageBucket: readEnv("VITE_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: readEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
    appId: readEnv("VITE_FIREBASE_APP_ID"),
  } satisfies FirebaseWebConfig,
};

export function assertConfigured(value: string, name: string) {
  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}
