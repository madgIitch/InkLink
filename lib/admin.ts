// lib/admin.ts
import { App, cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { getAuth } from "firebase-admin/auth";
import { firebaseConfig } from "./firebaseConfig";

function must(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

let adminApp: App;

if (!getApps().length) {
  const jsonB64 = must("FIREBASE_SERVICE_ACCOUNT_B64");
  const serviceAccount = JSON.parse(Buffer.from(jsonB64, "base64").toString("utf8"));

  adminApp = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: firebaseConfig.storageBucket,
  });
} else {
  adminApp = getApp();
}

export const adminDb = getFirestore(adminApp);
export const adminStorage = getStorage(adminApp);
export const adminAuth = getAuth(adminApp);
