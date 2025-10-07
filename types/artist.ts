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

export interface Artist {
  id: string; // doc id
  name: string;
  city: string; // p.ej. "Berlin"
  styles: ArtistStyle[];
  lat: number;
  lng: number;
  rating: number; // 0..5
}
