// components/SearchBar.tsx
"use client";

import { useId, useState, FormEvent } from "react";

export type SearchBarProps = {
  onSearch: (params: { city: string; style: string }) => Promise<void> | void;
  initialCity?: string;
  initialStyle?: string;
  /**
   * Lista opcional de estilos para autocompletar/validar.
   * Si se pasa, se usa <datalist>.
   */
  stylesList?: string[];
  className?: string;
};

export default function SearchBar({
  onSearch,
  initialCity = "",
  initialStyle = "",
  stylesList,
  className = "",
}: SearchBarProps) {
  const [city, setCity] = useState(initialCity);
  const [style, setStyle] = useState(initialStyle);
  const [loading, setLoading] = useState(false);

  const cityId = useId();
  const styleId = useId();
  const listId = useId();

  const canSubmit = city.trim().length > 0 && style.trim().length > 0 && !loading;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      setLoading(true);
      await onSearch({ city: city.trim(), style: style.trim() });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Buscar tatuadores por ciudad y estilo"
      className={`flex w-full flex-col gap-3 sm:flex-row sm:items-end ${className}`}
    >
      <div className="flex-1">
        <label htmlFor={cityId} className="block text-sm font-medium">
          Ciudad
        </label>
        <input
          id={cityId}
          name="city"
          placeholder="Ej. Berlin"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          autoComplete="address-level2"
          className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
          aria-required="true"
        />
      </div>

      <div className="flex-1">
        <label htmlFor={styleId} className="block text-sm font-medium">
          Estilo
        </label>
        <input
          id={styleId}
          name="style"
          placeholder="Ej. fineline, blackwork…"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          list={stylesList && stylesList.length ? listId : undefined}
          className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
          aria-required="true"
        />
        {stylesList && stylesList.length > 0 && (
          <datalist id={listId}>
            {stylesList.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        )}
      </div>

      <div className="sm:w-32">
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-xl border bg-black px-4 py-2 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          aria-disabled={!canSubmit}
          aria-busy={loading || undefined}
        >
          {loading ? "Buscando…" : "Buscar"}
        </button>
        {/* Estado en vivo para lectores de pantalla */}
        <div aria-live="polite" className="sr-only">
          {loading ? "Buscando resultados" : "Listo para buscar"}
        </div>
      </div>
    </form>
  );
}
