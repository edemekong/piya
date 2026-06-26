import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { appConfig, assertConfigured } from "../config";

function assertBrowser() {
  if (typeof window === "undefined") {
    throw new Error("Firebase client services are only available in the browser");
  }
}

export function getFirebaseApp(): FirebaseApp {
  assertConfigured(appConfig.firebase.apiKey, "VITE_FIREBASE_API_KEY");
  assertConfigured(appConfig.firebase.projectId, "VITE_FIREBASE_PROJECT_ID");
  assertConfigured(appConfig.firebase.appId, "VITE_FIREBASE_APP_ID");

  return getApps().length > 0 ? getApp() : initializeApp(appConfig.firebase);
}

export function getFirebaseAuth(): Auth {
  assertBrowser();
  return getAuth(getFirebaseApp());
}

export function getFirebaseFirestore(): Firestore {
  return getFirestore(getFirebaseApp());
}

export function getFirebaseStorage(): FirebaseStorage {
  assertBrowser();
  return getStorage(getFirebaseApp());
}
