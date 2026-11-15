import "server-only";

import { revalidateTag, unstable_cache } from "next/cache";
import { IWorkshop } from "@/types/IWorkshop";
import { execute, num, select } from "./db.inc";

export const WORKSHOPS_TAG = "workshops";

/** Active workshops with prices. Cached; admin price changes revalidate WORKSHOPS_TAG. */
export const getWorkshops = unstable_cache(
  async (): Promise<IWorkshop[]> => {
    const rows = await select<IWorkshop>(`SELECT * FROM warsztaty WHERE status='AKTYWNY'`);
    return rows.map((row) => ({ ...row, cena: num(row.cena) }));
  },
  [WORKSHOPS_TAG],
  { tags: [WORKSHOPS_TAG], revalidate: 3600 },
);

export async function getWorkshopById(id: number): Promise<IWorkshop | undefined> {
  return (await getWorkshops()).find((workshop) => workshop.id === id);
}

/** Changes a workshop price (admin); returns the old and new price, or undefined for an unknown/inactive workshop. */
export async function updateWorkshopPrice(id: number, cena: number) {
  const [workshop] = await select<{ id: number; nazwa: string; cena: number }>(`SELECT id, nazwa, cena FROM warsztaty WHERE id = ? AND status = 'AKTYWNY' LIMIT 1`, [id]);
  if (!workshop) return undefined;

  await execute(`UPDATE warsztaty SET cena = ? WHERE id = ? LIMIT 1`, [cena, id]);
  revalidateTag(WORKSHOPS_TAG, "max");
  return { workshopId: id, workshopName: workshop.nazwa, oldPrice: num(workshop.cena), newPrice: cena };
}
