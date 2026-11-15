export type IGallerySize = "tall" | "wide" | "small" | "medium" | "large" | "small-wide" | "small-tall" | "medium-wide" | "medium-tall";

/** Row of `Galeria`. */
export interface IGalleryItem {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
  size: IGallerySize;
  link_url?: string | null;
  link_tytul?: string | null;
}

export type IGalleryItemRequest = Omit<IGalleryItem, "id">;
