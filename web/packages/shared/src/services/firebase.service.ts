import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  getFirestore,
  type Firestore,
} from "firebase/firestore";
import {
  connectStorageEmulator,
  getStorage,
  type FirebaseStorage,
} from "firebase/storage";
import { appConfig, requireConfigValue } from "../config";

const FIREBASE_EMULATOR_HOST = "localhost";
const AUTH_EMULATOR_URL = `http://${FIREBASE_EMULATOR_HOST}:9099`;
const FIRESTORE_EMULATOR_PORT = 8080;
const STORAGE_EMULATOR_PORT = 9199;

let authEmulatorConnected = false;
let firestoreEmulatorConnected = false;
let storageEmulatorConnected = false;

export function getFirebaseApp(): FirebaseApp {
  requireConfigValue(appConfig.firebase.apiKey, "VITE_FIREBASE_API_KEY");
  requireConfigValue(appConfig.firebase.projectId, "VITE_FIREBASE_PROJECT_ID");
  requireConfigValue(appConfig.firebase.appId, "VITE_FIREBASE_APP_ID");

  return getApps().length > 0 ? getApp() : initializeApp(appConfig.firebase);
}

export function getFirebaseAuth(): Auth {
  if (typeof window === "undefined") {
    throw new Error(
      "Firebase client services are only available in the browser",
    );
  }

  const auth = getAuth(getFirebaseApp());

  if (appConfig.useFirebaseEmulators && !authEmulatorConnected) {
    connectAuthEmulator(auth, AUTH_EMULATOR_URL, { disableWarnings: true });
    authEmulatorConnected = true;
  }

  return auth;
}

export function getFirebaseFirestore(): Firestore {
  const firestore = getFirestore(getFirebaseApp());

  if (
    appConfig.useFirebaseEmulators &&
    typeof window !== "undefined" &&
    !firestoreEmulatorConnected
  ) {
    connectFirestoreEmulator(
      firestore,
      FIREBASE_EMULATOR_HOST,
      FIRESTORE_EMULATOR_PORT,
    );
    firestoreEmulatorConnected = true;
  }

  return firestore;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (typeof window === "undefined") {
    throw new Error(
      "Firebase client services are only available in the browser",
    );
  }
  const storage = getStorage(getFirebaseApp());

  if (appConfig.useFirebaseEmulators && !storageEmulatorConnected) {
    connectStorageEmulator(
      storage,
      FIREBASE_EMULATOR_HOST,
      STORAGE_EMULATOR_PORT,
    );
    storageEmulatorConnected = true;
  }

  return storage;
}
