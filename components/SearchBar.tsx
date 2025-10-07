"use client";
import React from "react";
import GlassCard from "./ui/GlassCard";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const sp = useSearchParams();
  const [city, setCity] = React.useState(sp.get("city") ?? "Berlin");
  const [style, setStyle] = React.useState(sp.get("style") ?? "blackwork");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qs = new URLSearchParams({ city, style }).toString();
    router.push(`/search?${qs}`);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <GlassCard className="p-5">
        <label className="block font-medium text-slate-700">Ciudad</label>
        <input
          className="input-glass mt-2 w-full rounded-xl px-4 py-2 text-slate-800 outline-none"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Berlin"
        />
      </GlassCard>

      <GlassCard className="p-5">
        <form onSubmit={onSubmit} className="grid grid-cols-[1fr_auto] gap-3">
          <div>
            <label className="block font-medium text-slate-700">Estilo</label>
            <input
              className="input-glass mt-2 w-full rounded-xl px-4 py-2 text-slate-800 outline-none"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="blackwork"
            />
          </div>
          <button
            type="submit"
            className="h-10 self-end rounded-xl bg-blue-600 px-5 font-medium text-white transition hover:bg-blue-700 active:scale-[0.99]"
            aria-label="Buscar"
          >
            Buscar
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
