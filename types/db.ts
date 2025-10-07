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
  city: string;
  styles: ArtistStyle[];
  lat: number;
  lng: number;
  rating: number; // 0..5
}

export type UserRole = "client" | "artist";

export interface AppUser {
  id: string; // auth uid
  name: string;
  email: string;
  role: UserRole;
  favorites: string[]; // artist ids
}

export type ArtistCard = Pick<Artist, "name" | "city" | "styles" | "rating"> & {
  id: string;
};
