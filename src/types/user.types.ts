import { Timestamp } from 'firebase/firestore';

export type UserType = 'client' | 'tattoo_artist';

export interface Location {
  city: string;
  country: string;
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface Availability {
  acceptingClients: boolean;
  schedule?: string;
}

export interface SocialMedia {
  instagram?: string;
  portfolio?: string;
}

export interface ArtistProfile {
  bio: string;
  styles: string[];
  yearsOfExperience: number;
  priceRange: PriceRange;
  availability: Availability;
  socialMedia?: SocialMedia;
}

export interface User {
  uid: string;
  email: string;
  userType: UserType;
  displayName: string;
  photoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Common fields
  phone?: string;
  location?: Location;

  // Only for tattoo artists
  artistProfile?: ArtistProfile;
}

export interface CreateUserData {
  uid: string;
  email: string;
  userType: UserType;
  displayName: string;
  photoURL?: string;
}

export interface UpdateUserData {
  displayName?: string;
  photoURL?: string;
  phone?: string;
  location?: Location;
  artistProfile?: Partial<ArtistProfile>;
}
