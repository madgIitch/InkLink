import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "node:fs";
import path from "node:path";

const keyPath = path.resolve(process.cwd(), "credentials/serviceAccountKey.json");
if (!fs.existsSync(keyPath)) throw new Error(`No serviceAccountKey.json en: ${keyPath}`);
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf-8"));

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function run() {
  // 1–2 artistas con campos solicitados + portfolio de ejemplo
  const artists = [
    {
      id: "artist_ber_luna",
      name: "Luna Ink",
      city: "Berlin",
      styles: ["blackwork", "dotwork", "minimal"],
      lat: 52.520008,
      lng: 13.404954,
      rating: 4.7,
      portfolio: [
        {
          imageUrl: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e",
          title: "Rosa blackwork",
          description: "Líneas limpias y sombreado suave.",
          tags: ["blackwork", "floral"],
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1517960413843-0aee8e2b3285",
          title: "Geométrico",
          description: "Figura geométrica minimalista.",
          tags: ["geometric", "minimal"],
        },
      ],
    },
    {
      id: "artist_sev_maria",
      name: "María Fine",
      city: "Sevilla",
      styles: ["fineline", "lettering"],
      lat: 37.389092,
      lng: -5.984459,
      rating: 4.8,
      portfolio: [
        {
          imageUrl: "https://images.unsplash.com/photo-1520975922131-c8a8fdd61e3c",
          title: "Lettering clásico",
          description: "Tipografía serif con ornamentos.",
          tags: ["lettering"],
        },
      ],
    },
  ];

  const batch = db.batch();

  for (const a of artists) {
    const artistRef = db.collection("artists").doc(a.id);
    const { portfolio, ...artistData } = a;
    batch.set(artistRef, artistData, { merge: true });

    // subcolección /portfolio
    for (const p of portfolio) {
      const ref = artistRef.collection("portfolio").doc();
      batch.set(ref, {
        ...p,
        createdAt: new Date(),
      });
    }
  }

  await batch.commit();
  console.log("✅ Seed de artistas + portfolio completado.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
