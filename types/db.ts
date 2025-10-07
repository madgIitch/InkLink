// types/db.ts

// ---- Tipos de dominio ----
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

// Artista completo (documento principal)
export interface Artist {
  id: string; // doc id
  name: string;
  city: string;
  styles: ArtistStyle[];
  lat: number;
  lng: number;
  rating: number; // 0..5
}

// Ítems del portfolio (subcolección de artist)
export interface PortfolioItem {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  tags: string[];
  createdAt?: Date;
}

// Usuario de la app
export type UserRole = "client" | "artist";

export interface AppUser {
  id: string; // auth uid
  name: string;
  email: string;
  role: UserRole;
  favorites: string[]; // artist ids
}

// Tarjeta ligera para listados/búsqueda
export type ArtistCard = { id: string } & Pick<Artist, "name" | "city" | "styles" | "rating">;
