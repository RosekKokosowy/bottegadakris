import "server-only";

import { revalidateTag, unstable_cache } from "next/cache";
import { IGalleryItem, IGalleryItemRequest } from "@/types/IGalleryItem";
import { execute, select } from "./db.inc";

export const GALLERY_TAG = "gallery";

export const findGalleryItems = () => select<IGalleryItem>(`SELECT * FROM Galeria ORDER BY id DESC`);

export const getGalleryItems = unstable_cache(findGalleryItems, [GALLERY_TAG], { tags: [GALLERY_TAG], revalidate: 3600 });

export async function findGalleryItem(id: number): Promise<IGalleryItem | undefined> {
  const [item] = await select<IGalleryItem>(`SELECT * FROM Galeria WHERE id = ? LIMIT 1`, [id]);
  return item;
}

const values = ({ src, alt, title, description, size, link_url, link_tytul }: IGalleryItemRequest) => [src, alt, title, description, size, link_url ?? null, link_tytul ?? null];

export async function createGalleryItem(item: IGalleryItemRequest): Promise<number> {
  const { insertId } = await execute(`INSERT INTO Galeria (src, alt, title, description, size, link_url, link_tytul) VALUES (?, ?, ?, ?, ?, ?, ?)`, values(item));
  revalidateTag(GALLERY_TAG, "max");
  return insertId;
}

export async function updateGalleryItem(id: number, item: IGalleryItemRequest): Promise<boolean> {
  const { affectedRows } = await execute(`UPDATE Galeria SET src=?, alt=?, title=?, description=?, size=?, link_url=?, link_tytul=? WHERE id=?`, [...values(item), id]);
  revalidateTag(GALLERY_TAG, "max");
  return affectedRows > 0;
}

export async function deleteGalleryItem(id: number): Promise<boolean> {
  const { affectedRows } = await execute(`DELETE FROM Galeria WHERE id = ?`, [id]);
  revalidateTag(GALLERY_TAG, "max");
  return affectedRows > 0;
}
