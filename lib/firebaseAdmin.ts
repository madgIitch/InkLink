// lib/firebaseAdmin.ts
import { getApps, initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let _db: Firestore | null = null;

type ServiceAccountShape = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

function parseServiceAccount(): ServiceAccountShape | null {
  // Opción A: JSON base64 en FIREBASE_SERVICE_ACCOUNT
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (b64) {
    const json = Buffer.from(b64, "base64").toString("utf-8");
    return JSON.parse(json) as ServiceAccountShape;
  }

  // Opción B: variables sueltas
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
  if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
    return {
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.includes("\\n")
        ? FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
        : FIREBASE_PRIVATE_KEY,
    };
  }
  return null;
}

function ensureInit(): void {
  if (_db) return;

  // 1) Si hay GOOGLE_APPLICATION_CREDENTIALS (ruta al JSON), usamos applicationDefault()
  const hasGac = Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS);

  if (getApps().length === 0) {
    if (hasGac) {
      initializeApp({ credential: applicationDefault() });
    } else {
      const sa = parseServiceAccount();
      if (!sa) {
        throw new Error(
          "[firebaseAdmin] Faltan credenciales. Define GOOGLE_APPLICATION_CREDENTIALS o FIREBASE_SERVICE_ACCOUNT (base64) o FIREBASE_PROJECT_ID/EMAIL/PRIVATE_KEY.",
        );
      }
      initializeApp({ credential: cert(sa) });
    }
  }

  _db = getFirestore();
}

export const db: Firestore = (() => {
  ensureInit();
  return _db!;
})();
