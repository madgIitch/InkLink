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
      id: "artist_ber_kael",
      name: "Kael Noir",
      city: "Berlin",
      styles: ["blackwork", "geometric", "dotwork"],
      lat: 52.5156,
      lng: 13.3777,
      rating: 4.9,
      portfolio: [
        {
          imageUrl: "https://images.unsplash.com/photo-1612817159949-195b6c8e2e03",
          title: "Simetría fractal",
          description: "Diseño mandálico con trazos perfectos.",
          tags: ["blackwork", "geometric"],
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1598289431523-194ac7c7986d",
          title: "Pez koi",
          description: "Tradicional reinterpretado en blackwork.",
          tags: ["blackwork", "japanese"],
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1533055640609-24b498cdfd53",
          title: "Cráneo floral",
          description: "Simbología natural con sombreado intenso.",
          tags: ["blackwork", "floral", "dotwork"],
        },
      ],
    },
    {
      id: "artist_ber_sasha",
      name: "Sasha Void",
      city: "Berlin",
      styles: ["blackwork", "fineline"],
      lat: 52.5321,
      lng: 13.405,
      rating: 4.6,
      portfolio: [
        {
          imageUrl: "https://images.unsplash.com/photo-1612817159394-8a43e84b87e1",
          title: "Figura femenina",
          description: "Trazos finos con relleno en negro sólido.",
          tags: ["blackwork", "fineline"],
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1579034272158-efd0f55b16f5",
          title: "Ojo simbólico",
          description: "Motivo surrealista inspirado en Goya.",
          tags: ["blackwork", "surreal"],
        },
      ],
    },
    {
      id: "artist_ber_ivy",
      name: "Ivy Shadows",
      city: "Berlin",
      styles: ["blackwork", "dotwork"],
      lat: 52.5074,
      lng: 13.3903,
      rating: 4.8,
      portfolio: [
        {
          imageUrl: "https://images.unsplash.com/photo-1595526114035-9b44c3a2a1ff",
          title: "Botánico abstracto",
          description: "Ramas y hojas con textura de puntos.",
          tags: ["blackwork", "botanical"],
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1595526114117-57c23fdbd8f1",
          title: "Constelación",
          description: "Composición astral en técnica dotwork.",
          tags: ["blackwork", "dotwork", "cosmic"],
        },
      ],
    },
    {
      id: "artist_ber_nero",
      name: "Nero Atelier",
      city: "Berlin",
      styles: ["blackwork", "ornamental"],
      lat: 52.495,
      lng: 13.41,
      rating: 5.0,
      portfolio: [
        {
          imageUrl: "https://images.unsplash.com/photo-1522336572468-97b06e8ef143",
          title: "Manga ornamental",
          description: "Brazalete con patrones inspirados en arte islámico.",
          tags: ["blackwork", "ornamental"],
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1621905251912-8ce0e4c89a0e",
          title: "Simetría tribal",
          description: "Motivo tribal con líneas precisas.",
          tags: ["blackwork", "tribal"],
        },
      ],
    },
    {
      id: "artist_ber_mara",
      name: "Mara Line",
      city: "Berlin",
      styles: ["blackwork", "minimal"],
      lat: 52.5213,
      lng: 13.4285,
      rating: 4.5,
      portfolio: [
        {
          imageUrl: "https://images.unsplash.com/photo-1584907797075-7e3e10ad29d8",
          title: "Silencio",
          description: "Composición mínima inspirada en Bauhaus.",
          tags: ["blackwork", "minimal"],
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1612817159435-06c6e9b147d5",
          title: "Círculos",
          description: "Formas abstractas en disposición radial.",
          tags: ["blackwork", "abstract"],
        },
      ],
    },
  ];

  const batch = db.batch();

  for (const a of artists) {
    const artistRef = db.collection("artists").doc(a.id);
    const { portfolio, ...artistData } = a;
    batch.set(artistRef, artistData, { merge: true });

    for (const p of portfolio) {
      const ref = artistRef.collection("portfolio").doc();
      batch.set(ref, { ...p, createdAt: new Date() });
    }
  }

  await batch.commit();
  console.log("✅ Seed de artistas de Berlín (blackwork) completado.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
