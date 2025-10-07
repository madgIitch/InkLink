// /app/search/page.tsx
import React from "react";

type ArtistPublic = {
  id: string;
  name: string;
  city: string;
  styles: string[];
  rating: number;
};

async function fetchArtists(city: string, style: string, limit = 20): Promise<ArtistPublic[]> {
  const params = new URLSearchParams();
  if (city) params.set("city", city);
  if (style) params.set("style", style);
  params.set("limit", String(limit));

  // Server Component: fetch relativo funciona y evita depender de BASE_URL
  const res = await fetch(`/api/search?${params.toString()}`, { cache: "no-store" });
  if (res.status === 400) {
    const { error } = (await res.json()) as { error: string };
    throw new Error(error);
  }
  if (!res.ok) {
    throw new Error(`Search failed: ${res.status}`);
  }
  const json = (await res.json()) as { artists: ArtistPublic[] };
  return json.artists;
}

export default async function SearchPage() {
  // TODO: lee de searchParams o de tu SearchBar; fijo para ejemplo:
  const city = "Berlin";
  const style = "fineline";
  const results = await fetchArtists(city, style, 20);

  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Resultados</h1>
      {results.length === 0 ? (
        <p className="opacity-70">No se encontraron artistas con esos filtros.</p>
      ) : (
        <ul className="space-y-3">
          {results.map((d) => (
            <li key={d.id} className="rounded-xl border p-4">
              <div className="font-medium">{d.name}</div>
              <div className="text-sm opacity-80">
                {d.city} — {d.styles.join(", ")}
              </div>
              <div className="text-sm">⭐ {d.rating.toFixed(1)}</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
