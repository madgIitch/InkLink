// /app/api/search/route.ts
import { NextResponse } from "next/server";
import { z, type ZodIssue } from "zod";
import { db } from "@/lib/firebaseAdmin"; // ✅ usa db (no getDb)
import type { Firestore } from "firebase-admin/firestore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ArtistStyle =
  | "blackwork"
  | "fineline"
  | "realism"
  | "traditional"
  | "neo-trad"
  | "japanese"
  | "dotwork"
  | "watercolor"
  | "lettering"
  | "geometric"
  | "minimal";

export type ArtistPublic = {
  id: string;
  name: string;
  city: string;
  styles: ArtistStyle[];
  lat: number;
  lng: number;
  rating: number;
};

const toKey = (s: string) => s.trim().toLowerCase();
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const QuerySchema = z.object({
  city: z.string().trim().min(1, "city es obligatorio"),
  style: z.string().trim().min(1, "style es obligatorio"),
  limit: z
    .string()
    .optional()
    .transform((v: string | undefined) => (v ? parseInt(v, 10) : 50))
    .pipe(
      z
        .number()
        .int()
        .positive()
        .transform((n: number) => clamp(n, 1, 100)),
    ),
});

type UnknownDoc = Record<string, unknown> & { id?: unknown };

function stripPrivate(doc: UnknownDoc): ArtistPublic {
  return {
    id: String(doc.id),
    name: typeof doc.name === "string" ? doc.name : "",
    city: typeof doc.city === "string" ? doc.city : "",
    styles: Array.isArray(doc.styles) ? (doc.styles as ArtistStyle[]) : [],
    lat: typeof doc.lat === "number" ? doc.lat : Number(doc.lat ?? 0),
    lng: typeof doc.lng === "number" ? doc.lng : Number(doc.lng ?? 0),
    rating: typeof doc.rating === "number" ? doc.rating : Number(doc.rating ?? 0),
  };
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const parsed = QuerySchema.safeParse({
    city: url.searchParams.get("city"),
    style: url.searchParams.get("style"),
    limit: url.searchParams.get("limit") ?? undefined,
  });

  if (!parsed.success) {
    const message =
      parsed.error.issues.map((i: ZodIssue) => i.message).join(", ") || "Parámetros inválidos";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { city, style, limit } = parsed.data;
  const cKey = toKey(city);
  const sKey = toKey(style);

  try {
    if (!db) throw new Error("Firestore no inicializado");
    const col = (db as Firestore).collection("artists");

    const qSnap = await col
      .where("city_lc", "==", cKey)
      .where("styles_lc", "array-contains", sKey)
      .limit(limit)
      .get();

    const items = qSnap.docs.map(
      (d): ArtistPublic =>
        stripPrivate({ id: d.id, ...(d.data() as Record<string, unknown>) } as UnknownDoc),
    );

    return NextResponse.json(items, {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (err) {
    console.warn("[/api/search] Fallback por error:", (err as Error)?.message);
    return NextResponse.json([], { status: 200 });
  }
}
