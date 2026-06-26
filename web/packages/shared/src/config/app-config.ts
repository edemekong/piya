import type { FirebaseWebConfig } from "../types";
import { getEnvBoolean, getEnvString } from "./env-config";

const useFirebaseEmulators = getEnvBoolean("VITE_USE_FIREBASE_EMULATORS");
const emulatorApiBaseUrl = "http://localhost:5001/getpiyaapp/europe-west3/api";

export const appConfig = {
  name: "Piya",
  apiBaseUrl: useFirebaseEmulators
    ? emulatorApiBaseUrl
    : getEnvString("VITE_API_BASE_URL"),
  useFirebaseEmulators,
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
