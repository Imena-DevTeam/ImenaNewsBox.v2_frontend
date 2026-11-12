import type { RemoteImage } from "@/types/media";

/** One photograph inside an album. */
export interface Photo extends RemoteImage {
  id: string;
  /** ISO date the photograph was taken. */
  takenOn: string;
  event: string;
  location: string;
  tagged: string[];
}

/** An album in the family gallery. */
export interface Album {
  id: string;
  slug: string;
  title: string;
  location: string;
  /** ISO date. */
  takenOn: string;
  description: string;
  /** The card's photograph. One of `photos`, by id. */
  coverId?: string;
  photos: Photo[];
  photoCount: number;
}

/** What the create and rename forms send. */
export interface AlbumInput {
  title: string;
  location: string;
  takenOn: string;
  description?: string;
  coverId?: string;
}
