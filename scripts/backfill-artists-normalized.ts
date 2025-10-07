// scripts/backfill-artists-normalized.ts
import "dotenv/config"; // lee .env si existe
import { initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore, type DocumentData } from "firebase-admin/firestore";
import type { ServiceAccount } from "firebase-admin";

// ========================
//   Credenciales robustas
// ========================
type SA = ServiceAccount;

function fromBase64(): SA | null {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!b64) return null;
  try {
    const json = Buffer.from(b64, "base64").toString("utf-8");
    return JSON.parse(json) as SA;
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT malformado (no es base64/JSON válido).");
  }
}

function fromDiscrete(): SA | null {
  const pid = process.env.FIREBASE_PROJECT_ID;
  const email = process.env.FIREBASE_CLIENT_EMAIL;
  let key = process.env.FIREBASE_PRIVATE_KEY;

  if (!pid || !email || !key) return null;

  // Admite tanto clave con \n reales como con secuencias \n
  if (key.includes("\\n")) key = key.replace(/\\n/g, "\n");

  return {
    projectId: pid,
    clientEmail: email,
    privateKey: key,
  };
}

function makeApp() {
  // 1) GOOGLE_APPLICATION_CREDENTIALS → applicationDefault()
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const app = initializeApp({ credential: applicationDefault() });
    return app;
  }
  // 2) FIREBASE_SERVICE_ACCOUNT (JSON base64)
  const saB64 = fromBase64();
  if (saB64) {
    const app = initializeApp({ credential: cert(saB64) });
    return app;
  }
  // 3) Variables sueltas
  const saVars = fromDiscrete();
  if (saVars) {
    const app = initializeApp({ credential: cert(saVars) });
    return app;
  }
  // 4) Nada configurado → error claro
  throw new Error(
    "No hay credenciales. Configura una de estas opciones:\n" +
      "- GOOGLE_APPLICATION_CREDENTIALS con ruta al JSON\n" +
      "- FIREBASE_SERVICE_ACCOUNT (JSON en base64)\n" +
      "- FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY",
  );
}

const app = makeApp();
const db = getFirestore(app);

// ========================
//   Utilidades de tipado
// ========================
const toKey = (s: string) => (s ?? "").trim().toLowerCase();

type ArtistDoc = {
  city?: unknown;
  styles?: unknown;
};

const toStr = (v: unknown): string => (typeof v === "string" ? v : "");
const toStrArray = (v: unknown): string[] =>
  Array.isArray(v) ? (v.filter((x) => typeof x === "string") as string[]) : [];

// ========================
//   Backfill normalizado
// ========================
const BATCH_SIZE = 400;

(async () => {
  const snap = await db.collection("artists").get();
  console.log(`Encontrados ${snap.size} artistas. Actualizando...`);

  let batch = db.batch();
  let count = 0;

  for (const doc of snap.docs) {
    const d = doc.data() as DocumentData as ArtistDoc;

    const city_lc = toKey(toStr(d.city));
    const styles_lc = toStrArray(d.styles).map(toKey).filter(Boolean);

    batch.update(doc.ref, { city_lc, styles_lc });
    count++;

    if (count % BATCH_SIZE === 0) {
      await batch.commit();
      console.log(`Commit intermedio: ${count}`);
      batch = db.batch();
    }
  }

  if (count % BATCH_SIZE !== 0) {
    await batch.commit();
  }

  console.log(`Listo. Documentos actualizados: ${count}`);
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
