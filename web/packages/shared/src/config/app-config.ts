import type { FirebaseWebConfig } from "../types";
import { getEnvBoolean, getEnvString } from "./env-config";

export const appConfig = {
  name: "Piya",
  apiBaseUrl: getEnvString("VITE_API_BASE_URL"),
  useFirebaseEmulators: getEnvBoolean("VITE_USE_FIREBASE_EMULATORS"),
  mapApiKey: getEnvString("VITE_GOOGLE_MAPS_API_KEY"),
  firebase: {
    apiKey: getEnvString("VITE_FIREBASE_API_KEY"),
    authDomain: getEnvString("VITE_FIREBASE_AUTH_DOMAIN"),
    projectId: getEnvString("VITE_FIREBASE_PROJECT_ID"),
    storageBucket: getEnvString("VITE_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: getEnvString("VITE_FIREBASE_MESSAGING_SENDER_ID"),
    appId: getEnvString("VITE_FIREBASE_APP_ID"),
  } satisfies FirebaseWebConfig,
};
