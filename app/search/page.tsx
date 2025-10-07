// app/search/page.tsx
"use client";
import { useEffect, useState } from "react";
import { getArtistsForSearch } from "@/lib/data/artists";
import type { ArtistCard } from "@/types/db";

export default function SearchPage() {
  const [artists, setArtists] = useState<ArtistCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArtistsForSearch()
      .then(setArtists)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading…</div>;

  return (
    <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
      {artists.map((a) => (
        <div key={a.id} className="rounded-2xl border p-4">
          <div className="text-lg font-semibold">{a.name}</div>
          <div className="text-sm opacity-70">{a.city}</div>
          <div className="mt-2 text-sm">⭐ {a.rating.toFixed(1)}</div>
          <div className="mt-2 text-xs">{a.styles.join(" · ")}</div>
        </div>
      ))}
    </div>
  );
}
