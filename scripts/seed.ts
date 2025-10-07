// scripts/seed.ts
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import path from "node:path";
import fs from "node:fs";

const keyPath = path.resolve(process.cwd(), "credentials/serviceAccountKey.json");
if (!fs.existsSync(keyPath)) {
  throw new Error(`Service account JSON no encontrado en: ${keyPath}`);
}

const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf-8"));

initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();

async function run() {
  const artists = [
    {
      id: "artist_ber_luna",
      name: "Luna Ink",
      city: "Berlin",
      styles: ["blackwork", "dotwork"],
      lat: 52.520008,
      lng: 13.404954,
      rating: 4.7,
    },
    {
      id: "artist_ber_akira",
      name: "Akira Studio",
      city: "Berlin",
      styles: ["japanese", "neo-trad"],
      lat: 52.51212,
      lng: 13.45,
      rating: 4.5,
    },
    {
      id: "artist_sev_maria",
      name: "María Fine",
      city: "Sevilla",
      styles: ["fineline", "minimal"],
      lat: 37.389092,
      lng: -5.984459,
      rating: 4.8,
    },
  ];

  const users = [
    {
      id: "test_uid_pepe",
      name: "Pepe Roldán",
      email: "pepe@example.com",
      role: "client",
      favorites: ["artist_ber_luna", "artist_ber_akira"],
    },
    {
      id: "test_uid_luna",
      name: "Luna (Artist)",
      email: "luna@inklink.com",
      role: "artist",
      favorites: [],
    },
  ];

  const batch = db.batch();
  for (const a of artists) {
    batch.set(db.collection("artists").doc(a.id), a, { merge: true });
  }
  for (const u of users) {
    batch.set(db.collection("users").doc(u.id), u, { merge: true });
  }

  await batch.commit();
  console.log("✅ Seed completado.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
