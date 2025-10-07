// lib/data/artists.ts
import { db } from "@/lib/firebaseClient";
import {
  collection,
  getDocs,
  orderBy,
  limit,
  query,
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import type { ArtistCard, ArtistStyle } from "@/types/db";

const ALLOWED_STYLES: readonly ArtistStyle[] = [
  "blackwork",
  "fineline",
  "realism",
  "traditional",
  "neo-trad",
  "japanese",
  "dotwork",
  "watercolor",
  "lettering",
  "geometric",
  "minimal",
];

function isArtistStyle(x: unknown): x is ArtistStyle {
  return typeof x === "string" && (ALLOWED_STYLES as readonly string[]).includes(x);
}

const artistCardConverter: FirestoreDataConverter<ArtistCard> = {
  toFirestore(value: ArtistCard): DocumentData {
    return {
      name: value.name,
      city: value.city,
      styles: value.styles,
      rating: value.rating,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): ArtistCard {
    const d = snapshot.data();
    const rawStyles = Array.isArray(d?.styles) ? d.styles : [];
    const styles = rawStyles.filter(isArtistStyle);
    return {
      id: snapshot.id,
      name: String(d?.name ?? ""),
      city: String(d?.city ?? ""),
      styles,
      rating: Number(d?.rating ?? 0),
    };
  },
};

export async function getArtistsForSearch(): Promise<ArtistCard[]> {
  const col = collection(db, "artists").withConverter(artistCardConverter);
  const q = query(col, orderBy("rating", "desc"), limit(20));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data());
}
