// /app/api/search/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

export type ArtistPublic = {
  id: string;
  name: string;
  city: string; // Sugerencia: mantener también cityLower en documento para búsquedas case-insensitive
  styles: string[];
  rating: number; // 0..5
};

// Util: clamp
const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

// Util: extraer mensaje de error sin usar `any`
function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Internal error";
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const cityRaw = (searchParams.get("city") ?? "").trim();
    const styleRaw = (searchParams.get("style") ?? "").trim();
    const limitParam = Number.parseInt(searchParams.get("limit") ?? "20", 10);

    // Normalización mínima (sin suponer case-insensitive si no existe cityLower en BD)
    const city = cityRaw;
    const style = styleRaw;

    // Validar y acotar `limit`
    const limit = Number.isFinite(limitParam) ? clamp(limitParam, 1, 50) : 20;

    // Exigir al menos un filtro para evitar full scans
    if (!city && !style) {
      return NextResponse.json(
        { error: "Provide at least one filter: ?city=... or ?style=..." },
        { status: 400 },
      );
    }

    // Construcción de query
    let q: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = db.collection("artists");

    if (city) {
      // Si guardas cityLower en tus documentos, usa esta línea:
      // q = q.where("cityLower", "==", city.toLowerCase());
      q = q.where("city", "==", city);
    }
    if (style) {
      q = q.where("styles", "array-contains", style);
    }

    q = q.limit(limit);

    const snap = await q.get();

    // Mapear documentos a la forma pública
    const artists: ArtistPublic[] = snap.docs.map((d) => {
      const data = d.data() as {
        name?: unknown;
        city?: unknown;
        styles?: unknown;
        rating?: unknown;
      };

      const name = typeof data.name === "string" ? data.name : "Unknown";
      const cityVal = typeof data.city === "string" ? data.city : "";
      const stylesArr = Array.isArray(data.styles)
        ? (data.styles.filter((s) => typeof s === "string") as string[])
        : [];
      const ratingNum = typeof data.rating === "number" ? data.rating : Number(data.rating ?? 0);

      const item: ArtistPublic = {
        id: d.id,
        name,
        city: cityVal,
        styles: stylesArr,
        rating: Number.isFinite(ratingNum) ? ratingNum : 0,
      };

      return item;
    });

    return NextResponse.json({ artists }, { status: 200 });
  } catch (err: unknown) {
    console.error("[/api/search] error:", err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
