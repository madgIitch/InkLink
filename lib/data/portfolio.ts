// lib/data/portfolio.ts
import { db } from "@/lib/firebaseClient";
import {
  collection,
  getDocs,
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import type { PortfolioItem } from "@/types/db";

const portfolioConverter: FirestoreDataConverter<PortfolioItem> = {
  toFirestore(value: PortfolioItem): DocumentData {
    return {
      imageUrl: value.imageUrl,
      title: value.title,
      description: value.description,
      tags: value.tags,
      createdAt: value.createdAt,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): PortfolioItem {
    const d = snapshot.data();
    return {
      id: snapshot.id,
      imageUrl: String(d?.imageUrl ?? ""),
      title: d?.title !== undefined ? String(d.title) : undefined,
      description: d?.description !== undefined ? String(d.description) : undefined,
      tags: Array.isArray(d?.tags) ? d.tags.map((t: unknown) => String(t)) : [],
      createdAt: typeof d?.createdAt?.toDate === "function" ? d.createdAt.toDate() : undefined,
    };
  },
};

export async function getPortfolio(artistId: string): Promise<PortfolioItem[]> {
  const col = collection(db, "artists", artistId, "portfolio").withConverter(portfolioConverter);
  const snap = await getDocs(col);
  return snap.docs.map((doc) => doc.data());
}
