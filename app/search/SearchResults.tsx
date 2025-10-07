// app/search/SearchResults.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
// Si NO tienes configurado el alias "@", cambia esta línea por:
// import ArtistCard, { ArtistCardSkeleton } from "../../components/ArtistCard";
// import SearchBar from "../../components/SearchBar";
import ArtistCard, { ArtistCardSkeleton } from "@/components/ArtistCard";
import SearchBar from "@/components/SearchBar";

export type ArtistStyle =
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

export type Artist = {
  id: string;
  name: string;
  city: string;
  styles: ArtistStyle[];
  rating: number; // 0..5
};

function buildQuery(city: string, style: string) {
  const sp = new URLSearchParams();
  if (city) sp.set("city", city);
  if (style) sp.set("style", style);
  return sp.toString();
}

export default function SearchResults({
  initialCity = "",
  initialStyle = "",
}: {
  initialCity?: string;
  initialStyle?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // valores controlados por el formulario (sincronizados con URL)
  const [city, setCity] = useState(initialCity);
  const [style, setStyle] = useState(initialStyle);

  // estado de datos
  const [data, setData] = useState<Artist[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // lee los valores actuales de la URL
  const urlCity = searchParams.get("city") ?? "";
  const urlStyle = searchParams.get("style") ?? "";

  // sincroniza los inputs con la URL al navegar/volver
  useEffect(() => {
    setCity(urlCity);
    setStyle(urlStyle);
  }, [urlCity, urlStyle]);

  const fetchArtists = useCallback(async (c: string, s: string) => {
    const qs = buildQuery(c, s);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/artists?${qs}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as { artists: Artist[] };
      setData(json.artists);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : typeof e === "string" ? e : "Network error";
      setError(msg);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // carga inicial y cada vez que cambian los params de URL
  useEffect(() => {
    if (!urlCity && !urlStyle) {
      setData([]);
      setError(null);
      setLoading(false);
      return;
    }
    fetchArtists(urlCity, urlStyle);
  }, [urlCity, urlStyle, fetchArtists]);

  // submit de la SearchBar => navega a /search?city=&style=
  const handleSearch = useCallback(
    ({ city: c, style: s }: { city: string; style: string }) => {
      const qs = buildQuery(c, s);
      router.push(`${pathname}?${qs}`);
    },
    [router, pathname],
  );

  const hasFilters = useMemo(() => !!(city || style), [city, style]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold">Resultados de búsqueda</h1>

      <SearchBar
        onSearch={handleSearch}
        initialCity={city}
        initialStyle={style}
        stylesList={[
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
        ]}
        className="mb-6"
      />

      {/* Loading */}
      {loading && (
        <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={`sk-${i}`}>
              <ArtistCardSkeleton />
            </li>
          ))}
        </ul>
      )}

      {/* Error recuperable */}
      {!loading && error && (
        <div
          role="alert"
          className="rounded-xl border border-red-800/50 bg-red-900/20 p-4 text-red-100"
        >
          <p className="font-medium">No se pudieron cargar los resultados.</p>
          <p className="text-sm opacity-80">{error}</p>
          <button
            onClick={() => fetchArtists(urlCity, urlStyle)}
            className="mt-3 rounded-lg border border-red-700/60 px-3 py-1.5 text-sm hover:bg-red-900/30"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Vacío con filtros */}
      {!loading && !error && hasFilters && data && data.length === 0 && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-6 text-zinc-300"
        >
          <p className="font-medium">No hay artistas que coincidan con los filtros.</p>
          <p className="text-sm opacity-80">Prueba con otra ciudad o estilo.</p>
        </div>
      )}

      {/* Lista de resultados (o nada si no hay filtros) */}
      {!loading && !error && (!hasFilters || (data && data.length > 0)) && (
        <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(data ?? []).map((a: Artist) => (
            <li key={a.id}>
              <ArtistCard
                id={a.id}
                name={a.name}
                city={a.city}
                styles={a.styles}
                rating={a.rating}
                href={`/artist/${a.id}`}
                aria-label={`Artista ${a.name} en ${a.city}`}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
