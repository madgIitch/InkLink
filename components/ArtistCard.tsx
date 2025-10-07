import * as React from "react";
import Link from "next/link";
import { Star } from "lucide-react";

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

export type ArtistCardProps = {
  id?: string;
  name: string;
  city: string;
  styles: ArtistStyle[];
  rating: number; // 0..5, admite medios (e.g., 4.5)
  href?: string; // si se pasa, la tarjeta será navegable
  onClick?: () => void;
  className?: string;
  // a11y
  "aria-label"?: string;
};

/**
 * ArtistCard — tarjeta accesible para mostrar un artista en los resultados.
 *
 * Accesibilidad:
 * - role="article" y aria-label descriptivo
 * - Navegable por teclado (tabIndex=0 cuando no hay <a>)
 * - Orden semántico: título (h3) → metadatos → chips → rating
 */
export const ArtistCard = React.memo(function ArtistCard({
  id,
  name,
  city,
  styles,
  rating,
  href,
  onClick,
  className = "",
  ...a11y
}: ArtistCardProps) {
  const content = (
    <article
      role="article"
      {...a11y}
      className={[
        "group relative w-full rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-4 shadow-sm outline-none",
        "hover:border-zinc-700 hover:bg-zinc-900/60",
        "focus-visible:ring-2 focus-visible:ring-indigo-500",
        className,
      ].join(" ")}
      tabIndex={href ? -1 : 0}
      data-testid="artist-card"
    >
      <header className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold tracking-tight text-zinc-100">{name}</h3>
        <RatingStars value={rating} />
      </header>

      <p className="mt-1 text-sm text-zinc-400">
        <span aria-label="Ciudad" className="inline-flex items-center gap-1">
          <span className="i-lucide-map-pin inline-block h-4 w-4 align-middle opacity-70" />
          {city}
        </span>
      </p>

      {/* Chips de estilos */}
      <ul className="mt-3 flex flex-wrap gap-2" aria-label="Estilos del artista">
        {styles.map((s) => (
          <li key={`${id ?? name}-${s}`} role="listitem">
            <Chip label={s} />
          </li>
        ))}
      </ul>

      {/* Rating en texto invisible para lectores de pantalla */}
      <span className="sr-only" aria-live="polite">
        Puntuación {rating} sobre 5
      </span>
    </article>
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className="block no-underline focus:outline-none"
        role="listitem"
        aria-label={a11y["aria-label"] ?? `Ver perfil de ${name}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div role="listitem" onClick={onClick} className="block">
      {content}
    </div>
  );
});

function Chip({ label }: { label: string }) {
  return (
    <span
      className="rounded-full border border-zinc-700/60 bg-zinc-900/60 px-2.5 py-0.5 text-xs font-medium text-zinc-200 shadow-sm"
      aria-label={`Estilo ${label}`}
    >
      {label}
    </span>
  );
}

/**
 * Componente de estrellas con soporte de medios puntos.
 */
function RatingStars({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(5, value));
  const full = Math.floor(clamped);
  const hasHalf = clamped - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center" aria-label={`Rating ${clamped} de 5`}>
      {[...Array(full)].map((_, i) => (
        <StarIcon key={`full-${i}`} state="full" />
      ))}
      {hasHalf && <StarIcon state="half" />}
      {[...Array(empty)].map((_, i) => (
        <StarIcon key={`empty-${i}`} state="empty" />
      ))}
      <span className="ml-2 text-xs text-zinc-400 tabular-nums">{clamped.toFixed(1)}</span>
    </div>
  );
}

function StarIcon({ state }: { state: "full" | "half" | "empty" }) {
  if (state === "full")
    return <Star aria-hidden className="h-4 w-4 fill-yellow-400/90 text-yellow-400" />;
  if (state === "half")
    return (
      <span className="relative inline-block h-4 w-4">
        {/* fondo vacío */}
        <Star aria-hidden className="absolute inset-0 h-4 w-4 text-zinc-600" />
        {/* mitad rellena */}
        <Star
          aria-hidden
          className="absolute inset-0 h-4 w-4 fill-yellow-400/90 text-yellow-400"
          style={{ clipPath: "inset(0 50% 0 0)" }}
        />
      </span>
    );
  return <Star aria-hidden className="h-4 w-4 text-zinc-600" />;
}

/**
 * Skeleton de carga para estados de fetching.
 */
export function ArtistCardSkeleton() {
  return (
    <div
      role="article"
      aria-busy="true"
      aria-label="Cargando artista"
      className="w-full animate-pulse rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-4"
    >
      <div className="flex items-start justify-between">
        <div className="h-4 w-40 rounded bg-zinc-800/80" />
        <div className="h-4 w-16 rounded bg-zinc-800/80" />
      </div>
      <div className="mt-2 h-3 w-24 rounded bg-zinc-800/80" />
      <div className="mt-3 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-zinc-800/80" />
        <div className="h-6 w-20 rounded-full bg-zinc-800/80" />
        <div className="h-6 w-14 rounded-full bg-zinc-800/80" />
      </div>
    </div>
  );
}

/** Ejemplo de uso (pista):
 *
 * <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
 *   {isLoading
 *     ? Array.from({ length: 6 }).map((_, i) => (
 *         <li key={`sk-${i}`}><ArtistCardSkeleton /></li>
 *       ))
 *     : artists.map(a => (
 *         <li key={a.id}>
 *           <ArtistCard
 *             id={a.id}
 *             name={a.name}
 *             city={a.city}
 *             styles={a.styles}
 *             rating={a.rating}
 *             href={`/artist/${a.id}`}
 *             aria-label={`Artista ${a.name} en ${a.city}`}
 *           />
 *         </li>
 *       ))}
 * </ul>
 */
export default ArtistCard;
