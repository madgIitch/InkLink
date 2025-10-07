import React from "react";
import GlassCard from "./ui/GlassCard";
import { RatingStars } from "./RatingStars";

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

export type ArtistCardProps = {
  id: string;
  name: string;
  city: string;
  styles: ArtistStyle[];
  rating: number;
};

export default function ArtistCard({ name, city, styles, rating }: ArtistCardProps) {
  return (
    <GlassCard
      role="listitem"
      className="p-5 transition-all hover:-translate-y-0.5 hover:shadow-xl"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-semibold tracking-tight text-slate-900">{name}</h3>
      </div>

      <p className="mt-1 text-slate-600">{city}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {styles.map((s) => (
          <span key={s} className="chip text-slate-700">
            {s}
          </span>
        ))}
      </div>

      <div className="mt-4">
        <RatingStars value={rating} />
      </div>
    </GlassCard>
  );
}
