// /app/search/page.tsx
import React from "react";
import type { ArtistPublic } from "../api/search/route"; // o duplica el tipo localmente

async function fetchArtists(city: string, style: string, limit = 20): Promise<ArtistPublic[]> {
  const params = new URLSearchParams({ city, style, limit: String(limit) });
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/search?${params.toString()}`,
    {
      // Si esta page es Server Component, fetch en server OK.
      // Si es Client Component, quita el uso de process.env aquí y usa ruta relativa.
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  return (await res.json()) as ArtistPublic[];
}

export default async function SearchPage() {
  const city = "Berlin";
  const style = "fineline";
  const results = await fetchArtists(city, style, 20);

  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Resultados</h1>
      <ul className="space-y-3">
        {results.map((d: ArtistPublic) => (
          <li key={d.id} className="rounded-xl border p-4">
            <div className="font-medium">{d.name}</div>
            <div className="text-sm opacity-80">
              {d.city} — {d.styles.join(", ")}
            </div>
            <div className="text-sm">⭐ {d.rating.toFixed(1)}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
